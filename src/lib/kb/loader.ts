/**
 * Load and chunk knowledge base sources
 */

export interface ChunkResult {
  content: string
  ord: number
}

/**
 * Chunk text into smaller pieces for embedding
 */
export function chunkText(text: string, maxChunkSize = 1000, overlap = 200): ChunkResult[] {
  const chunks: ChunkResult[] = []
  let start = 0
  let ord = 0

  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length)
    const chunk = text.slice(start, end)

    chunks.push({
      content: chunk,
      ord: ord++,
    })

    start += maxChunkSize - overlap
  }

  return chunks
}

/**
 * Load content from URL
 */
export async function loadFromUrl(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  return response.text()
}

/**
 * Extract text from file buffer (simplified - would need proper parsers)
 */
export function extractTextFromFile(buffer: Buffer, mimeType: string): string {
  if (mimeType === "text/plain" || mimeType === "text/markdown") {
    return buffer.toString("utf-8")
  }

  // For PDF/DOCX would need additional libraries
  throw new Error(`Unsupported file type: ${mimeType}`)
}
