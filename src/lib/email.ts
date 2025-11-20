// Email service stub
// TODO: Implement with actual email provider (Postmark, SendGrid, etc.)

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail(options: EmailOptions): Promise<{ ok: boolean }> {
  // Stub implementation - logs email for development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Email] Would send:', {
      to: options.to,
      subject: options.subject,
    });
  }
  
  return { ok: true };
}
