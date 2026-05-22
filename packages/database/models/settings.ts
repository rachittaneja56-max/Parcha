import { pgTable, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()).notNull().defaultNow(),
});
