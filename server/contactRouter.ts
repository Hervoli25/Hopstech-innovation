import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { contacts } from "../drizzle/schema";
import { sendContactEmail } from "./emailService";

export const contactRouter = router({
  // Submit contact form
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        company: z.string().optional(),
        subject: z.string().min(3, "Subject must be at least 3 characters"),
        message: z.string().min(10, "Message must be at least 10 characters"),
        phone: z.string().optional(),
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

      // Insert contact into database
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
        userAgent,
      });

      // Send email notification to admin
      console.log('[Contact] Attempting to send email notification for:', {
        name: input.name,
        email: input.email,
        subject: input.subject,
      });

      try {
        await sendContactEmail({
          name: input.name,
          email: input.email,
          company: input.company,
          subject: input.subject,
          message: input.message,
          phone: input.phone,
        });
        console.log('[Contact] Email notification sent successfully');
      } catch (error) {
        console.error('[Contact] Failed to send email notification:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // Don't fail the request if email fails, contact is already saved in DB
      }

      return {
        success: true,
        message: "Thank you for your message! We'll get back to you soon.",
      };
    }),
});
