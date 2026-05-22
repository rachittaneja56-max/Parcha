import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../../trpc";
import { formService } from "../../services";
import { CreateFormSchema, UpdateSchemaSchema, UpdateSettingsSchema, GetFormByIdSchema } from "@repo/validators";

export const formRouter = router({
  create: protectedProcedure
    .input(CreateFormSchema)
    .mutation(async ({ ctx, input }) => {
      return await formService.createForm(ctx.user.id, input.title, input.theme);
    }),

  updateSchema: protectedProcedure
    .input(UpdateSchemaSchema)
    .mutation(async ({ ctx, input }) => {
      return await formService.updateSchema(input.formId, ctx.user.id, input.schema);
    }),

  updateSettings: protectedProcedure
    .input(UpdateSettingsSchema)
    .mutation(async ({ ctx, input }) => {
      return await formService.updateSettings(input.formId, ctx.user.id, input.updates);
    }),

  getMyForms: protectedProcedure
    .query(async ({ ctx }) => {
      return await formService.getMyForms(ctx.user.id);
    }),

  getFormById: protectedProcedure
    .input(GetFormByIdSchema)
    .query(async ({ ctx, input }) => {
      const form = await formService.getFormById(input.formId);
      if (!form) {
        throw new Error("Form not found");
      }
      return form;
    }),
});
