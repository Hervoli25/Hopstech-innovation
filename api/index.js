// server/_core/vercel.ts
import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/db.ts
import { eq, and, gt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// drizzle/schema.ts
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
  jsonb,
  serial,
  index,
  uniqueIndex
} from "drizzle-orm/pg-core";
var userRoleEnum = pgEnum("user_role", ["user", "admin", "client"]);
var contactStatusEnum = pgEnum("contact_status", ["new", "read", "replied", "archived"]);
var magicLinkStatusEnum = pgEnum("magic_link_status", ["pending", "used", "expired"]);
var projectInquiryStatusEnum = pgEnum("project_inquiry_status", ["new", "reviewing", "accepted", "rejected"]);
var projectStatusEnum = pgEnum("project_status", ["planning", "in_progress", "on_hold", "completed", "archived"]);
var invoiceStatusEnum = pgEnum("invoice_status", ["draft", "pending", "paid", "overdue", "cancelled"]);
var ticketStatusEnum = pgEnum("ticket_status", ["open", "in_progress", "waiting_response", "resolved", "closed"]);
var ticketPriorityEnum = pgEnum("ticket_priority", ["low", "medium", "high", "urgent"]);
var projectPriorityEnum = pgEnum("project_priority", ["low", "medium", "high", "urgent"]);
var messageTypeEnum = pgEnum("message_type", ["text", "file", "system"]);
var notificationTypeEnum = pgEnum("notification_type", ["project_update", "message", "invoice", "ticket", "system"]);
var notificationPriorityEnum = pgEnum("notification_priority", ["low", "medium", "high", "urgent"]);
var notificationActionTypeEnum = pgEnum("notification_action_type", ["none", "view", "approve", "respond", "download", "custom"]);
var users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  openIdIdx: uniqueIndex("users_openid_idx").on(table.openId)
}));
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("longDescription").notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  images: jsonb("images").$type().default([]).notNull(),
  technologies: jsonb("technologies").$type().default([]).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  client: varchar("client", { length: 255 }),
  url: varchar("url", { length: 500 }),
  githubUrl: varchar("githubUrl", { length: 500 }),
  featured: boolean("featured").default(false).notNull(),
  order: integer("order").default(0).notNull(),
  metrics: jsonb("metrics").$type(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp("publishedAt", { mode: "date", withTimezone: true })
}, (table) => ({
  slugIdx: uniqueIndex("projects_slug_idx").on(table.slug),
  categoryIdx: index("projects_category_idx").on(table.category),
  featuredIdx: index("projects_featured_idx").on(table.featured),
  publishedAtIdx: index("projects_published_at_idx").on(table.publishedAt)
}));
var services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 100 }),
  features: jsonb("features").$type().default([]).notNull(),
  pricing: jsonb("pricing").$type(),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  slugIdx: uniqueIndex("services_slug_idx").on(table.slug),
  activeIdx: index("services_active_idx").on(table.active),
  orderIdx: index("services_order_idx").on(table.order)
}));
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  phone: varchar("phone", { length: 50 }),
  source: varchar("source", { length: 100 }).default("website").notNull(),
  status: contactStatusEnum("status").default("new").notNull(),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  emailIdx: index("contacts_email_idx").on(table.email),
  statusIdx: index("contacts_status_idx").on(table.status),
  createdAtIdx: index("contacts_created_at_idx").on(table.createdAt)
}));
var blogPosts = pgTable("blogPosts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  author: varchar("author", { length: 255 }).notNull(),
  tags: jsonb("tags").$type().default([]).notNull(),
  published: boolean("published").default(false).notNull(),
  views: integer("views").default(0).notNull(),
  readTime: integer("readTime").notNull(),
  // in minutes
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp("publishedAt", { mode: "date", withTimezone: true })
}, (table) => ({
  slugIdx: uniqueIndex("blogPosts_slug_idx").on(table.slug),
  publishedIdx: index("blogPosts_published_idx").on(table.published),
  publishedAtIdx: index("blogPosts_published_at_idx").on(table.publishedAt),
  authorIdx: index("blogPosts_author_idx").on(table.author)
}));
var newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  active: boolean("active").default(true).notNull(),
  source: varchar("source", { length: 100 }).default("website").notNull(),
  subscribedAt: timestamp("subscribedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt", { mode: "date", withTimezone: true })
}, (table) => ({
  emailIdx: uniqueIndex("newsletters_email_idx").on(table.email),
  activeIdx: index("newsletters_active_idx").on(table.active)
}));
var testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  content: text("content").notNull(),
  avatar: varchar("avatar", { length: 500 }),
  rating: integer("rating").default(5).notNull(),
  featured: boolean("featured").default(false).notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  featuredIdx: index("testimonials_featured_idx").on(table.featured),
  approvedIdx: index("testimonials_approved_idx").on(table.approved),
  ratingIdx: index("testimonials_rating_idx").on(table.rating)
}));
var analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 500 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  metadata: jsonb("metadata").$type(),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("userAgent"),
  timestamp: timestamp("timestamp", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  pageIdx: index("analytics_page_idx").on(table.page),
  actionIdx: index("analytics_action_idx").on(table.action),
  timestampIdx: index("analytics_timestamp_idx").on(table.timestamp)
}));
var magicLinks = pgTable("magicLinks", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  status: magicLinkStatusEnum("status").default("pending").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date", withTimezone: true }).notNull(),
  usedAt: timestamp("usedAt", { mode: "date", withTimezone: true }),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  tokenIdx: uniqueIndex("magic_links_token_idx").on(table.token),
  emailIdx: index("magic_links_email_idx").on(table.email),
  statusIdx: index("magic_links_status_idx").on(table.status),
  expiresAtIdx: index("magic_links_expires_at_idx").on(table.expiresAt)
}));
var clientProjects = pgTable("clientProjects", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 100 }).default("client").notNull(),
  // client, collaborator, viewer
  accessGrantedAt: timestamp("accessGrantedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  accessGrantedBy: integer("accessGrantedBy").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  userIdIdx: index("client_projects_user_id_idx").on(table.userId),
  projectIdIdx: index("client_projects_project_id_idx").on(table.projectId),
  uniqueUserProject: uniqueIndex("client_projects_user_project_idx").on(table.userId, table.projectId)
}));
var projectInquiries = pgTable("projectInquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  projectType: varchar("projectType", { length: 100 }).notNull(),
  // web-app, mobile-app, devops, consulting, etc.
  budget: varchar("budget", { length: 100 }),
  timeline: varchar("timeline", { length: 100 }),
  description: text("description").notNull(),
  requirements: jsonb("requirements").$type().default([]),
  status: projectInquiryStatusEnum("status").default("new").notNull(),
  assignedTo: integer("assignedTo").references(() => users.id),
  notes: text("notes"),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt", { mode: "date", withTimezone: true })
}, (table) => ({
  emailIdx: index("project_inquiries_email_idx").on(table.email),
  statusIdx: index("project_inquiries_status_idx").on(table.status),
  createdAtIdx: index("project_inquiries_created_at_idx").on(table.createdAt),
  projectTypeIdx: index("project_inquiries_project_type_idx").on(table.projectType)
}));
var projectUpdates = pgTable("projectUpdates", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  authorId: integer("authorId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).default("general").notNull(),
  // general, milestone, issue, release
  visibility: varchar("visibility", { length: 50 }).default("clients").notNull(),
  // clients, public, private
  attachments: jsonb("attachments").$type().default([]),
  metadata: jsonb("metadata").$type(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp("publishedAt", { mode: "date", withTimezone: true })
}, (table) => ({
  projectIdIdx: index("project_updates_project_id_idx").on(table.projectId),
  authorIdIdx: index("project_updates_author_id_idx").on(table.authorId),
  typeIdx: index("project_updates_type_idx").on(table.type),
  publishedIdx: index("project_updates_published_idx").on(table.published),
  publishedAtIdx: index("project_updates_published_at_idx").on(table.publishedAt)
}));
var userProfiles = pgTable("userProfiles", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  avatar: varchar("avatar", { length: 500 }),
  bio: text("bio"),
  company: varchar("company", { length: 255 }),
  position: varchar("position", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 500 }),
  location: varchar("location", { length: 255 }),
  timezone: varchar("timezone", { length: 100 }),
  preferences: jsonb("preferences").$type().default({}),
  notificationSettings: jsonb("notificationSettings").$type().default({
    email: true,
    push: true,
    projectUpdates: true,
    messages: true,
    invoices: true
  }),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  userIdIdx: uniqueIndex("user_profiles_user_id_idx").on(table.userId)
}));
var clientProjectsExtended = pgTable("clientProjectsExtended", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  projectType: varchar("projectType", { length: 255 }),
  // e.g., "Web Application", "Mobile App", "Custom Project"
  priority: projectPriorityEnum("priority").default("medium").notNull(),
  status: projectStatusEnum("status").default("planning").notNull(),
  progress: integer("progress").default(0).notNull(),
  // 0-100
  budget: integer("budget"),
  // in cents
  startDate: timestamp("startDate", { mode: "date", withTimezone: true }),
  endDate: timestamp("endDate", { mode: "date", withTimezone: true }),
  estimatedHours: integer("estimatedHours"),
  actualHours: integer("actualHours").default(0),
  technologies: jsonb("technologies").$type().default([]),
  milestones: jsonb("milestones").$type().default([]),
  deliverables: jsonb("deliverables").$type().default([]),
  metadata: jsonb("metadata").$type(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completedAt", { mode: "date", withTimezone: true })
}, (table) => ({
  userIdIdx: index("client_projects_ext_user_id_idx").on(table.userId),
  statusIdx: index("client_projects_ext_status_idx").on(table.status),
  createdAtIdx: index("client_projects_ext_created_at_idx").on(table.createdAt)
}));
var projectTypes = pgTable("projectTypes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  active: boolean("active").default(true).notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  nameIdx: uniqueIndex("project_types_name_idx").on(table.name),
  activeIdx: index("project_types_active_idx").on(table.active),
  orderIdx: index("project_types_order_idx").on(table.order)
}));
var projectFiles = pgTable("projectFiles", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => clientProjectsExtended.id, { onDelete: "cascade" }),
  uploadedBy: integer("uploadedBy").notNull().references(() => users.id),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileUrl: varchar("fileUrl", { length: 1e3 }).notNull(),
  fileSize: integer("fileSize").notNull(),
  // in bytes
  fileType: varchar("fileType", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).default("general"),
  // general, design, document, code, etc.
  description: text("description"),
  metadata: jsonb("metadata").$type(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  projectIdIdx: index("project_files_project_id_idx").on(table.projectId),
  uploadedByIdx: index("project_files_uploaded_by_idx").on(table.uploadedBy),
  categoryIdx: index("project_files_category_idx").on(table.category)
}));
var invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("projectId").references(() => clientProjectsExtended.id),
  invoiceNumber: varchar("invoiceNumber", { length: 100 }).notNull().unique(),
  status: invoiceStatusEnum("status").default("draft").notNull(),
  amount: integer("amount").notNull(),
  // in cents
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  tax: integer("tax").default(0),
  // in cents
  discount: integer("discount").default(0),
  // in cents
  total: integer("total").notNull(),
  // in cents
  items: jsonb("items").$type().notNull(),
  notes: text("notes"),
  dueDate: timestamp("dueDate", { mode: "date", withTimezone: true }),
  paidAt: timestamp("paidAt", { mode: "date", withTimezone: true }),
  paymentMethod: varchar("paymentMethod", { length: 100 }),
  paymentReference: varchar("paymentReference", { length: 255 }),
  metadata: jsonb("metadata").$type(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  userIdIdx: index("invoices_user_id_idx").on(table.userId),
  projectIdIdx: index("invoices_project_id_idx").on(table.projectId),
  statusIdx: index("invoices_status_idx").on(table.status),
  invoiceNumberIdx: uniqueIndex("invoices_invoice_number_idx").on(table.invoiceNumber),
  dueDateIdx: index("invoices_due_date_idx").on(table.dueDate)
}));
var supportTickets = pgTable("supportTickets", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("projectId").references(() => clientProjectsExtended.id),
  ticketNumber: varchar("ticketNumber", { length: 100 }).notNull().unique(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description").notNull(),
  status: ticketStatusEnum("status").default("open").notNull(),
  priority: ticketPriorityEnum("priority").default("medium").notNull(),
  category: varchar("category", { length: 100 }).default("general"),
  // general, technical, billing, feature_request
  assignedTo: integer("assignedTo").references(() => users.id),
  attachments: jsonb("attachments").$type().default([]),
  metadata: jsonb("metadata").$type(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp("resolvedAt", { mode: "date", withTimezone: true }),
  closedAt: timestamp("closedAt", { mode: "date", withTimezone: true })
}, (table) => ({
  userIdIdx: index("support_tickets_user_id_idx").on(table.userId),
  projectIdIdx: index("support_tickets_project_id_idx").on(table.projectId),
  statusIdx: index("support_tickets_status_idx").on(table.status),
  priorityIdx: index("support_tickets_priority_idx").on(table.priority),
  ticketNumberIdx: uniqueIndex("support_tickets_ticket_number_idx").on(table.ticketNumber)
}));
var ticketMessages = pgTable("ticketMessages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticketId").notNull().references(() => supportTickets.id, { onDelete: "cascade" }),
  authorId: integer("authorId").notNull().references(() => users.id),
  content: text("content").notNull(),
  attachments: jsonb("attachments").$type().default([]),
  isInternal: boolean("isInternal").default(false),
  // internal notes not visible to client
  metadata: jsonb("metadata").$type(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  ticketIdIdx: index("ticket_messages_ticket_id_idx").on(table.ticketId),
  authorIdIdx: index("ticket_messages_author_id_idx").on(table.authorId),
  createdAtIdx: index("ticket_messages_created_at_idx").on(table.createdAt)
}));
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: integer("senderId").notNull().references(() => users.id),
  recipientId: integer("recipientId").notNull().references(() => users.id),
  projectId: integer("projectId").references(() => clientProjectsExtended.id),
  content: text("content").notNull(),
  type: messageTypeEnum("type").default("text").notNull(),
  attachments: jsonb("attachments").$type().default([]),
  read: boolean("read").default(false).notNull(),
  readAt: timestamp("readAt", { mode: "date", withTimezone: true }),
  metadata: jsonb("metadata").$type(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  senderIdIdx: index("messages_sender_id_idx").on(table.senderId),
  recipientIdIdx: index("messages_recipient_id_idx").on(table.recipientId),
  projectIdIdx: index("messages_project_id_idx").on(table.projectId),
  readIdx: index("messages_read_idx").on(table.read),
  createdAtIdx: index("messages_created_at_idx").on(table.createdAt)
}));
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: notificationTypeEnum("type").notNull(),
  priority: notificationPriorityEnum("priority").default("medium").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  link: varchar("link", { length: 500 }),
  actionType: notificationActionTypeEnum("actionType").default("none").notNull(),
  actionUrl: varchar("actionUrl", { length: 500 }),
  actionLabel: varchar("actionLabel", { length: 100 }),
  groupKey: varchar("groupKey", { length: 255 }),
  // For grouping related notifications
  read: boolean("read").default(false).notNull(),
  readAt: timestamp("readAt", { mode: "date", withTimezone: true }),
  snoozedUntil: timestamp("snoozedUntil", { mode: "date", withTimezone: true }),
  metadata: jsonb("metadata").$type(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  userIdIdx: index("notifications_user_id_idx").on(table.userId),
  typeIdx: index("notifications_type_idx").on(table.type),
  priorityIdx: index("notifications_priority_idx").on(table.priority),
  readIdx: index("notifications_read_idx").on(table.read),
  groupKeyIdx: index("notifications_group_key_idx").on(table.groupKey),
  createdAtIdx: index("notifications_created_at_idx").on(table.createdAt)
}));
var activityLog = pgTable("activityLog", {
  id: serial("id").primaryKey(),
  userId: integer("userId").references(() => users.id),
  action: varchar("action", { length: 255 }).notNull(),
  entity: varchar("entity", { length: 100 }).notNull(),
  // project, invoice, ticket, message, etc.
  entityId: integer("entityId"),
  description: text("description").notNull(),
  metadata: jsonb("metadata").$type(),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull()
}, (table) => ({
  userIdIdx: index("activity_log_user_id_idx").on(table.userId),
  entityIdx: index("activity_log_entity_idx").on(table.entity),
  entityIdIdx: index("activity_log_entity_id_idx").on(table.entityId),
  createdAtIdx: index("activity_log_created_at_idx").on(table.createdAt)
}));

