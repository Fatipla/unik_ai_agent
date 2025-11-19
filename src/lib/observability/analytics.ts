interface AnalyticsEvent {
  event: string;
  userId?: string;
  properties?: Record<string, any>;
}

export function trackEvent(event: string, properties: Record<string, any> = {}) {
  const eventData: AnalyticsEvent = {
    event,
    userId: properties.userId,
    properties: {
      ...properties,
      timestamp: new Date().toISOString(),
    },
  };

  console.log('[ANALYTICS]', JSON.stringify(eventData));

  // TODO: Send to analytics service (PostHog, Mixpanel, etc.)
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(event, properties);
  }
}

// Widget events
export const WidgetEvents = {
  OPENED: 'widget_open',
  PROACTIVE_SHOWN: 'proactive_shown',
  MESSAGE_SENT: 'message_sent',
  RESPONSE_RETURNED: 'response_returned',
  EMAIL_CAPTURED: 'email_captured',
  WHATSAPP_HANDOFF: 'whatsapp_handoff',
  CAP_WARNING: 'cap_warning',
  CAP_BLOCK: 'cap_block',
} as const;

// Usage events
export const UsageEvents = {
  CHAT_COMPLETED: 'chat_completed',
  VOICE_TRANSCRIBED: 'voice_transcribed',
  TRAINING_STARTED: 'training_started',
  TRAINING_COMPLETED: 'training_completed',
} as const;

// Billing events
export const BillingEvents = {
  CHECKOUT_STARTED: 'checkout_started',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_UPDATED: 'subscription_updated',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  PAYMENT_SUCCEEDED: 'payment_succeeded',
  PAYMENT_FAILED: 'payment_failed',
} as const;
