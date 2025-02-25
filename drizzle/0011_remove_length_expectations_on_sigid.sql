ALTER TABLE "app"."signatory" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."user" ALTER COLUMN "signatory_id" SET DATA TYPE text;