// server/_core/env.ts
var ENV = {
  appId: process.env.APP_ID ?? process.env.VITE_APP_ID ?? "hopstech-portfolio",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const sql2 = neon(process.env.DATABASE_URL);
      _db = drizzle(sql2);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserByEmail(email) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createMagicLink(data) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(magicLinks).values(data).returning();
  return result[0];
}
async function getMagicLinkByToken(token) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get magic link: database not available");
    return void 0;
  }
  const result = await db.select().from(magicLinks).where(
    and(
      eq(magicLinks.token, token),
      eq(magicLinks.status, "pending"),
      gt(magicLinks.expiresAt, /* @__PURE__ */ new Date())
    )
  ).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function markMagicLinkAsUsed(token) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.update(magicLinks).set({ status: "used", usedAt: /* @__PURE__ */ new Date() }).where(eq(magicLinks.token, token));
}

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  const isSecure = isSecureRequest(req);
  return {
    httpOnly: true,
    path: "/",
    // Use 'lax' for localhost (non-HTTPS), 'none' for production (HTTPS)
    sameSite: isSecure ? "none" : "lax",
    secure: isSecure
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString2 = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString2(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString2(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/projectRouter.ts
import { z as z2 } from "zod";
import { eq as eq2, desc, like, or } from "drizzle-orm";
var projectRouter = router({
  // Get all projects
  getAll: publicProcedure.input(
    z2.object({
      featured: z2.boolean().optional(),
      category: z2.string().optional(),
      search: z2.string().optional()
    }).optional()
  ).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    let query = db.select().from(projects);
    const conditions = [];
    if (input?.featured) {
      conditions.push(eq2(projects.featured, true));
    }
    if (input?.category) {
      conditions.push(eq2(projects.category, input.category));
    }
    if (input?.search) {
      conditions.push(
        or(
          like(projects.title, `%${input.search}%`),
          like(projects.description, `%${input.search}%`)
        )
      );
    }
    const result = await query.orderBy(desc(projects.order), desc(projects.createdAt)).execute();
    return result;
  }),
  // Get project by slug
  getBySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const result = await db.select().from(projects).where(eq2(projects.slug, input.slug)).limit(1).execute();
    return result[0] || null;
  }),
  // Get featured projects
  getFeatured: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const result = await db.select().from(projects).where(eq2(projects.featured, true)).orderBy(desc(projects.order)).limit(6).execute();
    return result;
  })
});

