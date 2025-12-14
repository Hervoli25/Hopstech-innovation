CREATE TYPE "public"."notification_action_type" AS ENUM('none', 'view', 'approve', 'respond', 'download', 'custom');--> statement-breakpoint
CREATE TYPE "public"."notification_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "priority" "notification_priority" DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "actionType" "notification_action_type" DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "actionUrl" varchar(500);--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "actionLabel" varchar(100);--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "groupKey" varchar(255);--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "snoozedUntil" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "notifications_priority_idx" ON "notifications" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "notifications_group_key_idx" ON "notifications" USING btree ("groupKey");