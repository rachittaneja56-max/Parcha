import { eq, sql } from "@repo/database";
import type { db } from "@repo/database";
import { TRPCError } from "@trpc/server";
import { formsTable, analyticsTable, responsesTable } from "@repo/database/schema";
import { appEventBus } from "../events";
import { createResponsePayloadSchema } from "./validation";
import { getCache, setCache, delCache } from "@repo/redis";

class ResponseService {
  constructor(private readonly dbInstance: typeof db) {}

  public async trackView(slug: string) {
    const form = await this.dbInstance.query.formsTable.findFirst({
      where: eq(formsTable.slug, slug),
    });

    if (!form) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Form not found" });
    }

    await this.dbInstance
      .insert(analyticsTable)
      .values({
        formId: form.id,
        views: 1,
        submissions: 0,
        bounceRate: "0",
      })
      .onConflictDoUpdate({
        target: analyticsTable.formId,
        set: { views: sql`${analyticsTable.views} + 1` },
      });

    appEventBus.emit("NEW_VIEW", { formId: form.id });
  }

  public async submitResponse(
    slug: string,
    payload: Record<string, any>,
    honeypotField?: string,
    fingerprint?: string,
    userId?: string,
    analytics?: {
      country?: string;
      referrer?: string;
      timeToComplete?: number;
    }
  ) {
    const form = await this.dbInstance.query.formsTable.findFirst({
      where: eq(formsTable.slug, slug),
    });

    if (!form || form.visibility === "unpublished") {
      throw new TRPCError({ code: "NOT_FOUND", message: "Form not found or unpublished" });
    }

    if (form.requireAuth && !userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authentication required to submit this form",
      });
    }

    if (honeypotField && honeypotField.length > 0) {
      return { success: true, message: "Response submitted" };
    }

    const dynamicSchema = createResponsePayloadSchema(form.schema);
    const parsedPayload = dynamicSchema.parse(payload);

    await this.dbInstance.transaction(async (tx) => {
      const [newResponse] = await tx
        .insert(responsesTable)
        .values({
          formId: form.id,
          payload: parsedPayload,
          respondentFingerprint: fingerprint,
          country: analytics?.country,
          referrer: analytics?.referrer,
          timeToComplete: analytics?.timeToComplete,
        })
        .returning();

      await tx
        .insert(analyticsTable)
        .values({
          formId: form.id,
          views: 0,
          submissions: 1,
          bounceRate: "0",
          lastSubmissionAt: new Date(),
        })
        .onConflictDoUpdate({
          target: analyticsTable.formId,
          set: {
            submissions: sql`${analyticsTable.submissions} + 1`,
            lastSubmissionAt: new Date(),
          },
        });

      appEventBus.emit("NEW_SUBMISSION", {
        formId: form.id,
        response: newResponse,
      });
    });

    await delCache(`responses:${form.id}`);

    if (form.webhookUrl) {
      fetch(form.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "form.submitted",
          formId: form.id,
          formTitle: form.title,
          submittedAt: new Date().toISOString(),
          payload: parsedPayload,
        }),
      }).catch((e) => console.error("Failed to fire webhook:", e));
    }

    return { success: true, message: "Response submitted" };
  }

  public async getResponsesByFormId(formId: string) {
    const cacheKey = `responses:${formId}`;
    const cached = await getCache<any[]>(cacheKey);
    if (cached) return cached;

    const responses = await this.dbInstance.query.responsesTable.findMany({
      where: eq(responsesTable.formId, formId),
      orderBy: (responses, { desc }) => [desc(responses.submittedAt)],
    });

    await setCache(cacheKey, responses, 60 * 5); // cache for 5 minutes

    return responses;
  }
}

export default ResponseService;
