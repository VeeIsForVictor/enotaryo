ALTER TABLE "app"."document_signatory" RENAME COLUMN "documentId" TO "document_id";--> statement-breakpoint
ALTER TABLE "app"."document_signatory" RENAME COLUMN "signatoryId" TO "signatory_id";--> statement-breakpoint
ALTER TABLE "app"."document_signatory" DROP CONSTRAINT "document_signatory_documentId_document_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."document_signatory" DROP CONSTRAINT "document_signatory_signatoryId_signatory_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."document_signatory" ADD CONSTRAINT "document_signatory_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "app"."document"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."document_signatory" ADD CONSTRAINT "document_signatory_signatory_id_signatory_id_fk" FOREIGN KEY ("signatory_id") REFERENCES "app"."signatory"("id") ON DELETE no action ON UPDATE no action;