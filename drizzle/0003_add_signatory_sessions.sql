CREATE TABLE "app"."signatory_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"signatory_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "app"."signatory_session" ADD CONSTRAINT "signatory_session_signatory_id_signatory_id_fk" FOREIGN KEY ("signatory_id") REFERENCES "app"."signatory"("id") ON DELETE no action ON UPDATE no action;