// AI Pricing Configuration (EUR per 1K tokens)
export const AI_PRICING = {
  'gpt-4o': {
    promptEurPer1K: 0.0025,
    completionEurPer1K: 0.01,
  },
  'gpt-4o-mini': {
    promptEurPer1K: 0.00015,
    completionEurPer1K: 0.0006,
  },
  'gpt-3.5-turbo': {
    promptEurPer1K: 0.0005,
    completionEurPer1K: 0.0015,
  },
  'text-embedding-3-small': {
    promptEurPer1K: 0.00002,
    completionEurPer1K: 0,
  },
  'whisper-1': {
    perMinuteEur: 0.006,
  },
  'tts-1': {
    perCharEur: 0.000015,
  },
} as const;

// Plan Revenue Limits (Monthly)
export const PLAN_REVENUE = {
  free: 0,
  standard: 19.99,
  pro: 29.99,
  enterprise: 39.99,
} as const;

// AI Cost Cap (50% of revenue)
export const PLAN_AI_COST_CAP = {
  free: 0, // No AI costs allowed for free
  standard: 9.995, // 50% of €19.99
  pro: 14.995, // 50% of €29.99
  enterprise: 19.995, // 50% of €39.99
} as const;

// Plan Limits
export const PLAN_LIMITS = {
  free: {
    chatsPerDay: 5,
    chatsPerMonth: 150,
    voiceEnabled: false,
    whatsappEnabled: false,
  },
  standard: {
    chatsPerDay: null, // unlimited
    chatsPerMonth: 500,
    voiceEnabled: false,
    whatsappEnabled: true,
  },
  pro: {
    chatsPerDay: null,
    chatsPerMonth: 1500,
    voiceEnabled: true,
    whatsappEnabled: true,
  },
  enterprise: {
    chatsPerDay: null,
    chatsPerMonth: null, // unlimited
    voiceEnabled: true,
    whatsappEnabled: true,
  },
} as const;

// Calculate cost for a chat completion
export function calculateChatCost(
  model: keyof typeof AI_PRICING,
  tokensIn: number,
  tokensOut: number
): number {
  const pricing = AI_PRICING[model];
  if (!pricing || !('promptEurPer1K' in pricing)) {
    return 0;
  }
  
  const promptCost = (tokensIn / 1000) * pricing.promptEurPer1K;
  const completionCost = (tokensOut / 1000) * pricing.completionEurPer1K;
  
  return promptCost + completionCost;
}

// Calculate cost for embeddings
export function calculateEmbeddingCost(
  model: keyof typeof AI_PRICING,
  tokens: number
): number {
  const pricing = AI_PRICING[model];
  if (!pricing || !('promptEurPer1K' in pricing)) {
    return 0;
  }
  
  return (tokens / 1000) * pricing.promptEurPer1K;
}

// Calculate cost for Whisper transcription
export function calculateWhisperCost(durationMinutes: number): number {
  const pricing = AI_PRICING['whisper-1'];
  if (!pricing || !('perMinuteEur' in pricing)) {
    return 0;
  }
  
  return durationMinutes * pricing.perMinuteEur;
}

// Calculate cost for TTS
export function calculateTTSCost(characterCount: number): number {
  const pricing = AI_PRICING['tts-1'];
  if (!pricing || !('perCharEur' in pricing)) {
    return 0;
  }
  
  return characterCount * pricing.perCharEur;
}

// Check if adding this cost would exceed the plan's cap
export function wouldExceedCap(
  plan: keyof typeof PLAN_AI_COST_CAP,
  currentMonthCost: number,
  additionalCost: number
): boolean {
  const cap = PLAN_AI_COST_CAP[plan];
  return (currentMonthCost + additionalCost) > cap;
}

// Get current month string (YYYY-MM)
export function getCurrentMonthString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
