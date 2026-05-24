CREATE TYPE "public"."form_status" AS ENUM('draft', 'published');--> statement-breakpoint
ALTER TABLE "forms" ALTER COLUMN "visibility" SET DEFAULT 'unlisted';--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "status" "form_status" DEFAULT 'draft' NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "require_auth" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "success_message" varchar(500) DEFAULT 'Response recorded successfully.' NOT NULL;