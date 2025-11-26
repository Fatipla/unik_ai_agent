export const env = {
  POSTGRES_URL: process.env.POSTGRES_URL || '',
  
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002',
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE || '',
  
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  
  PADDLE_VENDOR_ID: process.env.PADDLE_VENDOR_ID || '',
  PADDLE_CLIENT_ID: process.env.PADDLE_CLIENT_ID || '',
  PADDLE_CLIENT_SECRET: process.env.PADDLE_CLIENT_SECRET || '',
  PADDLE_WEBHOOK_SECRET: process.env.PADDLE_WEBHOOK_SECRET || '',
  PADDLE_ENV: process.env.PADDLE_ENV || 'sandbox',
  PADDLE_PRICE_STARTER: process.env.PADDLE_PRICE_STARTER || '',
  PADDLE_PRODUCT_STARTER: process.env.PADDLE_PRODUCT_STARTER || '',
  PADDLE_PRICE_PRO: process.env.PADDLE_PRICE_PRO || '',
  PADDLE_PRODUCT_PRO: process.env.PADDLE_PRODUCT_PRO || '',
  PADDLE_PRICE_BUSINESS: process.env.PADDLE_PRICE_BUSINESS || '',
  PADDLE_PRODUCT_BUSINESS: process.env.PADDLE_PRODUCT_BUSINESS || '',
  
  PRICE_CHATBOT_STANDARD_M: process.env.PRICE_CHATBOT_STANDARD_M || '',
  PRICE_CHATBOT_STANDARD_Y: process.env.PRICE_CHATBOT_STANDARD_Y || '',
  PRICE_CHATBOT_PRO_M: process.env.PRICE_CHATBOT_PRO_M || '',
  PRICE_CHATBOT_PRO_Y: process.env.PRICE_CHATBOT_PRO_Y || '',
  PRICE_CHATBOT_ENTERPRISE_M: process.env.PRICE_CHATBOT_ENTERPRISE_M || '',
  PRICE_CHATBOT_ENTERPRISE_Y: process.env.PRICE_CHATBOT_ENTERPRISE_Y || '',
  
  PRICE_VOICE_STANDARD_M: process.env.PRICE_VOICE_STANDARD_M || '',
  PRICE_VOICE_STANDARD_Y: process.env.PRICE_VOICE_STANDARD_Y || '',
  PRICE_VOICE_PRO_M: process.env.PRICE_VOICE_PRO_M || '',
  PRICE_VOICE_PRO_Y: process.env.PRICE_VOICE_PRO_Y || '',
  PRICE_VOICE_ENTERPRISE_M: process.env.PRICE_VOICE_ENTERPRISE_M || '',
  PRICE_VOICE_ENTERPRISE_Y: process.env.PRICE_VOICE_ENTERPRISE_Y || '',
  
  PRICE_BUNDLE_STANDARD_M: process.env.PRICE_BUNDLE_STANDARD_M || '',
  PRICE_BUNDLE_STANDARD_Y: process.env.PRICE_BUNDLE_STANDARD_Y || '',
  PRICE_BUNDLE_PRO_M: process.env.PRICE_BUNDLE_PRO_M || '',
  PRICE_BUNDLE_PRO_Y: process.env.PRICE_BUNDLE_PRO_Y || '',
  PRICE_BUNDLE_ENTERPRISE_M: process.env.PRICE_BUNDLE_ENTERPRISE_M || '',
  PRICE_BUNDLE_ENTERPRISE_Y: process.env.PRICE_BUNDLE_ENTERPRISE_Y || '',
  
  STRIPE_ENABLED: process.env.STRIPE_ENABLED === 'true',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  STRIPE_PRICE_STD_M: process.env.STRIPE_PRICE_STD_M || '',
  STRIPE_PRICE_STD_Y: process.env.STRIPE_PRICE_STD_Y || '',
  STRIPE_PRICE_PRO_M: process.env.STRIPE_PRICE_PRO_M || '',
  STRIPE_PRICE_PRO_Y: process.env.STRIPE_PRICE_PRO_Y || '',
  STRIPE_PRICE_ENT_M: process.env.STRIPE_PRICE_ENT_M || '',
  STRIPE_PRICE_ENT_Y: process.env.STRIPE_PRICE_ENT_Y || '',
  
  POSTMARK_KEY: process.env.POSTMARK_KEY || '',
  SENDGRID_KEY: process.env.SENDGRID_KEY || '',
  
  N8N_SIGNING_SECRET: process.env.N8N_SIGNING_SECRET || '',
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || '',
  
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  WHATSAPP_SENDER_ID: process.env.WHATSAPP_SENDER_ID || '',
  
  PADDLE_DOMAIN_TOKEN: process.env.PADDLE_DOMAIN_TOKEN || '',
  PADDLE_DOMAIN_TXT: process.env.PADDLE_DOMAIN_TXT || '',
  
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:9002',
  SITE_URL: process.env.SITE_URL || 'https://agent.unik-ks.com',
  ROOT_DOMAIN: process.env.ROOT_DOMAIN || 'unik-ks.com',
  WIDGET_ORIGIN: process.env.WIDGET_ORIGIN || 'https://agent.unik-ks.com',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:9002,https://agent.unik-ks.com',
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@unik-ks.com',
  
  PADDLE_ENABLED: process.env.PADDLE_ENABLED !== 'false',
  EMAIL_ENABLED: process.env.EMAIL_ENABLED !== 'false',
  VOICE_ENABLED: process.env.VOICE_ENABLED !== 'false',
  WHATSAPP_ENABLED: process.env.WHATSAPP_ENABLED !== 'false',
  N8N_ENABLED: process.env.N8N_ENABLED !== 'false',
} as const;

export function isFeatureAvailable(feature: keyof typeof env): boolean {
  const value = env[feature];
  return typeof value === 'string' ? value.length > 0 : value === true;
}
