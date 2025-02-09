CREATE TABLE "app"."otp_transaction" (
	"id" bigint PRIMARY KEY NOT NULL,
	"sessionId" uuid,
	"is_completed" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "app"."otp_transaction" ADD CONSTRAINT "otp_transaction_sessionId_signatory_session_id_fk" FOREIGN KEY ("sessionId") REFERENCES "app"."signatory_session"("id") ON DELETE no action ON UPDATE no action;