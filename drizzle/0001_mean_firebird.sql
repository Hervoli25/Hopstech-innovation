CREATE TYPE "public"."magic_link_status" AS ENUM('pending', 'used', 'expired');--> statement-breakpoint
CREATE TYPE "public"."project_inquiry_status" AS ENUM('new', 'reviewing', 'accepted', 'rejected');--> statement-breakpoint
ALTER TYPE "public"."user_role" ADD VALUE 'client';--> statement-breakpoint
CREATE TABLE "clientProjects" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"role" varchar(100) DEFAULT 'client' NOT NULL,
	"accessGrantedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"accessGrantedBy" integer,
	"notes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "magicLinks" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320) NOT NULL,
	"token" varchar(255) NOT NULL,
	"status" "magic_link_status" DEFAULT 'pending' NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"usedAt" timestamp with time zone,
	"ip" varchar(45),
	"userAgent" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "magicLinks_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "projectInquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(320) NOT NULL,
	"company" varchar(255),
	"phone" varchar(50),
	"projectType" varchar(100) NOT NULL,
	"budget" varchar(100),
	"timeline" varchar(100),
	"description" text NOT NULL,
	"requirements" jsonb DEFAULT '[]'::jsonb,
	"status" "project_inquiry_status" DEFAULT 'new' NOT NULL,
	"assignedTo" integer,
	"notes" text,
	"ip" varchar(45),
	"userAgent" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"reviewedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "projectUpdates" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"authorId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"type" varchar(50) DEFAULT 'general' NOT NULL,
	"visibility" varchar(50) DEFAULT 'clients' NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb,
	"published" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"publishedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "clientProjects" ADD CONSTRAINT "clientProjects_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientProjects" ADD CONSTRAINT "clientProjects_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientProjects" ADD CONSTRAINT "clientProjects_accessGrantedBy_users_id_fk" FOREIGN KEY ("accessGrantedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectInquiries" ADD CONSTRAINT "projectInquiries_assignedTo_users_id_fk" FOREIGN KEY ("assignedTo") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectUpdates" ADD CONSTRAINT "projectUpdates_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectUpdates" ADD CONSTRAINT "projectUpdates_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_projects_user_id_idx" ON "clientProjects" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "client_projects_project_id_idx" ON "clientProjects" USING btree ("projectId");--> statement-breakpoint
CREATE UNIQUE INDEX "client_projects_user_project_idx" ON "clientProjects" USING btree ("userId","projectId");--> statement-breakpoint
CREATE UNIQUE INDEX "magic_links_token_idx" ON "magicLinks" USING btree ("token");--> statement-breakpoint
CREATE INDEX "magic_links_email_idx" ON "magicLinks" USING btree ("email");--> statement-breakpoint
CREATE INDEX "magic_links_status_idx" ON "magicLinks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "magic_links_expires_at_idx" ON "magicLinks" USING btree ("expiresAt");--> statement-breakpoint
CREATE INDEX "project_inquiries_email_idx" ON "projectInquiries" USING btree ("email");--> statement-breakpoint
CREATE INDEX "project_inquiries_status_idx" ON "projectInquiries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_inquiries_created_at_idx" ON "projectInquiries" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "project_inquiries_project_type_idx" ON "projectInquiries" USING btree ("projectType");--> statement-breakpoint
CREATE INDEX "project_updates_project_id_idx" ON "projectUpdates" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "project_updates_author_id_idx" ON "projectUpdates" USING btree ("authorId");--> statement-breakpoint
CREATE INDEX "project_updates_type_idx" ON "projectUpdates" USING btree ("type");--> statement-breakpoint
CREATE INDEX "project_updates_published_idx" ON "projectUpdates" USING btree ("published");--> statement-breakpoint
CREATE INDEX "project_updates_published_at_idx" ON "projectUpdates" USING btree ("publishedAt");