// server/serviceRouter.ts
import { z as z3 } from "zod";
import { eq as eq3, asc } from "drizzle-orm";
var serviceRouter = router({
  // Get all active services
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const result = await db.select().from(services).where(eq3(services.active, true)).orderBy(asc(services.order)).execute();
    return result;
  }),
  // Get service by slug
  getBySlug: publicProcedure.input(z3.object({ slug: z3.string() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const result = await db.select().from(services).where(eq3(services.slug, input.slug)).limit(1).execute();
    return result[0] || null;
  })
});

// server/testimonialRouter.ts
import { z as z4 } from "zod";
import { eq as eq4, and as and2, desc as desc2 } from "drizzle-orm";
var testimonialRouter = router({
  // Get all approved testimonials
  getAll: publicProcedure.input(
    z4.object({
      featured: z4.boolean().optional()
    }).optional()
  ).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    const conditions = [eq4(testimonials.approved, true)];
    if (input?.featured) {
      conditions.push(eq4(testimonials.featured, true));
    }
    const result = await db.select().from(testimonials).where(and2(...conditions)).orderBy(desc2(testimonials.createdAt)).execute();
    return result;
  }),
  // Get featured testimonials
  getFeatured: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const result = await db.select().from(testimonials).where(and2(eq4(testimonials.approved, true), eq4(testimonials.featured, true))).orderBy(desc2(testimonials.createdAt)).limit(6).execute();
    return result;
  })
});

