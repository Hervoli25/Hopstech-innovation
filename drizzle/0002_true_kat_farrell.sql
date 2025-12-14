CREATE TYPE "public"."invoice_status" AS ENUM('draft', 'pending', 'paid', 'overdue', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('text', 'file', 'system');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('project_update', 'message', 'invoice', 'ticket', 'system');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('planning', 'in_progress', 'on_hold', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."ticket_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'in_progress', 'waiting_response', 'resolved', 'closed');--> statement-breakpoint
CREATE TABLE "activityLog" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"action" varchar(255) NOT NULL,
	"entity" varchar(100) NOT NULL,
	"entityId" integer,
	"description" text NOT NULL,
	"metadata" jsonb,
	"ip" varchar(45),
	"userAgent" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clientProjectsExtended" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "project_status" DEFAULT 'planning' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"budget" integer,
	"startDate" timestamp with time zone,
	"endDate" timestamp with time zone,
	"estimatedHours" integer,
	"actualHours" integer DEFAULT 0,
	"technologies" jsonb DEFAULT '[]'::jsonb,
	"milestones" jsonb DEFAULT '[]'::jsonb,
	"deliverables" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"completedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer,
	"invoiceNumber" varchar(100) NOT NULL,
	"status" "invoice_status" DEFAULT 'draft' NOT NULL,
	"amount" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"tax" integer DEFAULT 0,
	"discount" integer DEFAULT 0,
	"total" integer NOT NULL,
	"items" jsonb NOT NULL,
	"notes" text,
	"dueDate" timestamp with time zone,
	"paidAt" timestamp with time zone,
	"paymentMethod" varchar(100),
	"paymentReference" varchar(255),
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invoices_invoiceNumber_unique" UNIQUE("invoiceNumber")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"senderId" integer NOT NULL,
	"recipientId" integer NOT NULL,
	"projectId" integer,
	"content" text NOT NULL,
	"type" "message_type" DEFAULT 'text' NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"read" boolean DEFAULT false NOT NULL,
	"readAt" timestamp with time zone,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"link" varchar(500),
	"read" boolean DEFAULT false NOT NULL,
	"readAt" timestamp with time zone,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectFiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"uploadedBy" integer NOT NULL,
	"fileName" varchar(255) NOT NULL,
	"fileUrl" varchar(1000) NOT NULL,
	"fileSize" integer NOT NULL,
	"fileType" varchar(100) NOT NULL,
	"category" varchar(100) DEFAULT 'general',
	"description" text,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "supportTickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer,
	"ticketNumber" varchar(100) NOT NULL,
	"subject" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"status" "ticket_status" DEFAULT 'open' NOT NULL,
	"priority" "ticket_priority" DEFAULT 'medium' NOT NULL,
	"category" varchar(100) DEFAULT 'general',
	"assignedTo" integer,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"resolvedAt" timestamp with time zone,
	"closedAt" timestamp with time zone,
	CONSTRAINT "supportTickets_ticketNumber_unique" UNIQUE("ticketNumber")
);
--> statement-breakpoint
CREATE TABLE "ticketMessages" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticketId" integer NOT NULL,
	"authorId" integer NOT NULL,
	"content" text NOT NULL,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"isInternal" boolean DEFAULT false,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userProfiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"avatar" varchar(500),
	"bio" text,
	"company" varchar(255),
	"position" varchar(255),
	"phone" varchar(50),
	"website" varchar(500),
	"location" varchar(255),
	"timezone" varchar(100),
	"preferences" jsonb DEFAULT '{}'::jsonb,
	"notificationSettings" jsonb DEFAULT '{"email":true,"push":true,"projectUpdates":true,"messages":true,"invoices":true}'::jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "userProfiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
ALTER TABLE "activityLog" ADD CONSTRAINT "activityLog_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD CONSTRAINT "clientProjectsExtended_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_projectId_clientProjectsExtended_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."clientProjectsExtended"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_users_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipientId_users_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_projectId_clientProjectsExtended_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."clientProjectsExtended"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectFiles" ADD CONSTRAINT "projectFiles_projectId_clientProjectsExtended_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."clientProjectsExtended"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectFiles" ADD CONSTRAINT "projectFiles_uploadedBy_users_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportTickets" ADD CONSTRAINT "supportTickets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportTickets" ADD CONSTRAINT "supportTickets_projectId_clientProjectsExtended_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."clientProjectsExtended"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supportTickets" ADD CONSTRAINT "supportTickets_assignedTo_users_id_fk" FOREIGN KEY ("assignedTo") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticketMessages" ADD CONSTRAINT "ticketMessages_ticketId_supportTickets_id_fk" FOREIGN KEY ("ticketId") REFERENCES "public"."supportTickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticketMessages" ADD CONSTRAINT "ticketMessages_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userProfiles" ADD CONSTRAINT "userProfiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_log_user_id_idx" ON "activityLog" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "activity_log_entity_idx" ON "activityLog" USING btree ("entity");--> statement-breakpoint
CREATE INDEX "activity_log_entity_id_idx" ON "activityLog" USING btree ("entityId");--> statement-breakpoint
CREATE INDEX "activity_log_created_at_idx" ON "activityLog" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "client_projects_ext_user_id_idx" ON "clientProjectsExtended" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "client_projects_ext_status_idx" ON "clientProjectsExtended" USING btree ("status");--> statement-breakpoint
CREATE INDEX "client_projects_ext_created_at_idx" ON "clientProjectsExtended" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "invoices_user_id_idx" ON "invoices" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "invoices_project_id_idx" ON "invoices" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "invoices_status_idx" ON "invoices" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_invoice_number_idx" ON "invoices" USING btree ("invoiceNumber");--> statement-breakpoint
CREATE INDEX "invoices_due_date_idx" ON "invoices" USING btree ("dueDate");--> statement-breakpoint
CREATE INDEX "messages_sender_id_idx" ON "messages" USING btree ("senderId");--> statement-breakpoint
CREATE INDEX "messages_recipient_id_idx" ON "messages" USING btree ("recipientId");--> statement-breakpoint
CREATE INDEX "messages_project_id_idx" ON "messages" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "messages_read_idx" ON "messages" USING btree ("read");--> statement-breakpoint
CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "notifications_user_id_idx" ON "notifications" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "notifications_type_idx" ON "notifications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "notifications_read_idx" ON "notifications" USING btree ("read");--> statement-breakpoint
CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "project_files_project_id_idx" ON "projectFiles" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "project_files_uploaded_by_idx" ON "projectFiles" USING btree ("uploadedBy");--> statement-breakpoint
CREATE INDEX "project_files_category_idx" ON "projectFiles" USING btree ("category");--> statement-breakpoint
CREATE INDEX "support_tickets_user_id_idx" ON "supportTickets" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "support_tickets_project_id_idx" ON "supportTickets" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "support_tickets_status_idx" ON "supportTickets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "support_tickets_priority_idx" ON "supportTickets" USING btree ("priority");--> statement-breakpoint
CREATE UNIQUE INDEX "support_tickets_ticket_number_idx" ON "supportTickets" USING btree ("ticketNumber");--> statement-breakpoint
CREATE INDEX "ticket_messages_ticket_id_idx" ON "ticketMessages" USING btree ("ticketId");--> statement-breakpoint
CREATE INDEX "ticket_messages_author_id_idx" ON "ticketMessages" USING btree ("authorId");--> statement-breakpoint
CREATE INDEX "ticket_messages_created_at_idx" ON "ticketMessages" USING btree ("createdAt");--> statement-breakpoint
CREATE UNIQUE INDEX "user_profiles_user_id_idx" ON "userProfiles" USING btree ("userId");