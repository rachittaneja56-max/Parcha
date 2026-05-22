import { router, publicProcedure } from "../../trpc";
import { responseService } from "../../services";
import { SubmitResponseSchema, TrackViewSchema } from "@repo/validators";

export const responseRouter = router({
  submit: publicProcedure
    .input(SubmitResponseSchema)
    .mutation(async ({ input }) => {
      return await responseService.submitResponse(
        input.slug,
        input.payload,
        input.honeypotField,
        input.fingerprint
      );
    }),

  trackView: publicProcedure
    .input(TrackViewSchema)
    .mutation(async ({ input }) => {
      await responseService.trackView(input.slug);
      return { success: true };
    }),
});