// server/contactRouter.ts
import { z as z5 } from "zod";
var contactRouter = router({
  // Submit contact form
  submit: publicProcedure.input(
    z5.object({
      name: z5.string().min(2, "Name must be at least 2 characters"),
      email: z5.string().email("Invalid email address"),
      company: z5.string().optional(),
      subject: z5.string().min(3, "Subject must be at least 3 characters"),
      message: z5.string().min(10, "Message must be at least 10 characters"),
      phone: z5.string().optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }
    const ip = ctx.req?.headers?.["x-forwarded-for"] || ctx.req?.headers?.["x-real-ip"] || "unknown";
    const userAgent = ctx.req?.headers?.["user-agent"] || "unknown";
    await db.insert(contacts).values({
      name: input.name,
      email: input.email,
      company: input.company || null,
      subject: input.subject,
      message: input.message,
      phone: input.phone || null,
      source: "website",
      status: "new",
      ip,
      userAgent
    });
    return {
      success: true,
      message: "Thank you for your message! We'll get back to you soon."
    };
  })
});

// server/clientPortalRouter.ts
import { z as z6 } from "zod";
import { eq as eq5, and as and3, desc as desc3, asc as asc2, sql, or as or2, count } from "drizzle-orm";
import { TRPCError as TRPCError3 } from "@trpc/server";
var clientPortalRouter = router({
  /**
   * ========================================
   * PUBLIC ENDPOINTS
   * ========================================
   */
  // Submit project inquiry (existing endpoint)
  submitInquiry: publicProcedure.input(
    z6.object({
      name: z6.string().min(2, "Name must be at least 2 characters"),
      email: z6.string().email("Invalid email address"),
      company: z6.string().optional(),
      phone: z6.string().optional(),
      projectType: z6.string().min(1, "Project type is required"),
      budget: z6.string().optional(),
      timeline: z6.string().optional(),
      description: z6.string().min(10, "Description must be at least 10 characters")
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }
    const ip = ctx.req?.headers?.["x-forwarded-for"] || ctx.req?.headers?.["x-real-ip"] || "unknown";
    const userAgent = ctx.req?.headers?.["user-agent"] || "unknown";
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
      userAgent
    });
    return {
      success: true,
      message: "Thank you for your project inquiry! We'll review it and get back to you within 24 hours."
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
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const profile = await db.select().from(userProfiles).where(eq5(userProfiles.userId, ctx.user.id)).limit(1);
    if (profile.length === 0) {
      const newProfile = await db.insert(userProfiles).values({
        userId: ctx.user.id,
        preferences: {},
        notificationSettings: {
          email: true,
          push: true,
          projectUpdates: true,
          messages: true,
          invoices: true
        }
      }).returning();
      return newProfile[0];
    }
    return profile[0];
  }),
  // Update user profile
  updateProfile: protectedProcedure.input(
    z6.object({
      avatar: z6.string().optional(),
      bio: z6.string().optional(),
      company: z6.string().optional(),
      position: z6.string().optional(),
      phone: z6.string().optional(),
      website: z6.string().optional(),
      location: z6.string().optional(),
      timezone: z6.string().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const updated = await db.update(userProfiles).set({
      ...input,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq5(userProfiles.userId, ctx.user.id)).returning();
    await db.insert(activityLog).values({
      userId: ctx.user.id,
      action: "profile_updated",
      entity: "profile",
      entityId: ctx.user.id,
      description: `${ctx.user.name} updated their profile`,
      metadata: { changes: input }
    });
    return updated[0];
  }),
  // Update notification settings
  updateNotificationSettings: protectedProcedure.input(
    z6.object({
      email: z6.boolean().optional(),
      push: z6.boolean().optional(),
      projectUpdates: z6.boolean().optional(),
      messages: z6.boolean().optional(),
      invoices: z6.boolean().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const profile = await db.select().from(userProfiles).where(eq5(userProfiles.userId, ctx.user.id)).limit(1);
    const currentSettings = profile[0]?.notificationSettings || {};
    const newSettings = { ...currentSettings, ...input };
    const updated = await db.update(userProfiles).set({
      notificationSettings: newSettings,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq5(userProfiles.userId, ctx.user.id)).returning();
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
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const [projectStats] = await db.select({
      total: count(),
      active: sql`count(*) filter (where ${clientProjectsExtended.status} = 'in_progress')`,
      completed: sql`count(*) filter (where ${clientProjectsExtended.status} = 'completed')`
    }).from(clientProjectsExtended).where(eq5(clientProjectsExtended.userId, ctx.user.id));
    const [messageStats] = await db.select({
      unread: sql`count(*) filter (where ${messages.read} = false)`
    }).from(messages).where(eq5(messages.recipientId, ctx.user.id));
    const [ticketStats] = await db.select({
      open: sql`count(*) filter (where ${supportTickets.status} in ('open', 'in_progress'))`
    }).from(supportTickets).where(eq5(supportTickets.userId, ctx.user.id));
    const [invoiceStats] = await db.select({
      pending: sql`count(*) filter (where ${invoices.status} = 'pending')`,
      overdue: sql`count(*) filter (where ${invoices.status} = 'overdue')`
    }).from(invoices).where(eq5(invoices.userId, ctx.user.id));
    return {
      projects: {
        total: Number(projectStats?.total || 0),
        active: Number(projectStats?.active || 0),
        completed: Number(projectStats?.completed || 0)
      },
      messages: {
        unread: Number(messageStats?.unread || 0)
      },
      tickets: {
        open: Number(ticketStats?.open || 0)
      },
      invoices: {
        pending: Number(invoiceStats?.pending || 0),
        overdue: Number(invoiceStats?.overdue || 0)
      }
    };
  }),
  // Get all projects for the current user
  getProjects: protectedProcedure.input(
    z6.object({
      status: z6.enum(["planning", "in_progress", "on_hold", "completed", "archived"]).optional(),
      limit: z6.number().min(1).max(100).default(10),
      offset: z6.number().min(0).default(0)
    })
  ).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const conditions = [eq5(clientProjectsExtended.userId, ctx.user.id)];
    if (input.status) {
      conditions.push(eq5(clientProjectsExtended.status, input.status));
    }
    const projects2 = await db.select().from(clientProjectsExtended).where(and3(...conditions)).orderBy(desc3(clientProjectsExtended.createdAt)).limit(input.limit).offset(input.offset);
    const [totalCount] = await db.select({ count: count() }).from(clientProjectsExtended).where(and3(...conditions));
    return {
      projects: projects2,
      total: Number(totalCount?.count || 0),
      hasMore: input.offset + input.limit < Number(totalCount?.count || 0)
    };
  }),
  // Get single project by ID
  getProject: protectedProcedure.input(z6.object({ id: z6.number() })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const [project] = await db.select().from(clientProjectsExtended).where(
      and3(
        eq5(clientProjectsExtended.id, input.id),
        eq5(clientProjectsExtended.userId, ctx.user.id)
      )
    ).limit(1);
    if (!project) {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Project not found" });
    }
    const files = await db.select().from(projectFiles).where(eq5(projectFiles.projectId, input.id)).orderBy(desc3(projectFiles.createdAt));
    return {
      ...project,
      files
    };
  }),
  // Get project types
  getProjectTypes: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const types = await db.select().from(projectTypes).where(eq5(projectTypes.active, true)).orderBy(asc2(projectTypes.order), asc2(projectTypes.name));
    return types;
  }),
  // Create new project request
  createProject: protectedProcedure.input(
    z6.object({
      title: z6.string().min(3, "Title must be at least 3 characters"),
      description: z6.string().min(10, "Description must be at least 10 characters"),
      projectType: z6.string().optional(),
      priority: z6.enum(["low", "medium", "high", "urgent"]).default("medium"),
      budget: z6.number().optional(),
      startDate: z6.date().optional(),
      endDate: z6.date().optional(),
      technologies: z6.array(z6.string()).default([])
    })
  ).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const [project] = await db.insert(clientProjectsExtended).values({
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
      actualHours: 0
    }).returning();
    await db.insert(activityLog).values({
      userId: ctx.user.id,
      action: "project_created",
      entity: "project",
      entityId: project.id,
      description: `${ctx.user.name} created project: ${input.title}`,
      metadata: { projectId: project.id }
    });
    return project;
  }),
  // Update project milestones
  updateProjectMilestones: protectedProcedure.input(
    z6.object({
      projectId: z6.number(),
      milestones: z6.array(
        z6.object({
          id: z6.string(),
          title: z6.string(),
          description: z6.string(),
          dueDate: z6.string(),
          completed: z6.boolean(),
          completedAt: z6.string().optional()
        })
      )
    })
  ).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const [project] = await db.select().from(clientProjectsExtended).where(
      and3(
        eq5(clientProjectsExtended.id, input.projectId),
        eq5(clientProjectsExtended.userId, ctx.user.id)
      )
    ).limit(1);
    if (!project) {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Project not found" });
    }
    const [updatedProject] = await db.update(clientProjectsExtended).set({ milestones: input.milestones }).where(eq5(clientProjectsExtended.id, input.projectId)).returning();
    await db.insert(activityLog).values({
      userId: ctx.user.id,
      action: "project_updated",
      entity: "project",
      entityId: input.projectId,
      description: `${ctx.user.name} updated project milestones`,
      metadata: { projectId: input.projectId, milestonesCount: input.milestones.length }
    });
    return updatedProject;
  }),
  // Toggle milestone completion
  toggleMilestoneCompletion: protectedProcedure.input(
    z6.object({
      projectId: z6.number(),
      milestoneId: z6.string()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const [project] = await db.select().from(clientProjectsExtended).where(
      and3(
        eq5(clientProjectsExtended.id, input.projectId),
        eq5(clientProjectsExtended.userId, ctx.user.id)
      )
    ).limit(1);
    if (!project) {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Project not found" });
    }
    const milestones = project.milestones || [];
    const updatedMilestones = milestones.map((m) => {
      if (m.id === input.milestoneId) {
        const isCompleted = !m.completed;
        return {
          ...m,
          completed: isCompleted,
          completedAt: isCompleted ? (/* @__PURE__ */ new Date()).toISOString() : void 0
        };
      }
      return m;
    });
    const [updatedProject] = await db.update(clientProjectsExtended).set({ milestones: updatedMilestones }).where(eq5(clientProjectsExtended.id, input.projectId)).returning();
    const milestone = updatedMilestones.find((m) => m.id === input.milestoneId);
    await db.insert(activityLog).values({
      userId: ctx.user.id,
      action: milestone?.completed ? "milestone_completed" : "milestone_reopened",
      entity: "milestone",
      entityId: input.projectId,
      description: `${ctx.user.name} ${milestone?.completed ? "completed" : "reopened"} milestone: ${milestone?.title}`,
      metadata: { projectId: input.projectId, milestoneId: input.milestoneId }
    });
    return updatedProject;
  }),
  /**
   * ========================================
   * INVOICES & BILLING
   * ========================================
   */
  // Get all invoices
  getInvoices: protectedProcedure.input(
    z6.object({
      status: z6.enum(["draft", "pending", "paid", "overdue", "cancelled"]).optional(),
      limit: z6.number().min(1).max(100).default(10),
      offset: z6.number().min(0).default(0)
    })
  ).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const conditions = [eq5(invoices.userId, ctx.user.id)];
    if (input.status) {
      conditions.push(eq5(invoices.status, input.status));
    }
    const invoiceList = await db.select().from(invoices).where(and3(...conditions)).orderBy(desc3(invoices.createdAt)).limit(input.limit).offset(input.offset);
    const [totalCount] = await db.select({ count: count() }).from(invoices).where(and3(...conditions));
    return {
      invoices: invoiceList,
      total: Number(totalCount?.count || 0),
      hasMore: input.offset + input.limit < Number(totalCount?.count || 0)
    };
  }),
  // Get single invoice
  getInvoice: protectedProcedure.input(z6.object({ id: z6.number() })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const [invoice] = await db.select().from(invoices).where(
      and3(
        eq5(invoices.id, input.id),
        eq5(invoices.userId, ctx.user.id)
      )
    ).limit(1);
    if (!invoice) {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Invoice not found" });
    }
    return invoice;
  }),
  /**
   * ========================================
   * SUPPORT TICKETS
   * ========================================
   */
  // Get all support tickets
  getTickets: protectedProcedure.input(
    z6.object({
      status: z6.enum(["open", "in_progress", "waiting_response", "resolved", "closed"]).optional(),
      limit: z6.number().min(1).max(100).default(10),
      offset: z6.number().min(0).default(0)
    })
  ).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const conditions = [eq5(supportTickets.userId, ctx.user.id)];
    if (input.status) {
      conditions.push(eq5(supportTickets.status, input.status));
    }
    const tickets = await db.select().from(supportTickets).where(and3(...conditions)).orderBy(desc3(supportTickets.createdAt)).limit(input.limit).offset(input.offset);
    const [totalCount] = await db.select({ count: count() }).from(supportTickets).where(and3(...conditions));
    return {
      tickets,
      total: Number(totalCount?.count || 0),
      hasMore: input.offset + input.limit < Number(totalCount?.count || 0)
    };
  }),
  // Get single ticket with messages
  getTicket: protectedProcedure.input(z6.object({ id: z6.number() })).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const [ticket] = await db.select().from(supportTickets).where(
      and3(
        eq5(supportTickets.id, input.id),
        eq5(supportTickets.userId, ctx.user.id)
      )
    ).limit(1);
    if (!ticket) {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Ticket not found" });
    }
    const ticketMsgs = await db.select().from(ticketMessages).where(
      and3(
        eq5(ticketMessages.ticketId, input.id),
        eq5(ticketMessages.isInternal, false)
      )
    ).orderBy(asc2(ticketMessages.createdAt));
    return {
      ...ticket,
      messages: ticketMsgs
    };
  }),
  // Create support ticket
  createTicket: protectedProcedure.input(
    z6.object({
      subject: z6.string().min(3, "Subject must be at least 3 characters"),
      description: z6.string().min(10, "Description must be at least 10 characters"),
      priority: z6.enum(["low", "medium", "high", "urgent"]).default("medium"),
      category: z6.string().default("general"),
      projectId: z6.number().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const ticketNumber = `TKT-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
    const [ticket] = await db.insert(supportTickets).values({
      userId: ctx.user.id,
      projectId: input.projectId,
      ticketNumber,
      subject: input.subject,
      description: input.description,
      status: "open",
      priority: input.priority,
      category: input.category,
      attachments: []
    }).returning();
    await db.insert(activityLog).values({
      userId: ctx.user.id,
      action: "ticket_created",
      entity: "ticket",
      entityId: ticket.id,
      description: `${ctx.user.name} created support ticket: ${input.subject}`,
      metadata: { ticketId: ticket.id, ticketNumber }
    });
    return ticket;
  }),
  // Add message to ticket
  addTicketMessage: protectedProcedure.input(
    z6.object({
      ticketId: z6.number(),
      content: z6.string().min(1, "Message cannot be empty")
    })
  ).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const [ticket] = await db.select().from(supportTickets).where(
      and3(
        eq5(supportTickets.id, input.ticketId),
        eq5(supportTickets.userId, ctx.user.id)
      )
    ).limit(1);
    if (!ticket) {
      throw new TRPCError3({ code: "NOT_FOUND", message: "Ticket not found" });
    }
    const [message] = await db.insert(ticketMessages).values({
      ticketId: input.ticketId,
      authorId: ctx.user.id,
      content: input.content,
      isInternal: false,
      attachments: []
    }).returning();
    if (ticket.status === "resolved") {
      await db.update(supportTickets).set({ status: "open", updatedAt: /* @__PURE__ */ new Date() }).where(eq5(supportTickets.id, input.ticketId));
    }
    return message;
  }),
  /**
   * ========================================
   * MESSAGING
   * ========================================
   */
  // Get messages
  getMessages: protectedProcedure.input(
    z6.object({
      limit: z6.number().min(1).max(100).default(20),
      offset: z6.number().min(0).default(0)
    })
  ).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const messageList = await db.select().from(messages).where(
      or2(
        eq5(messages.senderId, ctx.user.id),
        eq5(messages.recipientId, ctx.user.id)
      )
    ).orderBy(desc3(messages.createdAt)).limit(input.limit).offset(input.offset);
    return messageList;
  }),
  // Send message
  sendMessage: protectedProcedure.input(
    z6.object({
      recipientId: z6.number(),
      content: z6.string().min(1, "Message cannot be empty"),
      projectId: z6.number().optional()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const [message] = await db.insert(messages).values({
      senderId: ctx.user.id,
      recipientId: input.recipientId,
      projectId: input.projectId,
      content: input.content,
      type: "text",
      read: false,
      attachments: []
    }).returning();
    await db.insert(notifications).values({
      userId: input.recipientId,
      type: "message",
      title: "New Message",
      message: `You have a new message from ${ctx.user.name}`,
      link: `/client-portal/messages/${message.id}`,
      read: false
    });
    return message;
  }),
  // Mark message as read
  markMessageRead: protectedProcedure.input(z6.object({ id: z6.number() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    await db.update(messages).set({ read: true, readAt: /* @__PURE__ */ new Date() }).where(
      and3(
        eq5(messages.id, input.id),
        eq5(messages.recipientId, ctx.user.id)
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
  getNotifications: protectedProcedure.input(
    z6.object({
      limit: z6.number().min(1).max(100).default(20),
      offset: z6.number().min(0).default(0),
      unreadOnly: z6.boolean().default(false)
    })
  ).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const conditions = [eq5(notifications.userId, ctx.user.id)];
    if (input.unreadOnly) {
      conditions.push(eq5(notifications.read, false));
    }
    conditions.push(
      or2(
        sql`${notifications.snoozedUntil} IS NULL`,
        sql`${notifications.snoozedUntil} <= NOW()`
      )
    );
    const notificationList = await db.select().from(notifications).where(and3(...conditions)).orderBy(desc3(notifications.createdAt)).limit(input.limit).offset(input.offset);
    const unreadCountResult = await db.select({ count: count() }).from(notifications).where(
      and3(
        eq5(notifications.userId, ctx.user.id),
        eq5(notifications.read, false),
        or2(
          sql`${notifications.snoozedUntil} IS NULL`,
          sql`${notifications.snoozedUntil} <= NOW()`
        )
      )
    );
    return {
      notifications: notificationList,
      unreadCount: Number(unreadCountResult[0]?.count || 0)
    };
  }),
  // Mark notification as read
  markNotificationAsRead: protectedProcedure.input(z6.object({ notificationId: z6.number() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    await db.update(notifications).set({ read: true, readAt: /* @__PURE__ */ new Date() }).where(
      and3(
        eq5(notifications.id, input.notificationId),
        eq5(notifications.userId, ctx.user.id)
      )
    );
    return { success: true };
  }),
  // Mark all notifications as read
  markAllNotificationsAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    await db.update(notifications).set({ read: true, readAt: /* @__PURE__ */ new Date() }).where(
      and3(
        eq5(notifications.userId, ctx.user.id),
        eq5(notifications.read, false)
      )
    );
    return { success: true };
  }),
  // Delete notification
  deleteNotification: protectedProcedure.input(z6.object({ notificationId: z6.number() })).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    await db.delete(notifications).where(
      and3(
        eq5(notifications.id, input.notificationId),
        eq5(notifications.userId, ctx.user.id)
      )
    );
    return { success: true };
  }),
  // Snooze notification
  snoozeNotification: protectedProcedure.input(
    z6.object({
      notificationId: z6.number(),
      snoozeUntil: z6.date()
    })
  ).mutation(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    await db.update(notifications).set({ snoozedUntil: input.snoozeUntil }).where(
      and3(
        eq5(notifications.id, input.notificationId),
        eq5(notifications.userId, ctx.user.id)
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
  getActivityLog: protectedProcedure.input(
    z6.object({
      limit: z6.number().min(1).max(100).default(20),
      offset: z6.number().min(0).default(0)
    })
  ).query(async ({ ctx, input }) => {
    const db = await getDb();
    if (!db) throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    const activities = await db.select().from(activityLog).where(eq5(activityLog.userId, ctx.user.id)).orderBy(desc3(activityLog.createdAt)).limit(input.limit).offset(input.offset);
    return activities;
  })
});

// server/magicLinkRouter.ts
import { z as z7 } from "zod";
import { nanoid } from "nanoid";

// server/emailService.ts
import nodemailer from "nodemailer";
var createTransporter = () => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const emailHost = process.env.EMAIL_HOST || "smtppro.zoho.eu";
  const emailPort = parseInt(process.env.EMAIL_PORT || "587");
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment) {
    console.log("[Email] Configuration check:", {
      emailUser: emailUser ? `${emailUser.substring(0, 3)}***` : "NOT SET",
      emailPass: emailPass ? "***SET***" : "NOT SET",
      emailHost,
      emailPort,
      nodeEnv: process.env.NODE_ENV
    });
  }
  if (!emailUser || !emailPass) {
    console.warn("[Email] Email credentials not configured. Emails will not be sent.");
    return null;
  }
  try {
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: false,
      // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass
      },
      logger: isDevelopment,
      // Enable logging only in development
      debug: isDevelopment
      // Enable debug output only in development
    });
    if (isDevelopment) {
      console.log("[Email] Transporter created successfully");
    }
    return transporter;
  } catch (error) {
    console.error("[Email] Failed to create transporter:", error);
    throw error;
  }
};
async function sendMagicLinkEmail(data) {
  const transporter = createTransporter();
  const isDevelopment = process.env.NODE_ENV === "development";
  if (!transporter) {
    if (isDevelopment) {
      console.log("\n==============================================");
      console.log("\u{1F510} MAGIC LINK (Development Mode)");
      console.log("==============================================");
      console.log(`To: ${data.to}`);
      console.log(`Name: ${data.name}`);
      console.log(`Link: ${data.magicLink}`);
      console.log(`Expires in: ${data.expiresInMinutes} minutes`);
      console.log("==============================================\n");
    }
    return;
  }
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sign in to HOPSTECH INNOVATION</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                    HOPSTECH INNOVATION
                  </h1>
                  <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">
                    Client Portal Access
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #f1f5f9; font-size: 24px; font-weight: 600;">
                    Hi ${data.name}! \u{1F44B}
                  </h2>
                  
                  <p style="margin: 0 0 20px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                    Click the button below to securely sign in to your HOPSTECH INNOVATION client portal. This link will expire in <strong style="color: #f1f5f9;">${data.expiresInMinutes} minutes</strong>.
                  </p>
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${data.magicLink}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
                          Sign In to Client Portal
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 0 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">
                    If the button doesn't work, copy and paste this link into your browser:
                  </p>
                  <p style="margin: 10px 0 0 0; padding: 12px; background-color: #0f172a; border-radius: 6px; word-break: break-all;">
                    <a href="${data.magicLink}" style="color: #60a5fa; text-decoration: none; font-size: 13px;">
                      ${data.magicLink}
                    </a>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px; background-color: #0f172a; border-top: 1px solid #334155;">
                  <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px; text-align: center;">
                    This email was sent to <strong style="color: #94a3b8;">${data.to}</strong>
                  </p>
                  <p style="margin: 0; color: #64748b; font-size: 13px; text-align: center;">
                    If you didn't request this email, you can safely ignore it.
                  </p>
                  <p style="margin: 20px 0 0 0; color: #475569; font-size: 12px; text-align: center;">
                    \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} HOPSTECH INNOVATION. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  const textContent = `
Hi ${data.name}!

Click the link below to sign in to your HOPSTECH INNOVATION client portal:

${data.magicLink}

This link will expire in ${data.expiresInMinutes} minutes.

If you didn't request this email, you can safely ignore it.

---
\xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} HOPSTECH INNOVATION
  `.trim();
  try {
    if (isDevelopment) {
      console.log(`[Email] Attempting to send magic link to ${data.to}`);
    }
    const info = await transporter.sendMail({
      from: `"HOPSTECH INNOVATION" <${process.env.EMAIL_USER}>`,
      to: data.to,
      subject: "\u{1F510} Sign in to HOPSTECH INNOVATION Client Portal",
      text: textContent,
      html: htmlContent
    });
    if (isDevelopment) {
      console.log(`[Email] Magic link sent successfully to ${data.to}`, {
        messageId: info.messageId,
        response: info.response
      });
    } else {
      console.log("[Email] Magic link sent successfully", {
        messageId: info.messageId
      });
    }
  } catch (error) {
    console.error("[Email] Failed to send magic link:", {
      error: error instanceof Error ? error.message : String(error),
      stack: isDevelopment && error instanceof Error ? error.stack : void 0
    });
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Email sending failed: ${errorMessage}`);
  }
}

