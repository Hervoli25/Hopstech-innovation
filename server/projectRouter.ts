import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { projects } from "../drizzle/schema";
import { eq, desc, like, or } from "drizzle-orm";

export const projectRouter = router({
  // Get all projects
  getAll: publicProcedure
    .input(
      z.object({
        featured: z.boolean().optional(),
        category: z.string().optional(),
        search: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let query = db.select().from(projects);
      
      // Apply filters
      const conditions = [];
      if (input?.featured) {
        conditions.push(eq(projects.featured, true));
      }
      if (input?.category) {
        conditions.push(eq(projects.category, input.category));
      }
      if (input?.search) {
        conditions.push(
          or(
            like(projects.title, `%${input.search}%`),
            like(projects.description, `%${input.search}%`)
          )
        );
      }

      const result = await query
        .orderBy(desc(projects.order), desc(projects.createdAt))
        .execute();

      return result;
    }),

  // Get project by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.slug, input.slug))
        .limit(1)
        .execute();

      return result[0] || null;
    }),

  // Get featured projects
  getFeatured: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(desc(projects.order))
      .limit(6)
      .execute();

    return result;
  }),
});
