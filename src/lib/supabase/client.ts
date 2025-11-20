import { createBrowserClient } from "@supabase/ssr"
import { env } from "../env"

export function createClient() {
  return createBrowserClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_ANON_KEY)
}
