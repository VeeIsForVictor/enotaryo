ALTER TABLE "app"."signatory" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."user" ALTER COLUMN "signatory_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."document" ADD COLUMN "file" text;--> statement-breakpoint
ALTER TABLE "app"."signature" ADD COLUMN "document_id" uuid;--> statement-breakpoint
ALTER TABLE "app"."signature" ADD CONSTRAINT "signature_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "app"."document"("id") ON DELETE no action ON UPDATE no action;