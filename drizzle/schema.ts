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

/**
 * Enums - Define before tables that use them
 */
export const userRoleEnum = pgEnum("user_role", ["user", "admin", "client"]);
export const contactStatusEnum = pgEnum("contact_status", ["new", "read", "replied", "archived"]);
export const magicLinkStatusEnum = pgEnum("magic_link_status", ["pending", "used", "expired"]);
export const projectInquiryStatusEnum = pgEnum("project_inquiry_status", ["new", "reviewing", "accepted", "rejected"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn", { mode: "date", withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
  openIdIdx: uniqueIndex("users_openid_idx").on(table.openId),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Projects table - stores portfolio projects
 */
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  longDescription: text("longDescription").notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  images: jsonb("images").$type<string[]>().default([]).notNull(),
  technologies: jsonb("technologies").$type<string[]>().default([]).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  client: varchar("client", { length: 255 }),
  url: varchar("url", { length: 500 }),
  githubUrl: varchar("githubUrl", { length: 500 }),
  featured: boolean("featured").default(false).notNull(),
  order: integer("order").default(0).notNull(),
  metrics: jsonb("metrics").$type<Record<string, string>>(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp("publishedAt", { mode: "date", withTimezone: true }),
}, (table) => ({
  slugIdx: uniqueIndex("projects_slug_idx").on(table.slug),
  categoryIdx: index("projects_category_idx").on(table.category),
  featuredIdx: index("projects_featured_idx").on(table.featured),
  publishedAtIdx: index("projects_published_at_idx").on(table.publishedAt),
}));

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

/**
 * Services table - stores service offerings
 */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 100 }),
  features: jsonb("features").$type<string[]>().default([]).notNull(),
  pricing: jsonb("pricing").$type<Record<string, any>>(),
  order: integer("order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  slugIdx: uniqueIndex("services_slug_idx").on(table.slug),
  activeIdx: index("services_active_idx").on(table.active),
  orderIdx: index("services_order_idx").on(table.order),
}));

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Contact table - stores contact form submissions
 */
export const contacts = pgTable("contacts", {
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
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("contacts_email_idx").on(table.email),
  statusIdx: index("contacts_status_idx").on(table.status),
  createdAtIdx: index("contacts_created_at_idx").on(table.createdAt),
}));

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

/**
 * Blog posts table
 */
export const blogPosts = pgTable("blogPosts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  author: varchar("author", { length: 255 }).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  published: boolean("published").default(false).notNull(),
  views: integer("views").default(0).notNull(),
  readTime: integer("readTime").notNull(), // in minutes
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp("publishedAt", { mode: "date", withTimezone: true }),
}, (table) => ({
  slugIdx: uniqueIndex("blogPosts_slug_idx").on(table.slug),
  publishedIdx: index("blogPosts_published_idx").on(table.published),
  publishedAtIdx: index("blogPosts_published_at_idx").on(table.publishedAt),
  authorIdx: index("blogPosts_author_idx").on(table.author),
}));

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Newsletter subscribers table
 */
export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  active: boolean("active").default(true).notNull(),
  source: varchar("source", { length: 100 }).default("website").notNull(),
  subscribedAt: timestamp("subscribedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt", { mode: "date", withTimezone: true }),
}, (table) => ({
  emailIdx: uniqueIndex("newsletters_email_idx").on(table.email),
  activeIdx: index("newsletters_active_idx").on(table.active),
}));

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = typeof newsletters.$inferInsert;

/**
 * Testimonials table
 */
