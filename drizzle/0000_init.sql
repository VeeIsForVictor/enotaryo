CREATE SCHEMA "app";
--> statement-breakpoint
CREATE TABLE "app"."document" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text
);
--> statement-breakpoint
CREATE TABLE "app"."document_signatory" (
	"identifier" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"documentId" uuid NOT NULL,
	"signatoryId" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "app"."signatory" (
	"id" char(19) PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
ALTER TABLE "app"."document_signatory" ADD CONSTRAINT "document_signatory_documentId_document_id_fk" FOREIGN KEY ("documentId") REFERENCES "app"."document"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."document_signatory" ADD CONSTRAINT "document_signatory_signatoryId_signatory_id_fk" FOREIGN KEY ("signatoryId") REFERENCES "app"."signatory"("id") ON DELETE no action ON UPDATE no action;