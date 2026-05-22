import { z } from "zod";

export const ModerateFormSchema = z.object({
  formId: z.string().uuid().describe("The unique identifier of the form to moderate"),
  action: z.enum(["unpublish"]).describe("The moderation action to apply"),
});

export const ChangeAdminPasswordSchema = z.object({
  currentPassword: z.string().describe("The current admin dashboard password"),
  newPassword: z.string().min(8).describe("The new admin dashboard password"),
});

export const VerifyAdminPasswordSchema = z.object({
  password: z.string().describe("The admin dashboard password to verify"),
});
