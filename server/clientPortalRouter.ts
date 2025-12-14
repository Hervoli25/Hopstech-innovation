import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  projectInquiries,
  clientProjectsExtended,
  projectFiles,
  userProfiles,
  invoices,
  supportTickets,
  ticketMessages,
  messages,
  notifications,
  activityLog,
  projectTypes
} from "../drizzle/schema";
import { eq, and, desc, asc, sql, or, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const clientPortalRouter = router({
  /**
   * ========================================
   * PUBLIC ENDPOINTS
   * ========================================
   */

  // Submit project inquiry (existing endpoint)
  submitInquiry: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        company: z.string().optional(),
        phone: z.string().optional(),
        projectType: z.string().min(1, "Project type is required"),
        budget: z.string().optional(),
        timeline: z.string().optional(),
        description: z.string().min(10, "Description must be at least 10 characters"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const ip = ctx.req?.headers?.['x-forwarded-for'] as string ||
                 ctx.req?.headers?.['x-real-ip'] as string ||
                 'unknown';
      const userAgent = ctx.req?.headers?.['user-agent'] || 'unknown';

      await db.insert(projectInquiries).values({
        name: input.name,
        email: input.email,
        company: input.company || null,
        phone: input.phone || null,
        projectType: input.projectType,
        budget: input.budget || null,
        timeline: input.timeline || null,
        description: input.description,
        status: "new",
        ip,
        userAgent,
      });

      return {
        success: true,
        message: "Thank you for your project inquiry! We'll review it and get back to you within 24 hours.",
      };
    }),

  /**
   * ========================================
   * PROFILE MANAGEMENT
   * ========================================
   */

  // Get user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, ctx.user.id))
      .limit(1);

    if (profile.length === 0) {
      const newProfile = await db
        .insert(userProfiles)
        .values({
          userId: ctx.user.id,
          preferences: {},
          notificationSettings: {
            email: true,
            push: true,
            projectUpdates: true,
            messages: true,
            invoices: true,
          },
        })
        .returning();

      return newProfile[0];
    }

    return profile[0];
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        avatar: z.string().optional(),
        bio: z.string().optional(),
        company: z.string().optional(),
        position: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        location: z.string().optional(),
        timezone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const updated = await db
        .update(userProfiles)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, ctx.user.id))
        .returning();

      await db.insert(activityLog).values({
        userId: ctx.user.id,
        action: "profile_updated",
        entity: "profile",
        entityId: ctx.user.id,
        description: `${ctx.user.name} updated their profile`,
        metadata: { changes: input },
      });

      return updated[0];
    }),

  // Update notification settings
  updateNotificationSettings: protectedProcedure
    .input(
      z.object({
        email: z.boolean().optional(),
        push: z.boolean().optional(),
        projectUpdates: z.boolean().optional(),
        messages: z.boolean().optional(),
        invoices: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const profile = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, ctx.user.id))
        .limit(1);

      const currentSettings = profile[0]?.notificationSettings || {};
      const newSettings = { ...currentSettings, ...input };

      const updated = await db
        .update(userProfiles)
        .set({
          notificationSettings: newSettings,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, ctx.user.id))
        .returning();

      return updated[0];
    }),

  /**
   * ========================================
   * PROJECT MANAGEMENT
   * ========================================
   */

  // Get dashboard stats
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const [projectStats] = await db
      .select({
        total: count(),
        active: sql<number>`count(*) filter (where ${clientProjectsExtended.status} = 'in_progress')`,
        completed: sql<number>`count(*) filter (where ${clientProjectsExtended.status} = 'completed')`,
      })
      .from(clientProjectsExtended)
      .where(eq(clientProjectsExtended.userId, ctx.user.id));

    const [messageStats] = await db
      .select({
        unread: sql<number>`count(*) filter (where ${messages.read} = false)`,
      })
      .from(messages)
      .where(eq(messages.recipientId, ctx.user.id));

    const [ticketStats] = await db
      .select({
        open: sql<number>`count(*) filter (where ${supportTickets.status} in ('open', 'in_progress'))`,
      })
      .from(supportTickets)
      .where(eq(supportTickets.userId, ctx.user.id));

    const [invoiceStats] = await db
      .select({
        pending: sql<number>`count(*) filter (where ${invoices.status} = 'pending')`,
        overdue: sql<number>`count(*) filter (where ${invoices.status} = 'overdue')`,
      })
      .from(invoices)
      .where(eq(invoices.userId, ctx.user.id));

    return {
      projects: {
        total: Number(projectStats?.total || 0),
        active: Number(projectStats?.active || 0),
        completed: Number(projectStats?.completed || 0),
      },
      messages: {
        unread: Number(messageStats?.unread || 0),
      },
      tickets: {
        open: Number(ticketStats?.open || 0),
      },
      invoices: {
        pending: Number(invoiceStats?.pending || 0),
        overdue: Number(invoiceStats?.overdue || 0),
      },
    };
  }),

  // Get all projects for the current user
  getProjects: protectedProcedure
    .input(
      z.object({
        status: z.enum(["planning", "in_progress", "on_hold", "completed", "archived"]).optional(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const conditions = [eq(clientProjectsExtended.userId, ctx.user.id)];

      if (input.status) {
        conditions.push(eq(clientProjectsExtended.status, input.status));
      }

      const projects = await db
        .select()
        .from(clientProjectsExtended)
        .where(and(...conditions))
        .orderBy(desc(clientProjectsExtended.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const [totalCount] = await db
        .select({ count: count() })
        .from(clientProjectsExtended)
        .where(and(...conditions));

      return {
        projects,
        total: Number(totalCount?.count || 0),
        hasMore: input.offset + input.limit < Number(totalCount?.count || 0),
      };
    }),

  // Get single project by ID
  getProject: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [project] = await db
        .select()
        .from(clientProjectsExtended)
        .where(
          and(
            eq(clientProjectsExtended.id, input.id),
            eq(clientProjectsExtended.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!project) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      // Get project files
      const files = await db
        .select()
        .from(projectFiles)
        .where(eq(projectFiles.projectId, input.id))
        .orderBy(desc(projectFiles.createdAt));

      return {
        ...project,
        files,
      };
    }),

  // Get project types
  getProjectTypes: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    const types = await db
      .select()
      .from(projectTypes)
      .where(eq(projectTypes.active, true))
      .orderBy(asc(projectTypes.order), asc(projectTypes.name));

    return types;
  }),

  // Create new project request
  createProject: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        description: z.string().min(10, "Description must be at least 10 characters"),
        projectType: z.string().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        budget: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        technologies: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [project] = await db
        .insert(clientProjectsExtended)
        .values({
          userId: ctx.user.id,
          title: input.title,
          description: input.description,
          projectType: input.projectType || null,
          priority: input.priority,
          status: "planning",
          progress: 0,
          budget: input.budget,
          startDate: input.startDate,
          endDate: input.endDate,
          technologies: input.technologies,
          milestones: [],
          deliverables: [],
          actualHours: 0,
        })
        .returning();

      await db.insert(activityLog).values({
        userId: ctx.user.id,
        action: "project_created",
        entity: "project",
        entityId: project.id,
        description: `${ctx.user.name} created project: ${input.title}`,
        metadata: { projectId: project.id },
      });

      return project;
    }),

  /**
   * ========================================
   * INVOICES & BILLING
   * ========================================
   */

  // Get all invoices
  getInvoices: protectedProcedure
    .input(
      z.object({
        status: z.enum(["draft", "pending", "paid", "overdue", "cancelled"]).optional(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const conditions = [eq(invoices.userId, ctx.user.id)];

      if (input.status) {
        conditions.push(eq(invoices.status, input.status));
      }

      const invoiceList = await db
        .select()
        .from(invoices)
        .where(and(...conditions))
        .orderBy(desc(invoices.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const [totalCount] = await db
        .select({ count: count() })
        .from(invoices)
        .where(and(...conditions));

      return {
        invoices: invoiceList,
        total: Number(totalCount?.count || 0),
        hasMore: input.offset + input.limit < Number(totalCount?.count || 0),
      };
    }),

  // Get single invoice
  getInvoice: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [invoice] = await db
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.id, input.id),
            eq(invoices.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!invoice) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" });
      }

      return invoice;
    }),

  /**
   * ========================================
   * SUPPORT TICKETS
   * ========================================
   */

  // Get all support tickets
  getTickets: protectedProcedure
    .input(
      z.object({
        status: z.enum(["open", "in_progress", "waiting_response", "resolved", "closed"]).optional(),
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const conditions = [eq(supportTickets.userId, ctx.user.id)];

      if (input.status) {
        conditions.push(eq(supportTickets.status, input.status));
      }

      const tickets = await db
        .select()
        .from(supportTickets)
        .where(and(...conditions))
        .orderBy(desc(supportTickets.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const [totalCount] = await db
        .select({ count: count() })
        .from(supportTickets)
        .where(and(...conditions));

      return {
        tickets,
        total: Number(totalCount?.count || 0),
        hasMore: input.offset + input.limit < Number(totalCount?.count || 0),
      };
    }),

  // Get single ticket with messages
  getTicket: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [ticket] = await db
        .select()
        .from(supportTickets)
        .where(
          and(
            eq(supportTickets.id, input.id),
            eq(supportTickets.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!ticket) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
      }

      // Get ticket messages (exclude internal notes)
      const ticketMsgs = await db
        .select()
        .from(ticketMessages)
        .where(
          and(
            eq(ticketMessages.ticketId, input.id),
            eq(ticketMessages.isInternal, false)
          )
        )
        .orderBy(asc(ticketMessages.createdAt));

      return {
        ...ticket,
        messages: ticketMsgs,
      };
    }),

  // Create support ticket
  createTicket: protectedProcedure
    .input(
      z.object({
        subject: z.string().min(3, "Subject must be at least 3 characters"),
        description: z.string().min(10, "Description must be at least 10 characters"),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        category: z.string().default("general"),
        projectId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Generate ticket number
      const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

      const [ticket] = await db
        .insert(supportTickets)
        .values({
          userId: ctx.user.id,
          projectId: input.projectId,
          ticketNumber,
          subject: input.subject,
          description: input.description,
          status: "open",
          priority: input.priority,
          category: input.category,
          attachments: [],
        })
        .returning();

      await db.insert(activityLog).values({
        userId: ctx.user.id,
        action: "ticket_created",
        entity: "ticket",
        entityId: ticket.id,
        description: `${ctx.user.name} created support ticket: ${input.subject}`,
        metadata: { ticketId: ticket.id, ticketNumber },
      });

      return ticket;
    }),

  // Add message to ticket
  addTicketMessage: protectedProcedure
    .input(
      z.object({
        ticketId: z.number(),
        content: z.string().min(1, "Message cannot be empty"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Verify ticket belongs to user
      const [ticket] = await db
        .select()
        .from(supportTickets)
        .where(
          and(
            eq(supportTickets.id, input.ticketId),
            eq(supportTickets.userId, ctx.user.id)
          )
        )
        .limit(1);

      if (!ticket) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Ticket not found" });
      }

      const [message] = await db
        .insert(ticketMessages)
        .values({
          ticketId: input.ticketId,
          authorId: ctx.user.id,
          content: input.content,
          isInternal: false,
          attachments: [],
        })
        .returning();

      // Update ticket status to waiting_response if it was resolved
      if (ticket.status === "resolved") {
        await db
          .update(supportTickets)
          .set({ status: "open", updatedAt: new Date() })
          .where(eq(supportTickets.id, input.ticketId));
      }

      return message;
    }),

  /**
   * ========================================
   * MESSAGING
   * ========================================
   */

  // Get messages
  getMessages: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const messageList = await db
        .select()
        .from(messages)
        .where(
          or(
            eq(messages.senderId, ctx.user.id),
            eq(messages.recipientId, ctx.user.id)
          )
        )
        .orderBy(desc(messages.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return messageList;
    }),

  // Send message
  sendMessage: protectedProcedure
    .input(
      z.object({
        recipientId: z.number(),
        content: z.string().min(1, "Message cannot be empty"),
        projectId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [message] = await db
        .insert(messages)
        .values({
          senderId: ctx.user.id,
          recipientId: input.recipientId,
          projectId: input.projectId,
          content: input.content,
          type: "text",
          read: false,
          attachments: [],
        })
        .returning();

      // Create notification for recipient
      await db.insert(notifications).values({
        userId: input.recipientId,
        type: "message",
        title: "New Message",
        message: `You have a new message from ${ctx.user.name}`,
        link: `/client-portal/messages/${message.id}`,
        read: false,
      });

      return message;
    }),

  // Mark message as read
  markMessageRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(messages)
        .set({ read: true, readAt: new Date() })
        .where(
          and(
            eq(messages.id, input.id),
            eq(messages.recipientId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  /**
   * ========================================
   * NOTIFICATIONS
   * ========================================
   */

  // Get notifications
  getNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const conditions = [eq(notifications.userId, ctx.user.id)];

      if (input.unreadOnly) {
        conditions.push(eq(notifications.read, false));
      }

      const notificationList = await db
        .select()
        .from(notifications)
        .where(and(...conditions))
        .orderBy(desc(notifications.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return notificationList;
    }),

  // Mark notification as read
  markNotificationRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(notifications)
        .set({ read: true, readAt: new Date() })
        .where(
          and(
            eq(notifications.id, input.id),
            eq(notifications.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  // Mark all notifications as read
  markAllNotificationsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

    await db
      .update(notifications)
      .set({ read: true, readAt: new Date() })
      .where(
        and(
          eq(notifications.userId, ctx.user.id),
          eq(notifications.read, false)
        )
      );

    return { success: true };
  }),

  /**
   * ========================================
   * ACTIVITY LOG
   * ========================================
   */

  // Get activity log
  getActivityLog: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const activities = await db
        .select()
        .from(activityLog)
        .where(eq(activityLog.userId, ctx.user.id))
        .orderBy(desc(activityLog.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return activities;
    }),
});

