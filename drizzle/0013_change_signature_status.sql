CREATE TYPE "public"."status" AS ENUM('pending', 'approved', 'denied');--> statement-breakpoint
ALTER TABLE "app"."signature" ADD COLUMN "status_enum" "status" DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "app"."signature" DROP COLUMN "is_verified";