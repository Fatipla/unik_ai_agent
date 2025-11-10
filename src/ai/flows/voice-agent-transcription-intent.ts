// A Genkit flow that transcribes voice calls and determines the user's intent using NLU.

'use server';

/**
 * @fileOverview A voice agent flow that transcribes audio and determines intent.
 *
 * - voiceAgentTranscriptionAndIntent - A function that handles the voice call transcription and intent determination process.
 * - VoiceAgentTranscriptionAndIntentInput - The input type for the voiceAgentTranscriptionAndIntent function.
 * - VoiceAgentTranscriptionAndIntentOutput - The return type for the voiceAgentTranscriptionAndIntent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceAgentTranscriptionAndIntentInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data URI of the voice call recording, must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceAgentTranscriptionAndIntentInput = z.infer<typeof VoiceAgentTranscriptionAndIntentInputSchema>;

const VoiceAgentTranscriptionAndIntentOutputSchema = z.object({
  transcript: z.string().describe('The transcribed text from the audio.'),
  intent: z.string().describe('The determined intent of the user.'),
  entities: z.record(z.string()).describe('Entities extracted from the transcript.'),
});
export type VoiceAgentTranscriptionAndIntentOutput = z.infer<typeof VoiceAgentTranscriptionAndIntentOutputSchema>;

export async function voiceAgentTranscriptionAndIntent(
  input: VoiceAgentTranscriptionAndIntentInput
): Promise<VoiceAgentTranscriptionAndIntentOutput> {
  return voiceAgentTranscriptionAndIntentFlow(input);
}

const transcriptionAndIntentPrompt = ai.definePrompt({
  name: 'transcriptionAndIntentPrompt',
  input: {schema: VoiceAgentTranscriptionAndIntentInputSchema},
  output: {schema: VoiceAgentTranscriptionAndIntentOutputSchema},
  prompt: `You are an AI voice agent assistant.

  Your task is to transcribe the given audio and determine the intent of the user from the transcription. Also extract entities from the transcript.

  Audio: {{media url=audioDataUri}}

  Return the transcript, intent, and entities in the output schema format.`,
});

const voiceAgentTranscriptionAndIntentFlow = ai.defineFlow(
  {
    name: 'voiceAgentTranscriptionAndIntentFlow',
    inputSchema: VoiceAgentTranscriptionAndIntentInputSchema,
    outputSchema: VoiceAgentTranscriptionAndIntentOutputSchema,
  },
  async input => {
    const {output} = await transcriptionAndIntentPrompt(input);
    return output!;
  }
);
