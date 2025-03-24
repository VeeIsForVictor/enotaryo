ALTER TYPE "public"."status" SET SCHEMA "app";--> statement-breakpoint
CREATE TABLE "app"."document_file" (
	"document_id" uuid NOT NULL,
	"file" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."document_file" ADD CONSTRAINT "document_file_document_id_document_id_fk" FOREIGN KEY ("document_id") REFERENCES "app"."document"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."document" DROP COLUMN "file";