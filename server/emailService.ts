/**
 * Email service for sending magic link emails
 * Uses Resend for reliable email delivery in serverless environments
 
 */

import { Resend } from 'resend';

export interface MagicLinkEmailData {
  to: string;
  name: string;
  magicLink: string;
  expiresInMinutes: number;
}

// Initialize Resend client
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    console.log('[Email] Configuration check:', {
      resendApiKey: apiKey ? '***SET***' : 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
    });
  }

  if (!apiKey) {
    console.warn('[Email] Resend API key not configured. Emails will not be sent.');
    return null;
  }

  try {
    const resend = new Resend(apiKey);

    if (isDevelopment) {
      console.log('[Email] Resend client initialized successfully');
    }

    return resend;
  } catch (error) {
    console.error('[Email] Failed to initialize Resend client:', error);
    throw error;
  }
};

export async function sendMagicLinkEmail(data: MagicLinkEmailData): Promise<void> {
  const resend = getResendClient();
  const isDevelopment = process.env.NODE_ENV === 'development';
  const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

  if (!resend) {
    // In development, just log the magic link
    if (isDevelopment) {
      console.log('\n==============================================');
      console.log('🔐 MAGIC LINK (Development Mode)');
      console.log('==============================================');
      console.log(`To: ${data.to}`);
      console.log(`Name: ${data.name}`);
      console.log(`Link: ${data.magicLink}`);
      console.log(`Expires in: ${data.expiresInMinutes} minutes`);
      console.log('==============================================\n');
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
                    Hi ${data.name}! 👋
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
                    © ${new Date().getFullYear()} HOPSTECH INNOVATION. All rights reserved.
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
© ${new Date().getFullYear()} HOPSTECH INNOVATION
  `.trim();

  try {
    if (isDevelopment) {
      console.log(`[Email] Attempting to send magic link via Resend to ${data.to}`);
    }

    const { data: emailData, error } = await resend.emails.send({
      from: `HOPSTECH INNOVATION <${fromEmail}>`,
      to: [data.to],
      subject: '🔐 Sign in to HOPSTECH INNOVATION Client Portal',
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (isDevelopment) {
      console.log(`[Email] Magic link sent successfully to ${data.to}`, {
        emailId: emailData?.id,
      });
    } else {
      console.log('[Email] Magic link sent successfully', {
        emailId: emailData?.id,
      });
    }
  } catch (error) {
    // Log error without exposing recipient email address
    console.error('[Email] Failed to send magic link:', {
      error: error instanceof Error ? error.message : String(error),
      stack: isDevelopment && error instanceof Error ? error.stack : undefined,
    });

    // Throw a more descriptive error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Email sending failed: ${errorMessage}`);
  }
}

