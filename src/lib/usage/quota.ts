import { createServiceClient } from "../supabase/server"

export interface QuotaCheck {
  allowed: boolean
  remaining: number
  limit: number
  message?: string
}

/**
 * Record usage for a tenant
 */
export async function recordUsage(
  tenantId: string,
  metric: "CHAT_MESSAGES" | "VOICE_MINUTES" | "EMBED_TOKENS" | "SEATS",
  units: number,
  meta: Record<string, any> = {},
): Promise<void> {
  const supabase = await createServiceClient()

  const { error } = await supabase.from("usage_events").insert({
    tenant_id: tenantId,
    metric,
    units,
    meta,
  })

  if (error) {
    console.error("[v0] Failed to record usage:", error)
    throw error
  }
}

/**
 * Get remaining quota for a metric
 */
export async function remaining(tenantId: string, metric: string): Promise<number> {
  const supabase = await createServiceClient()

  // Get subscription and plan
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_key, current_period_end")
    .eq("tenant_id", tenantId)
    .single()

  if (!subscription) {
    return 0
  }

  // Get quota limit for plan
  const { data: quota } = await supabase
    .from("quotas")
    .select("limit_int")
    .eq("plan_key", subscription.plan_key)
    .eq("metric", metric)
    .single()

  if (!quota) {
    return 0
  }

  // Get usage in current period
  const periodStart = subscription.current_period_end
    ? new Date(new Date(subscription.current_period_end).getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const { data: usage } = await supabase
    .from("usage_events")
    .select("units")
    .eq("tenant_id", tenantId)
    .eq("metric", metric)
    .gte("created_at", periodStart)

  const totalUsed = usage?.reduce((sum, event) => sum + (event.units || 0), 0) || 0

  return Math.max(0, quota.limit_int - totalUsed)
}

/**
 * Check if tenant has quota available and throw 402 if not
 */
export async function requireQuota(tenantId: string, metric: string, units: number): Promise<void> {
  const available = await remaining(tenantId, metric)

  if (available < units) {
    const error = new Error(`Insufficient quota for ${metric}. Required: ${units}, Available: ${available}`)
    ;(error as any).statusCode = 402
    ;(error as any).code = "QUOTA_EXCEEDED"
    throw error
  }
}

/**
 * Get quota status for all metrics
 */
export async function getQuotaStatus(tenantId: string): Promise<Record<string, QuotaCheck>> {
  const supabase = await createServiceClient()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_key")
    .eq("tenant_id", tenantId)
    .single()

  if (!subscription) {
    return {}
  }

  const { data: quotas } = await supabase.from("quotas").select("*").eq("plan_key", subscription.plan_key)

  if (!quotas) {
    return {}
  }

  const status: Record<string, QuotaCheck> = {}

  for (const quota of quotas) {
    const rem = await remaining(tenantId, quota.metric)
    status[quota.metric] = {
      allowed: rem > 0,
      remaining: rem,
      limit: quota.limit_int,
    }
  }

  return status
}
