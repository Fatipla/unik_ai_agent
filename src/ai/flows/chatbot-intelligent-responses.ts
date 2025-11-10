'use server';

/**
 * @fileOverview An AI agent to provide intelligent and context-aware responses for the chatbot.
 *
 * - chatbotIntelligentResponse - A function that handles the chatbot intelligent response process.
 * - ChatbotIntelligentResponseInput - The input type for the chatbotIntelligentResponse function.
 * - ChatbotIntelligentResponseOutput - The return type for the chatbotIntelligentResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotIntelligentResponseInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
  sessionId: z.string().optional().describe('The session ID of the conversation.'),
  lang: z.string().optional().describe('The language of the conversation.'),
  tone: z.string().optional().describe('The tone of the conversation.'),
  dataSources: z.object({
    urls: z.array(z.string()).optional().describe('Array of URLs to fetch data from.'),
    fileRefs: z.array(z.string()).optional().describe('Array of file references to fetch data from.'),
  }).optional().describe('Data sources to use for the conversation.'),
});
export type ChatbotIntelligentResponseInput = z.infer<typeof ChatbotIntelligentResponseInputSchema>;

const ChatbotIntelligentResponseOutputSchema = z.object({
  text: z.string().describe('The intelligent response from the chatbot.'),
  tokens: z.number().optional().describe('The number of tokens used in the response.'),
  costEur: z.number().optional().describe('The cost of the response in EUR.'),
  usageSummary: z.string().optional().describe('A summary of the usage for the current month.'),
  upsellHint: z.string().optional().describe('A hint to upsell the user to a higher plan.'),
});
export type ChatbotIntelligentResponseOutput = z.infer<typeof ChatbotIntelligentResponseOutputSchema>;

export async function chatbotIntelligentResponse(input: ChatbotIntelligentResponseInput): Promise<ChatbotIntelligentResponseOutput> {
  return chatbotIntelligentResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotIntelligentResponsePrompt',
  input: {schema: ChatbotIntelligentResponseInputSchema},
  output: {schema: ChatbotIntelligentResponseOutputSchema},
  prompt: `You are a helpful chatbot assistant. Respond to the user message in a helpful and informative way.\n\nUser Message: {{{message}}}`,
});

const chatbotIntelligentResponseFlow = ai.defineFlow(
  {
    name: 'chatbotIntelligentResponseFlow',
    inputSchema: ChatbotIntelligentResponseInputSchema,
    outputSchema: ChatbotIntelligentResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
