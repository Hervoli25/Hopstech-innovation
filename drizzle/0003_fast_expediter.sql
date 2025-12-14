CREATE TYPE "public"."project_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TABLE "projectTypes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"icon" varchar(100),
	"active" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projectTypes_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD COLUMN "projectType" varchar(255);--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD COLUMN "priority" "project_priority" DEFAULT 'medium' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "project_types_name_idx" ON "projectTypes" USING btree ("name");--> statement-breakpoint
CREATE INDEX "project_types_active_idx" ON "projectTypes" USING btree ("active");--> statement-breakpoint
CREATE INDEX "project_types_order_idx" ON "projectTypes" USING btree ("order");