// server/magicLinkRouter.ts
var MAGIC_LINK_EXPIRY_MINUTES = 15;
var magicLinkRouter = router({
  // Request a magic link
  requestMagicLink: publicProcedure.input(
    z7.object({
      email: z7.string().email("Invalid email address"),
      name: z7.string().min(2, "Name must be at least 2 characters").optional()
    })
  ).mutation(async ({ input, ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }
    const { email, name } = input;
    const ip = ctx.req?.headers?.["x-forwarded-for"] || ctx.req?.headers?.["x-real-ip"] || "unknown";
    const userAgent = ctx.req?.headers?.["user-agent"] || "unknown";
    const token = nanoid(32);
    const expiresAt = new Date(Date.now() + MAGIC_LINK_EXPIRY_MINUTES * 60 * 1e3);
    await createMagicLink({
      email,
      token,
      status: "pending",
      expiresAt,
      ip,
      userAgent
    });
    const origin = ctx.req?.headers?.origin || ctx.req?.headers?.referer?.replace(/\/$/, "") || "http://localhost:3000";
    const magicLinkUrl = `${origin}/auth/verify?token=${token}`;
    try {
      await sendMagicLinkEmail({
        to: email,
        name: name || email.split("@")[0],
        magicLink: magicLinkUrl,
        expiresInMinutes: MAGIC_LINK_EXPIRY_MINUTES
      });
      return {
        success: true,
        message: "Magic link sent! Check your email to sign in."
      };
    } catch (error) {
      console.error("[MagicLink] Failed to send email:", error);
      throw new Error("Failed to send magic link email. Please try again.");
    }
  }),
  // Verify magic link token
  verifyMagicLink: publicProcedure.input(
    z7.object({
      token: z7.string().min(1, "Token is required")
    })
  ).mutation(async ({ input, ctx }) => {
    const { token } = input;
    const magicLink = await getMagicLinkByToken(token);
    if (!magicLink) {
      throw new Error("Invalid or expired magic link");
    }
    if (magicLink.status === "used") {
      throw new Error("This magic link has already been used");
    }
    if (/* @__PURE__ */ new Date() > magicLink.expiresAt) {
      throw new Error("This magic link has expired");
    }
    await markMagicLinkAsUsed(token);
    let user = await getUserByEmail(magicLink.email);
    if (!user) {
      const openId = `magic_${nanoid(16)}`;
      await upsertUser({
        openId,
        email: magicLink.email,
        name: magicLink.email.split("@")[0],
        loginMethod: "magic-link",
        role: "client",
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      user = await getUserByEmail(magicLink.email);
    } else {
      await upsertUser({
        openId: user.openId,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
    }
    if (!user) {
      throw new Error("Failed to create or retrieve user");
    }
    const sessionToken = await sdk.createSessionToken(user.openId, {
      name: user.name || user.email || ""
    });
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.cookie(COOKIE_NAME, sessionToken, cookieOptions);
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      message: "Successfully authenticated!"
    };
  }),
  // Get current session
  getCurrentSession: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) {
      return { authenticated: false, user: null };
    }
    return {
      authenticated: true,
      user: {
        id: ctx.user.id,
        email: ctx.user.email,
        name: ctx.user.name,
        role: ctx.user.role
      }
    };
  }),
  // Logout
  logout: publicProcedure.mutation(async ({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
      message: "Logged out successfully"
    };
  })
});

