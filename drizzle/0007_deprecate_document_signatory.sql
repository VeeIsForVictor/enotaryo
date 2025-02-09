DROP TABLE "app"."document_signatory" CASCADE;--> statement-breakpoint
ALTER TABLE "app"."signatory_session" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;