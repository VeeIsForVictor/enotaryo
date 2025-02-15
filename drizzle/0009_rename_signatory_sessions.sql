ALTER TABLE "app"."signatory_session" RENAME TO "signature";--> statement-breakpoint
ALTER TABLE "app"."otp_transaction" RENAME COLUMN "sessionId" TO "signature_id";--> statement-breakpoint
ALTER TABLE "app"."otp_transaction" DROP CONSTRAINT "otp_transaction_sessionId_signatory_session_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."signature" DROP CONSTRAINT "signatory_session_signatory_id_signatory_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."otp_transaction" ADD CONSTRAINT "otp_transaction_signature_id_signature_id_fk" FOREIGN KEY ("signature_id") REFERENCES "app"."signature"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."signature" ADD CONSTRAINT "signature_signatory_id_signatory_id_fk" FOREIGN KEY ("signatory_id") REFERENCES "app"."signatory"("id") ON DELETE no action ON UPDATE no action;