CREATE TYPE "public"."change_request_status" AS ENUM('pending', 'reviewing', 'approved', 'rejected', 'implemented');--> statement-breakpoint
CREATE TYPE "public"."change_request_type" AS ENUM('scope', 'timeline', 'budget', 'requirements', 'other');--> statement-breakpoint
CREATE TYPE "public"."installment_status" AS ENUM('pending', 'paid', 'overdue', 'waived');--> statement-breakpoint
CREATE TYPE "public"."payment_plan_status" AS ENUM('active', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."payment_plan_type" AS ENUM('milestone', 'installment', 'custom');--> statement-breakpoint
CREATE TYPE "public"."phase_status" AS ENUM('pending', 'in_progress', 'completed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."progress_calculation_method" AS ENUM('milestone', 'phase', 'deliverable', 'hybrid', 'manual');--> statement-breakpoint
CREATE TYPE "public"."status_change_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."status_change_request_type" AS ENUM('pause', 'cancel', 'resume', 'archive');--> statement-breakpoint
CREATE TABLE "changeRequests" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"requestedBy" integer NOT NULL,
	"type" "change_request_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"currentValue" jsonb,
	"proposedValue" jsonb,
	"impactAssessment" jsonb,
	"status" "change_request_status" DEFAULT 'pending' NOT NULL,
	"adminNotes" text,
	"reviewedBy" integer,
	"reviewedAt" timestamp with time zone,
	"implementedAt" timestamp with time zone,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paymentInstallments" (
	"id" serial PRIMARY KEY NOT NULL,
	"planId" integer NOT NULL,
	"amount" integer NOT NULL,
	"dueDate" timestamp with time zone NOT NULL,
	"description" text,
	"linkedMilestone" varchar(255),
	"status" "installment_status" DEFAULT 'pending' NOT NULL,
	"paidAt" timestamp with time zone,
	"invoiceId" integer,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paymentPlans" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"totalAmount" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'USD' NOT NULL,
	"type" "payment_plan_type" NOT NULL,
	"status" "payment_plan_status" DEFAULT 'active' NOT NULL,
	"downPaymentAmount" integer DEFAULT 0,
	"downPaymentPaid" boolean DEFAULT false NOT NULL,
	"downPaymentPaidAt" timestamp with time zone,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectPhases" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"weight" integer DEFAULT 0 NOT NULL,
	"status" "phase_status" DEFAULT 'pending' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"orderIndex" integer DEFAULT 0 NOT NULL,
	"startDate" timestamp with time zone,
	"endDate" timestamp with time zone,
	"milestoneIds" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projectStatusChanges" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"requestedBy" integer NOT NULL,
	"fromStatus" varchar(50) NOT NULL,
	"toStatus" varchar(50) NOT NULL,
	"reason" text NOT NULL,
	"requestType" "status_change_request_type" NOT NULL,
	"status" "status_change_request_status" DEFAULT 'pending' NOT NULL,
	"approvedBy" integer,
	"approvedAt" timestamp with time zone,
	"adminNotes" text,
	"metadata" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD COLUMN "progressCalculationMethod" "progress_calculation_method" DEFAULT 'hybrid';--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD COLUMN "autoProgressTracking" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD COLUMN "currentPhaseId" integer;--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD COLUMN "paymentPlanId" integer;--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD COLUMN "lastProgressUpdate" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD COLUMN "lastProgressUpdateBy" integer;--> statement-breakpoint
ALTER TABLE "changeRequests" ADD CONSTRAINT "changeRequests_projectId_clientProjectsExtended_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."clientProjectsExtended"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "changeRequests" ADD CONSTRAINT "changeRequests_requestedBy_users_id_fk" FOREIGN KEY ("requestedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "changeRequests" ADD CONSTRAINT "changeRequests_reviewedBy_users_id_fk" FOREIGN KEY ("reviewedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentInstallments" ADD CONSTRAINT "paymentInstallments_planId_paymentPlans_id_fk" FOREIGN KEY ("planId") REFERENCES "public"."paymentPlans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentInstallments" ADD CONSTRAINT "paymentInstallments_invoiceId_invoices_id_fk" FOREIGN KEY ("invoiceId") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paymentPlans" ADD CONSTRAINT "paymentPlans_projectId_clientProjectsExtended_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."clientProjectsExtended"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectPhases" ADD CONSTRAINT "projectPhases_projectId_clientProjectsExtended_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."clientProjectsExtended"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectStatusChanges" ADD CONSTRAINT "projectStatusChanges_projectId_clientProjectsExtended_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."clientProjectsExtended"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectStatusChanges" ADD CONSTRAINT "projectStatusChanges_requestedBy_users_id_fk" FOREIGN KEY ("requestedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projectStatusChanges" ADD CONSTRAINT "projectStatusChanges_approvedBy_users_id_fk" FOREIGN KEY ("approvedBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "change_requests_project_id_idx" ON "changeRequests" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "change_requests_requested_by_idx" ON "changeRequests" USING btree ("requestedBy");--> statement-breakpoint
CREATE INDEX "change_requests_status_idx" ON "changeRequests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "change_requests_type_idx" ON "changeRequests" USING btree ("type");--> statement-breakpoint
CREATE INDEX "change_requests_created_at_idx" ON "changeRequests" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "payment_installments_plan_id_idx" ON "paymentInstallments" USING btree ("planId");--> statement-breakpoint
CREATE INDEX "payment_installments_status_idx" ON "paymentInstallments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payment_installments_due_date_idx" ON "paymentInstallments" USING btree ("dueDate");--> statement-breakpoint
CREATE INDEX "payment_installments_invoice_id_idx" ON "paymentInstallments" USING btree ("invoiceId");--> statement-breakpoint
CREATE INDEX "payment_plans_project_id_idx" ON "paymentPlans" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "payment_plans_status_idx" ON "paymentPlans" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_phases_project_id_idx" ON "projectPhases" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "project_phases_status_idx" ON "projectPhases" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_phases_order_idx" ON "projectPhases" USING btree ("orderIndex");--> statement-breakpoint
CREATE INDEX "project_status_changes_project_id_idx" ON "projectStatusChanges" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "project_status_changes_requested_by_idx" ON "projectStatusChanges" USING btree ("requestedBy");--> statement-breakpoint
CREATE INDEX "project_status_changes_status_idx" ON "projectStatusChanges" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_status_changes_created_at_idx" ON "projectStatusChanges" USING btree ("createdAt");--> statement-breakpoint
ALTER TABLE "clientProjectsExtended" ADD CONSTRAINT "clientProjectsExtended_lastProgressUpdateBy_users_id_fk" FOREIGN KEY ("lastProgressUpdateBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_projects_ext_current_phase_id_idx" ON "clientProjectsExtended" USING btree ("currentPhaseId");