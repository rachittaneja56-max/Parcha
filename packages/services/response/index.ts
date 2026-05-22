import { db, eq, sql } from "@repo/database";
import { formsTable, analyticsTable, responsesTable } from "@repo/database/schema";
import { appEventBus } from "../events";
import { z } from "zod";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

class ResponseService {
  public async trackView(slug: string) {
    const form = await db.query.formsTable.findFirst({
      where: eq(formsTable.slug, slug),
    });

    if (!form) {
      throw new Error("Form not found");
    }

    await db.insert(analyticsTable)
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
  }

  public async submitResponse(
    slug: string,
    payload: Record<string, any>,
    honeypotField?: string,
    fingerprint?: string
  ) {
    const form = await db.query.formsTable.findFirst({
      where: eq(formsTable.slug, slug),
    });

    if (!form || form.visibility === "unpublished") {
      throw new Error("Form not found or unpublished");
    }

    if (honeypotField && honeypotField.length > 0) {
      // Spam check: drop silently
      return { success: true, message: "Response submitted" };
    }

    if (fingerprint) {
      const now = Date.now();
      const windowTime = 10 * 60 * 1000; // 10 minutes
      const record = rateLimitMap.get(fingerprint);

      if (record && record.resetAt > now) {
        if (record.count >= 3) {
          throw new Error("Rate limit exceeded");
        }
        record.count += 1;
      } else {
        rateLimitMap.set(fingerprint, { count: 1, resetAt: now + windowTime });
      }
    }

    const schemaShape: Record<string, z.ZodTypeAny> = {};
    const formSchema = Array.isArray(form.schema) ? form.schema : [];
    
    for (const field of formSchema) {
      if (field.required) {
        schemaShape[field.id] = z
          .any()
          .refine(
            (val) => val !== undefined && val !== null && val !== "",
            { message: `Field ${field.id} is required` }
          );
      } else {
        schemaShape[field.id] = z.any().optional();
      }
    }

    const dynamicSchema = z.object(schemaShape);
    
    // Will throw ZodError if validation fails
    const parsedPayload = dynamicSchema.parse(payload);

    await db.transaction(async (tx) => {
      const [newResponse] = await tx
        .insert(responsesTable)
        .values({
          formId: form.id,
          payload: parsedPayload,
          respondentFingerprint: fingerprint,
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

    return { success: true, message: "Response submitted" };
  }
}

export const responseService = new ResponseService();
export default ResponseService;
