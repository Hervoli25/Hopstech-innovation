import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { testimonials } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

export const testimonialRouter = router({
  // Get all approved testimonials
  getAll: publicProcedure
    .input(
      z.object({
        featured: z.boolean().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(testimonials.approved, true)];
      
      if (input?.featured) {
        conditions.push(eq(testimonials.featured, true));
      }

      const result = await db
        .select()
        .from(testimonials)
        .where(and(...conditions))
        .orderBy(desc(testimonials.createdAt))
        .execute();

      return result;
    }),

  // Get featured testimonials
  getFeatured: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const result = await db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.approved, true), eq(testimonials.featured, true)))
      .orderBy(desc(testimonials.createdAt))
      .limit(6)
      .execute();

    return result;
  }),
});
