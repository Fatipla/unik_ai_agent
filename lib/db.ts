// Re-export from src/lib/db for backward compatibility
export { db } from '@/src/lib/db';

// Export legacy schemas with their new names
export {
  usersProfile,
  messagesLegacy as messages,
  emails,
  paddleCustomers,
  paddlePrices,
  trainingJobs,
  voiceCallsLegacy as voiceCalls,
  webhooksLog,
  webhookEventsLegacy as webhookEvents,
  conversationsLegacy as conversations,
  subscriptionsLegacy as paddleSubscriptions,
} from '@/src/lib/db';
