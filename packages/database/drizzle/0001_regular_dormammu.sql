CREATE TYPE "public"."form_theme" AS ENUM('standard_dark', 'git_commit', 'mongo_shell');--> statement-breakpoint
CREATE TYPE "public"."form_visibility" AS ENUM('public', 'unlisted', 'unpublished');--> statement-breakpoint
CREATE TYPE "public"."token_type" AS ENUM('verification', 'password_reset');--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"visibility" "form_visibility" DEFAULT 'unpublished' NOT NULL,
	"theme" "form_theme" DEFAULT 'standard_dark' NOT NULL,
	"schema" jsonb NOT NULL,
	"password_hash" varchar(255),
	"expires_at" timestamp,
	"max_responses" integer,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "forms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid NOT NULL,
	"payload" jsonb NOT NULL,
	"respondent_fingerprint" varchar(255),
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics" (
	"form_id" uuid PRIMARY KEY NOT NULL,
	"views" integer DEFAULT 0 NOT NULL,
	"submissions" integer DEFAULT 0 NOT NULL,
	"bounce_rate" numeric DEFAULT '0' NOT NULL,
	"last_submission_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"token" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"type" "token_type" NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(50) DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "responses" ADD CONSTRAINT "responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics" ADD CONSTRAINT "analytics_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE no action ON UPDATE no action;