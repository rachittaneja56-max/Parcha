import { db, eq, sql } from "@repo/database";
import { formsTable, analyticsTable, usersTable, settingsTable } from "@repo/database/schema";
import bcrypt from "bcrypt";

class AdminService {
  public async getPlatformTelemetry() {
    const [userCountResult] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable);
    const [formCountResult] = await db.select({ count: sql<number>`count(*)::int` }).from(formsTable);
    const [submissionCountResult] = await db.select({ total: sql<number>`sum(${analyticsTable.submissions})::int` }).from(analyticsTable);

    return {
      totalUsers: userCountResult?.count || 0,
      totalForms: formCountResult?.count || 0,
      totalSubmissions: submissionCountResult?.total || 0,
    };
  }

  public async moderateForm(formId: string, action: "unpublish") {
    if (action === "unpublish") {
      const [updatedForm] = await db.update(formsTable)
        .set({ visibility: "unpublished" })
        .where(eq(formsTable.id, formId))
        .returning();

      if (!updatedForm) {
        throw new Error("Form not found");
      }
      return updatedForm;
    }
    throw new Error("Invalid moderation action");
  }

  public async verifyAdminPassword(userId: string, password: string) {
    const [setting] = await db.select().from(settingsTable).where(eq(settingsTable.key, "ADMIN_PASSWORD"));

    if (!setting) {
      throw new Error("Admin password not configured");
    }

    const isValid = await bcrypt.compare(password, setting.value);
    if (!isValid) {
      throw new Error("Invalid admin password");
    }

    const [updatedUser] = await db.update(usersTable)
      .set({ role: "admin" })
      .where(eq(usersTable.id, userId))
      .returning();

    return updatedUser;
  }

  public async changeAdminPassword(newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [setting] = await db.insert(settingsTable).values({
      key: "ADMIN_PASSWORD",
      value: hashedPassword,
    }).onConflictDoUpdate({
      target: settingsTable.key,
      set: { value: hashedPassword },
    }).returning();

    return setting;
  }
}

export const adminService = new AdminService();
export default AdminService;
