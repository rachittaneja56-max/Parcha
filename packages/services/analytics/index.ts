import { eq, and, desc } from "@repo/database";
import type { db } from "@repo/database";
import { TRPCError } from "@trpc/server";
import { formsTable, analyticsTable, responsesTable } from "@repo/database/schema";

class AnalyticsService {
  constructor(private readonly dbInstance: typeof db) {}

  public async getDashboardStats(formId: string, creatorId: string) {
    const form = await this.dbInstance.query.formsTable.findFirst({
      where: and(eq(formsTable.id, formId), eq(formsTable.creatorId, creatorId)),
    });

    if (!form) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Form not found or unauthorized" });
    }
    const stats = await this.dbInstance.query.analyticsTable.findFirst({
      where: eq(analyticsTable.formId, formId),
    });

    const views = stats?.views || 0;
    const submissions = stats?.submissions || 0;
    let conversionRate = 0;
    if (views > 0) {
      conversionRate = (submissions / views) * 100;
    }

    const recentResponses = await this.dbInstance.query.responsesTable.findMany({
      where: eq(responsesTable.formId, formId),
      orderBy: [desc(responsesTable.submittedAt)],
      limit: 20,
    });

    return {
      stats: {
        views,
        submissions,
        conversionRate,
      },
      liveFeed: recentResponses,
    };
  }

  public async getAllResponses(formId: string, creatorId: string, limit: number, offset: number) {
    const form = await this.dbInstance.query.formsTable.findFirst({
      where: and(eq(formsTable.id, formId), eq(formsTable.creatorId, creatorId)),
    });

    if (!form) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Form not found or unauthorized" });
    }

    const responses = await this.dbInstance.query.responsesTable.findMany({
      where: eq(responsesTable.formId, formId),
      orderBy: [desc(responsesTable.submittedAt)],
      limit,
      offset,
    });

    return responses;
  }
}


export default AnalyticsService;
