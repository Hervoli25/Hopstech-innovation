import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { services } from "../drizzle/schema";
import { eq, asc } from "drizzle-orm";

export const serviceRouter = router({
  // Get all active services
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    const result = await db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .orderBy(asc(services.order))
      .execute();

    return result;
  }),

  // Get service by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(services)
        .where(eq(services.slug, input.slug))
        .limit(1)
        .execute();

      return result[0] || null;
    }),
});
