import OpenAI from 'openai';
import { env } from './env';

// Initialize OpenAI client
export const openai = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;

// Count tokens (approximation: 1 token ≈ 4 characters for English)
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// Create chat completion with token tracking
export async function createChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  model: string = env.OPENAI_MODEL
): Promise<{
  text: string;
  tokensIn: number;
  tokensOut: number;
}> {
  if (!openai) {
    throw new Error('OpenAI client not initialized - API key missing');
  }

  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  const text = completion.choices[0]?.message?.content || '';
  const tokensIn = completion.usage?.prompt_tokens || estimateTokens(messages.map(m => m.content).join(' '));
  const tokensOut = completion.usage?.completion_tokens || estimateTokens(text);

  return {
    text,
    tokensIn,
    tokensOut,
  };
}

// Create embeddings
export async function createEmbedding(text: string): Promise<{
  embedding: number[];
  tokens: number;
}> {
  if (!openai) {
    throw new Error('OpenAI client not initialized - API key missing');
  }

  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return {
    embedding: response.data[0].embedding,
    tokens: response.usage.total_tokens,
  };
}

// Transcribe audio using Whisper
export async function transcribeAudio(audioFile: File | Buffer): Promise<{
  text: string;
  duration: number;
}> {
  if (!openai) {
    throw new Error('OpenAI client not initialized - API key missing');
  }

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile as any,
    model: 'whisper-1',
  });

  // Estimate duration (rough approximation: 150 words/minute)
  const wordCount = transcription.text.split(' ').length;
  const duration = wordCount / 150;

  return {
    text: transcription.text,
    duration,
  };
}

// Text-to-speech
export async function generateSpeech(text: string, voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy'): Promise<Buffer> {
  if (!openai) {
    throw new Error('OpenAI client not initialized - API key missing');
  }

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice,
    input: text,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}
