import type * as trpcExpress from "@trpc/server/adapters/express";
// to get context of express as we are using express for making the calls we are hitting trpc call via route on express
export async function createContext({ req, res }: { req: any; res: any } | any) {
  return { req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
