// Environment variables with safe defaults
export const env = {
  // Database
  POSTGRES_URL: process.env.POSTGRES_URL || '',
  
  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  
  // Paddle
  PADDLE_VENDOR_ID: process.env.PADDLE_VENDOR_ID || '',
  PADDLE_CLIENT_ID: process.env.PADDLE_CLIENT_ID || '',
  PADDLE_CLIENT_SECRET: process.env.PADDLE_CLIENT_SECRET || '',
  PADDLE_WEBHOOK_SECRET: process.env.PADDLE_WEBHOOK_SECRET || '',
  PADDLE_ENV: process.env.PADDLE_ENV || 'sandbox', // 'sandbox' | 'live'
  
  // Paddle Price IDs - Chatbot
  PRICE_CHATBOT_STANDARD_M: process.env.PRICE_CHATBOT_STANDARD_M || '',
  PRICE_CHATBOT_STANDARD_Y: process.env.PRICE_CHATBOT_STANDARD_Y || '',
  PRICE_CHATBOT_PRO_M: process.env.PRICE_CHATBOT_PRO_M || '',
  PRICE_CHATBOT_PRO_Y: process.env.PRICE_CHATBOT_PRO_Y || '',
  PRICE_CHATBOT_ENTERPRISE_M: process.env.PRICE_CHATBOT_ENTERPRISE_M || '',
  PRICE_CHATBOT_ENTERPRISE_Y: process.env.PRICE_CHATBOT_ENTERPRISE_Y || '',
  
  // Paddle Price IDs - Voice
  PRICE_VOICE_STANDARD_M: process.env.PRICE_VOICE_STANDARD_M || '',
  PRICE_VOICE_STANDARD_Y: process.env.PRICE_VOICE_STANDARD_Y || '',
  PRICE_VOICE_PRO_M: process.env.PRICE_VOICE_PRO_M || '',
  PRICE_VOICE_PRO_Y: process.env.PRICE_VOICE_PRO_Y || '',
  PRICE_VOICE_ENTERPRISE_M: process.env.PRICE_VOICE_ENTERPRISE_M || '',
  PRICE_VOICE_ENTERPRISE_Y: process.env.PRICE_VOICE_ENTERPRISE_Y || '',
  
  // Paddle Price IDs - Bundle (Both)
  PRICE_BUNDLE_STANDARD_M: process.env.PRICE_BUNDLE_STANDARD_M || '',
  PRICE_BUNDLE_STANDARD_Y: process.env.PRICE_BUNDLE_STANDARD_Y || '',
  PRICE_BUNDLE_PRO_M: process.env.PRICE_BUNDLE_PRO_M || '',
  PRICE_BUNDLE_PRO_Y: process.env.PRICE_BUNDLE_PRO_Y || '',
  PRICE_BUNDLE_ENTERPRISE_M: process.env.PRICE_BUNDLE_ENTERPRISE_M || '',
  PRICE_BUNDLE_ENTERPRISE_Y: process.env.PRICE_BUNDLE_ENTERPRISE_Y || '',
  
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
  
  // Paddle Domain Verification (optional)
  PADDLE_DOMAIN_TOKEN: process.env.PADDLE_DOMAIN_TOKEN || '',
  PADDLE_DOMAIN_TXT: process.env.PADDLE_DOMAIN_TXT || '',
  
  // App
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:9002',
  SITE_URL: process.env.SITE_URL || 'https://agent.unik-ks.com',
  ROOT_DOMAIN: process.env.ROOT_DOMAIN || 'unik-ks.com',
  WIDGET_ORIGIN: process.env.WIDGET_ORIGIN || 'https://agent.unik-ks.com',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:9002,https://agent.unik-ks.com',
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@unik-ks.com',
  
  // Feature flags
  PADDLE_ENABLED: process.env.PADDLE_ENABLED !== 'false',
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
