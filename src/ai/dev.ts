import { config } from 'dotenv';
config();

import '@/ai/flows/voice-agent-transcription-intent.ts';
import '@/ai/flows/train-agent-from-uploads.ts';
import '@/ai/flows/train-agent-from-urls.ts';
import '@/ai/flows/chatbot-intelligent-responses.ts';