export const testimonials = pgTable("testimonials", {
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
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  featuredIdx: index("testimonials_featured_idx").on(table.featured),
  approvedIdx: index("testimonials_approved_idx").on(table.approved),
  ratingIdx: index("testimonials_rating_idx").on(table.rating),
}));

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Analytics table - tracks page views and user actions
 */
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  page: varchar("page", { length: 500 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("userAgent"),
  timestamp: timestamp("timestamp", { mode: "date", withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  pageIdx: index("analytics_page_idx").on(table.page),
  actionIdx: index("analytics_action_idx").on(table.action),
  timestampIdx: index("analytics_timestamp_idx").on(table.timestamp),
}));

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

/**
 * Magic Links table - for passwordless authentication
 */
export const magicLinks = pgTable("magicLinks", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  status: magicLinkStatusEnum("status").default("pending").notNull(),
  expiresAt: timestamp("expiresAt", { mode: "date", withTimezone: true }).notNull(),
  usedAt: timestamp("usedAt", { mode: "date", withTimezone: true }),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  tokenIdx: uniqueIndex("magic_links_token_idx").on(table.token),
  emailIdx: index("magic_links_email_idx").on(table.email),
  statusIdx: index("magic_links_status_idx").on(table.status),
  expiresAtIdx: index("magic_links_expires_at_idx").on(table.expiresAt),
}));

export type MagicLink = typeof magicLinks.$inferSelect;
export type InsertMagicLink = typeof magicLinks.$inferInsert;

/**
 * Client Projects table - links clients (users) to their projects
 */
export const clientProjects = pgTable("clientProjects", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 100 }).default("client").notNull(), // client, collaborator, viewer
  accessGrantedAt: timestamp("accessGrantedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  accessGrantedBy: integer("accessGrantedBy").references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("client_projects_user_id_idx").on(table.userId),
  projectIdIdx: index("client_projects_project_id_idx").on(table.projectId),
  uniqueUserProject: uniqueIndex("client_projects_user_project_idx").on(table.userId, table.projectId),
}));

export type ClientProject = typeof clientProjects.$inferSelect;
export type InsertClientProject = typeof clientProjects.$inferInsert;

/**
 * Project Inquiries table - stores new project requests from landing page
 */
export const projectInquiries = pgTable("projectInquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  projectType: varchar("projectType", { length: 100 }).notNull(), // web-app, mobile-app, devops, consulting, etc.
  budget: varchar("budget", { length: 100 }),
  timeline: varchar("timeline", { length: 100 }),
  description: text("description").notNull(),
  requirements: jsonb("requirements").$type<string[]>().default([]),
  status: projectInquiryStatusEnum("status").default("new").notNull(),
  assignedTo: integer("assignedTo").references(() => users.id),
  notes: text("notes"),
  ip: varchar("ip", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewedAt", { mode: "date", withTimezone: true }),
}, (table) => ({
  emailIdx: index("project_inquiries_email_idx").on(table.email),
  statusIdx: index("project_inquiries_status_idx").on(table.status),
  createdAtIdx: index("project_inquiries_created_at_idx").on(table.createdAt),
  projectTypeIdx: index("project_inquiries_project_type_idx").on(table.projectType),
}));

export type ProjectInquiry = typeof projectInquiries.$inferSelect;
export type InsertProjectInquiry = typeof projectInquiries.$inferInsert;

/**
 * Project Updates table - admin posts updates that clients can view
 */
export const projectUpdates = pgTable("projectUpdates", {
  id: serial("id").primaryKey(),
  projectId: integer("projectId").notNull().references(() => projects.id, { onDelete: "cascade" }),
  authorId: integer("authorId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).default("general").notNull(), // general, milestone, issue, release
  visibility: varchar("visibility", { length: 50 }).default("clients").notNull(), // clients, public, private
  attachments: jsonb("attachments").$type<string[]>().default([]),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  publishedAt: timestamp("publishedAt", { mode: "date", withTimezone: true }),
}, (table) => ({
  projectIdIdx: index("project_updates_project_id_idx").on(table.projectId),
  authorIdIdx: index("project_updates_author_id_idx").on(table.authorId),
  typeIdx: index("project_updates_type_idx").on(table.type),
  publishedIdx: index("project_updates_published_idx").on(table.published),
  publishedAtIdx: index("project_updates_published_at_idx").on(table.publishedAt),
}));

export type ProjectUpdate = typeof projectUpdates.$inferSelect;
export type InsertProjectUpdate = typeof projectUpdates.$inferInsert;
