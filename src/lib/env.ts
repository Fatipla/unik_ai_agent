// Environment variables with safe defaults
export const env = {
  // Database
  POSTGRES_URL: process.env.POSTGRES_URL || "",

  // App URLs
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE || "",

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  EMBEDDING_MODEL: process.env.EMBEDDING_MODEL || "text-embedding-3-large",
  RESPONSES_MODEL: process.env.RESPONSES_MODEL || "gpt-4o-mini",
  REALTIME_MODEL: process.env.REALTIME_MODEL || "gpt-4o-realtime-preview",

  // Paddle Billing
  PADDLE_ENV: (process.env.PADDLE_ENV || "sandbox") as "sandbox" | "live",
  PADDLE_API_KEY: process.env.PADDLE_API_KEY || "",
  PADDLE_WEBHOOK_SECRET: process.env.PADDLE_WEBHOOK_SECRET || "",
  PADDLE_PORTAL_URL: process.env.PADDLE_PORTAL_URL || "",

  // Paddle Price IDs - Chatbot
  PRICE_CHATBOT_STARTER_M: process.env.PRICE_CHATBOT_STARTER_M || "",
  PRICE_CHATBOT_STARTER_Y: process.env.PRICE_CHATBOT_STARTER_Y || "",
  PRICE_CHATBOT_STANDARD_M: process.env.PRICE_CHATBOT_STANDARD_M || "",
  PRICE_CHATBOT_STANDARD_Y: process.env.PRICE_CHATBOT_STANDARD_Y || "",
  PRICE_CHATBOT_PRO_M: process.env.PRICE_CHATBOT_PRO_M || "",
  PRICE_CHATBOT_PRO_Y: process.env.PRICE_CHATBOT_PRO_Y || "",
  PRICE_CHATBOT_ENTERPRISE_M: process.env.PRICE_CHATBOT_ENTERPRISE_M || "",
  PRICE_CHATBOT_ENTERPRISE_Y: process.env.PRICE_CHATBOT_ENTERPRISE_Y || "",

  // Paddle Price IDs - Voice
  PRICE_VOICE_STARTER_M: process.env.PRICE_VOICE_STARTER_M || "",
  PRICE_VOICE_STARTER_Y: process.env.PRICE_VOICE_STARTER_Y || "",
  PRICE_VOICE_STANDARD_M: process.env.PRICE_VOICE_STANDARD_M || "",
  PRICE_VOICE_STANDARD_Y: process.env.PRICE_VOICE_STANDARD_Y || "",
  PRICE_VOICE_PRO_M: process.env.PRICE_VOICE_PRO_M || "",
  PRICE_VOICE_PRO_Y: process.env.PRICE_VOICE_PRO_Y || "",
  PRICE_VOICE_ENTERPRISE_M: process.env.PRICE_VOICE_ENTERPRISE_M || "",
  PRICE_VOICE_ENTERPRISE_Y: process.env.PRICE_VOICE_ENTERPRISE_Y || "",

  // Paddle Price IDs - Bundle
  PRICE_BUNDLE_STARTER_M: process.env.PRICE_BUNDLE_STARTER_M || "",
  PRICE_BUNDLE_STARTER_Y: process.env.PRICE_BUNDLE_STARTER_Y || "",
  PRICE_BUNDLE_STANDARD_M: process.env.PRICE_BUNDLE_STANDARD_M || "",
  PRICE_BUNDLE_STANDARD_Y: process.env.PRICE_BUNDLE_STANDARD_Y || "",
  PRICE_BUNDLE_PRO_M: process.env.PRICE_BUNDLE_PRO_M || "",
  PRICE_BUNDLE_PRO_Y: process.env.PRICE_BUNDLE_PRO_Y || "",
  PRICE_BUNDLE_ENTERPRISE_M: process.env.PRICE_BUNDLE_ENTERPRISE_M || "",
  PRICE_BUNDLE_ENTERPRISE_Y: process.env.PRICE_BUNDLE_ENTERPRISE_Y || "",

  // Paddle Add-ons
  PRICE_ADDON_MSG_PACK: process.env.PRICE_ADDON_MSG_PACK || "",
  PRICE_ADDON_MIN_PACK: process.env.PRICE_ADDON_MIN_PACK || "",

  // Coupons
  PADDLE_COUPON_CODES: process.env.PADDLE_COUPON_CODES || "",

  // Security
  JWT_SECRET: process.env.JWT_SECRET || "",
  ENCRYPTION_KEY_32B: process.env.ENCRYPTION_KEY_32B || "",

  // Node environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // Email
  POSTMARK_KEY: process.env.POSTMARK_KEY || "",
  SENDGRID_KEY: process.env.SENDGRID_KEY || "",

  // n8n
  N8N_SIGNING_SECRET: process.env.N8N_SIGNING_SECRET || "",
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL || "",

  // Twilio (optional)
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  WHATSAPP_SENDER_ID: process.env.WHATSAPP_SENDER_ID || "",

  // App
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "dev-secret-change-in-production",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:9002",
  SITE_URL: process.env.SITE_URL || "https://agent.unik-ks.com",
  ROOT_DOMAIN: process.env.ROOT_DOMAIN || "unik-ks.com",
  WIDGET_ORIGIN: process.env.WIDGET_ORIGIN || "https://agent.unik-ks.com",
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:9002,https://agent.unik-ks.com",
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || "support@unik-ks.com",

  // Feature flags
  PADDLE_ENABLED: process.env.PADDLE_ENABLED !== "false",
  EMAIL_ENABLED: process.env.EMAIL_ENABLED !== "false",
  VOICE_ENABLED: process.env.VOICE_ENABLED !== "false",
  WHATSAPP_ENABLED: process.env.WHATSAPP_ENABLED !== "false",
  N8N_ENABLED: process.env.N8N_ENABLED !== "false",
} as const

// Check if a feature is available
export function isFeatureAvailable(feature: keyof typeof env): boolean {
  const value = env[feature]
  return typeof value === "string" ? value.length > 0 : value === true
}

// Validate required environment variables
export function validateEnv() {
  const required = [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "OPENAI_API_KEY",
    "JWT_SECRET",
  ]

  const missing = required.filter((key) => !env[key as keyof typeof env])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

// Call validation on startup (server-side only)
if (typeof window === "undefined") {
  validateEnv()
}
