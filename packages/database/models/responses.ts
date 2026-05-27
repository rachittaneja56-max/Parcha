/**
 * @file responses.ts
 * @description Defines the Response schema for Parcha95.
 * A Response represents a single submission by an end-user to a specific Form.
 * The actual answers are stored dynamically in the `payload` JSONB column.
 * Includes fingerprinting to prevent multiple submissions if configured.
 *
 * @dependencies
 * - Drizzle ORM for schema definition
 * - formsTable (Many-to-1 relationship linking back to the parent form)
 */
import { pgTable, uuid, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { formsTable } from "./forms";

export const responsesTable = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").references(() => formsTable.id).notNull(),
  payload: jsonb("payload").$type<Record<string, any>>().notNull(),
  respondentFingerprint: varchar("respondent_fingerprint", { length: 255 }),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const responsesRelations = relations(responsesTable, ({ one }) => ({
  form: one(formsTable, {
    fields: [responsesTable.formId],
    references: [formsTable.id],
  }),
}));
