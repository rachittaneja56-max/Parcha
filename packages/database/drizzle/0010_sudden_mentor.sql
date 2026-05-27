ALTER TABLE "forms" ADD COLUMN "webhook_url" varchar(2048);--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "country" varchar(2);--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "referrer" varchar(2048);--> statement-breakpoint
ALTER TABLE "responses" ADD COLUMN "time_to_complete" integer;