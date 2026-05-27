import { z } from "zod";

export const SubmitResponseSchema = z.object({
  slug: z.string(),
  payload: z.record(z.string(), z.any()),
  honeypotField: z.string().optional(),
  fingerprint: z.string().optional(),
  country: z.string().optional(),
  referrer: z.string().optional(),
  timeToComplete: z.number().optional(),
});

export const TrackViewSchema = z.object({
  slug: z.string(),
  fingerprint: z.string().optional(),
});
