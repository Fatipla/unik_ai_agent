import OpenAI from "openai"
import { env } from "../env"

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

/**
 * Create embeddings for text chunks
 */
export async function createEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: env.EMBEDDING_MODEL,
    input: texts,
  })

  return response.data.map((item) => item.embedding)
}

/**
 * Create embedding for a single text
 */
export async function createEmbedding(text: string): Promise<number[]> {
  const embeddings = await createEmbeddings([text])
  return embeddings[0]
}
