ALTER TABLE "app"."user" DROP CONSTRAINT "user_id_unique";--> statement-breakpoint
ALTER TABLE "app"."user" DROP CONSTRAINT "user_id_signatory_id_fk";
--> statement-breakpoint
ALTER TABLE "app"."user" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "app"."user" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "app"."user" ADD COLUMN "signatory_id" char(19) NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."user" ADD CONSTRAINT "user_signatory_id_signatory_id_fk" FOREIGN KEY ("signatory_id") REFERENCES "app"."signatory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app"."user" ADD CONSTRAINT "user_signatory_id_unique" UNIQUE("signatory_id");