import { router, adminProcedure, protectedProcedure } from "../../trpc";
import { adminService } from "../../services";
import { ModerateFormSchema, ChangeAdminPasswordSchema, VerifyAdminPasswordSchema } from "@repo/validators";
import { zodUndefinedModel } from "@repo/validators";

export const adminRouter = router({
  getTelemetry: adminProcedure
    .input(zodUndefinedModel)
    .query(async () => {
      return await adminService.getPlatformTelemetry();
    }),

  moderateForm: adminProcedure
    .input(ModerateFormSchema)
    .mutation(async ({ input }) => {
      return await adminService.moderateForm(input.formId, input.action);
    }),

  changePassword: adminProcedure
    .input(ChangeAdminPasswordSchema)
    .mutation(async ({ input }) => {
      await adminService.changeAdminPassword(input.newPassword);
      return { success: true };
    }),

  verifyPassword: protectedProcedure
    .input(VerifyAdminPasswordSchema)
    .mutation(async ({ input, ctx }) => {
      await adminService.verifyAdminPassword(ctx.user.id, input.password);
      return { success: true };
    }),
});
