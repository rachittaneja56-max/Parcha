/**
 * @file trpc.ts
 * @description Core tRPC initialization and procedure definitions for Parcha95.
 * Defines the base context, CSRF middleware, and tiered access procedures:
 * - `publicProcedure`: No auth required.
 * - `protectedProcedure`: Requires a valid user session.
 * - `verifiedProcedure`: Requires a verified email address.
 * - `adminProcedure`: Strict RBAC check requiring 'admin' role.
 *
 * @dependencies
 * - @trpc/server
 * - Drizzle ORM (for RBAC database lookups)
 */
import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";
import { db, eq } from "@repo/database";
import { usersTable } from "@repo/database/schema";

import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

const csrfMiddleware = tRPCContext.middleware(({ ctx, type, next }) => {
  if (type === "mutation") {
    if (!ctx.req?.headers?.["x-csrf-token"]) {
      throw new TRPCError({ code: "FORBIDDEN", message: "CSRF token missing or invalid" });
    }
  }
  return next();
});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure.use(csrfMiddleware);

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const verifiedProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (!ctx.user.emailVerified) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Email verification required." });
  }
  return next({
    ctx,
  });
});

/**
 * @procedure adminProcedure
 * @description Middleware that enforces strict Role-Based Access Control (RBAC).
 * It queries the database to ensure the authenticated user has the 'admin' role.
 * Throws UNAUTHORIZED if the user is missing or not an admin.
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }

  const [dbUser] = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, ctx.user.id));

  if (!dbUser || dbUser.role !== "admin") {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authorized as admin" });
  }

  return next({
    ctx: {
      ...ctx,
      user: {
        ...ctx.user,
        role: dbUser.role,
      },
    },
  });
});
