import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";

export const testEmailRouter = router({
  // Test email configuration
  testConfig: publicProcedure.query(async () => {
    const config = {
      emailUser: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
      emailPass: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
      emailHost: process.env.EMAIL_HOST || 'NOT SET',
      emailPort: process.env.EMAIL_PORT || 'NOT SET',
      nodeEnv: process.env.NODE_ENV || 'NOT SET',
    };

    return {
      success: true,
      config,
      message: 'Email configuration check',
    };
  }),

  // Test SMTP connection
  testConnection: publicProcedure.mutation(async () => {
    try {
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.default.createTransport({
        host: process.env.EMAIL_HOST || 'smtppro.zoho.eu',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Verify connection
      await transporter.verify();

      return {
        success: true,
        message: 'SMTP connection successful',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'SMTP connection failed',
      };
    }
  }),
});

