// Environment variables with safe defaults
export const env = {
  // Database
  POSTGRES_URL: process.env.POSTGRES_URL || '',
  
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  STRIPE_PRICE_STD_M: process.env.STRIPE_PRICE_STD_M || '',
  STRIPE_PRICE_STD_Y: process.env.STRIPE_PRICE_STD_Y || '',
  STRIPE_PRICE_PRO_M: process.env.STRIPE_PRICE_PRO_M || '',
  STRIPE_PRICE_PRO_Y: process.env.STRIPE_PRICE_PRO_Y || '',
  STRIPE_PRICE_ENT_M: process.env.STRIPE_PRICE_ENT_M || '',
  STRIPE_PRICE_ENT_Y: process.env.STRIPE_PRICE_ENT_Y || '',
  
  // Email
  POSTMARK_KEY: process.env.POSTMARK_KEY || '',
  SENDGRID_KEY: process.env.SENDGRID_KEY || '',
  
  // n8n
  N8N_SIGNING_SECRET: process.env.N8N_SIGNING_SECRET || '',
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || '',
  
  // Twilio (optional)
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  WHATSAPP_SENDER_ID: process.env.WHATSAPP_SENDER_ID || '',
  
  // App
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:9002',
  WIDGET_ORIGIN: process.env.WIDGET_ORIGIN || 'https://agent.unik.ai',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:9002,https://agent.unik.ai',
  
  // Feature flags
  STRIPE_ENABLED: process.env.STRIPE_ENABLED !== 'false',
  EMAIL_ENABLED: process.env.EMAIL_ENABLED !== 'false',
  VOICE_ENABLED: process.env.VOICE_ENABLED !== 'false',
  WHATSAPP_ENABLED: process.env.WHATSAPP_ENABLED !== 'false',
  N8N_ENABLED: process.env.N8N_ENABLED !== 'false',
} as const;

// Check if a feature is available
export function isFeatureAvailable(feature: keyof typeof env): boolean {
  const value = env[feature];
  return typeof value === 'string' ? value.length > 0 : value === true;
}
