/**
 * @file user.ts
 * @description Represents the central User model for Parcha95.
 * This file defines the PostgreSQL schema for users using Drizzle ORM.
 * Key fields include authentication (email, passwordHash) and RBAC (role).
 * Roles dictate whether a user is a standard creator ('user') or has global dashboard access ('admin').
 *
 * @dependencies
 * - Drizzle ORM for schema definition
 * - relations (links users to their created forms)
 */
import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { formsTable } from "./forms";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),

  fullName: varchar("full_name", { length: 80 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false),
  role: varchar("role", { length: 50 }).default("user").notNull().$type<"admin" | "user">(),

  profileImageUrl: text("profile_image_url"),
  passwordHash: varchar("password_hash", { length: 255 }),


  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

export type SelectUser = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export const usersRelations = relations(usersTable, ({ many }) => ({
  forms: many(formsTable),
}));
