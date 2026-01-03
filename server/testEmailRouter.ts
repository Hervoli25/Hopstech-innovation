import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { Resend } from 'resend';

export const testEmailRouter = router({
  // Test email configuration
  testConfig: publicProcedure.query(async () => {
    const config = {
      resendApiKey: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET',
      emailFrom: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      nodeEnv: process.env.NODE_ENV || 'NOT SET',
    };

    return {
      success: true,
      config,
      message: 'Resend email configuration check',
    };
  }),

  // Test Resend API connection
  testConnection: publicProcedure.mutation(async () => {
    try {
      const apiKey = process.env.RESEND_API_KEY;

      if (!apiKey) {
        return {
          success: false,
          error: 'RESEND_API_KEY not configured',
          message: 'Resend API key missing',
        };
      }

      const resend = new Resend(apiKey);

      // Test by sending a test email to the configured from address
      const { data, error } = await resend.emails.send({
        from: `Test <${process.env.EMAIL_FROM || 'onboarding@resend.dev'}>`,
        to: [process.env.EMAIL_FROM || 'onboarding@resend.dev'],
        subject: 'Resend API Test',
        html: '<p>This is a test email from HOPSTECH INNOVATION</p>',
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          message: 'Resend API test failed',
        };
      }

      return {
        success: true,
        message: 'Resend API connection successful',
        emailId: data?.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        message: 'Resend API test failed',
      };
    }
  }),
});

