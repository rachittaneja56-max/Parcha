import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  getSupportedAuthenticationProviders: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/supported-providers"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
    .query(async () => {
      const supportedMethods = await userService.getAuthenticationMethods();
      return supportedMethods;
    }),

  googleCallback: publicProcedure
    .meta({ openapi: { method: "GET", path: "/authentication/google-callback", tags: TAGS } })
    .input(z.object({ code: z.string() }))
    .output(z.any())
    .query(async ({ input, ctx }) => {
      try {
        const user = await userService.handleGoogleCallback(input.code);
        if (ctx?.res) {
          ctx.res.redirect("http://localhost:3000/?login=success&email=" + encodeURIComponent(user.email) + "&name=" + encodeURIComponent(user.fullName));
          return { success: true, redirecting: true };
        }
        return { success: true, user };
      } catch (error: any) {
        console.error("Google Auth Error:", error);
        if (ctx?.res) {
          ctx.res.redirect("http://localhost:3000/?login=error&message=" + encodeURIComponent(error?.message || "Unknown error"));
          return { success: false, redirecting: true };
        }
        throw error;
      }
    }),
});
