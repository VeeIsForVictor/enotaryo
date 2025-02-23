CREATE TABLE "app"."push_subscription" (
	"user_id" text PRIMARY KEY NOT NULL,
	"push_subscription" json
);
--> statement-breakpoint
ALTER TABLE "app"."push_subscription" ADD CONSTRAINT "push_subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "app"."user"("id") ON DELETE no action ON UPDATE no action;