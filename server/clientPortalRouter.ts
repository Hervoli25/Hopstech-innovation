import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { projectInquiries } from "../drizzle/schema";

export const clientPortalRouter = router({
  // Submit project inquiry
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

      // Get IP and user agent from request
      const ip = ctx.req?.headers?.['x-forwarded-for'] as string || 
                 ctx.req?.headers?.['x-real-ip'] as string ||
                 'unknown';
      const userAgent = ctx.req?.headers?.['user-agent'] || 'unknown';

      // Insert project inquiry into database
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

      // TODO: Send email notification to admin
      // TODO: Send confirmation email to client

      return {
        success: true,
        message: "Thank you for your project inquiry! We'll review it and get back to you within 24 hours.",
      };
    }),
});

