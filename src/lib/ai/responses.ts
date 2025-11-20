import OpenAI from "openai"
import { env } from "../env"

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface ChatCompletionOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

/**
 * Create a chat completion with OpenAI
 */
export async function createChatCompletion(messages: ChatMessage[], options: ChatCompletionOptions = {}) {
  const { model = env.RESPONSES_MODEL, temperature = 0.7, maxTokens = 2000, stream = false } = options

  if (stream) {
    return openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
      stream: true,
    })
  }

  return openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  })
}

/**
 * Stream a chat completion
 */
export async function* streamChatCompletion(messages: ChatMessage[], options: ChatCompletionOptions = {}) {
  const stream = (await createChatCompletion(messages, {
    ...options,
    stream: true,
  })) as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) {
      yield content
    }
  }
}