// server/testEmailRouter.ts
var testEmailRouter = router({
  // Test email configuration
  testConfig: publicProcedure.query(async () => {
    const config = {
      emailUser: process.env.EMAIL_USER ? "SET" : "NOT SET",
      emailPass: process.env.EMAIL_PASS ? "SET" : "NOT SET",
      emailHost: process.env.EMAIL_HOST || "NOT SET",
      emailPort: process.env.EMAIL_PORT || "NOT SET",
      nodeEnv: process.env.NODE_ENV || "NOT SET"
    };
    return {
      success: true,
      config,
      message: "Email configuration check"
    };
  }),
  // Test SMTP connection
  testConnection: publicProcedure.mutation(async () => {
    try {
      const nodemailer2 = await import("nodemailer");
      const transporter = nodemailer2.default.createTransport({
        host: process.env.EMAIL_HOST || "smtppro.zoho.eu",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      await transporter.verify();
      return {
        success: true,
        message: "SMTP connection successful"
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: "SMTP connection failed"
      };
    }
  })
});

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // Portfolio routers
  projects: projectRouter,
  services: serviceRouter,
  testimonials: testimonialRouter,
  contact: contactRouter,
  clientPortal: clientPortalRouter,
  magicLink: magicLinkRouter,
  // Test router (remove in production)
  testEmail: testEmailRouter
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vercel.ts
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var vercel_default = app;
export {
  vercel_default as default
};
