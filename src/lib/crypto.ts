import CryptoJS from "crypto-js"
import { env } from "./env"

/**
 * Encrypt agent API key secret using AES-256-GCM
 */
export function encryptSecret(plaintext: string): string {
  if (!env.ENCRYPTION_KEY_32B) {
    throw new Error("ENCRYPTION_KEY_32B not configured")
  }

  return CryptoJS.AES.encrypt(plaintext, env.ENCRYPTION_KEY_32B).toString()
}

/**
 * Decrypt agent API key secret
 */
export function decryptSecret(ciphertext: string): string {
  if (!env.ENCRYPTION_KEY_32B) {
    throw new Error("ENCRYPTION_KEY_32B not configured")
  }

  const bytes = CryptoJS.AES.decrypt(ciphertext, env.ENCRYPTION_KEY_32B)
  return bytes.toString(CryptoJS.enc.Utf8)
}
