import { createServiceClient } from "../supabase/server"

/**
 * Check if tenant has a specific feature enabled
 */
export async function hasFeature(tenantId: string, feature: string): Promise<boolean> {
  const supabase = await createServiceClient()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_key")
    .eq("tenant_id", tenantId)
    .single()

  if (!subscription) {
    return false
  }

  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("value")
    .eq("plan_key", subscription.plan_key)
    .eq("feature", feature)
    .single()

  if (!entitlement) {
    return false
  }

  // Parse value (could be boolean string or JSON)
  const value = entitlement.value
  if (typeof value === "string") {
    return value === "true"
  }
  return !!value
}

/**
 * Get all entitlements for a tenant
 */
export async function getEntitlements(tenantId: string): Promise<Record<string, any>> {
  const supabase = await createServiceClient()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_key")
    .eq("tenant_id", tenantId)
    .single()

  if (!subscription) {
    return {}
  }

  const { data: entitlements } = await supabase.from("entitlements").select("*").eq("plan_key", subscription.plan_key)

  if (!entitlements) {
    return {}
  }

  const result: Record<string, any> = {}
  for (const ent of entitlements) {
    result[ent.feature] = ent.value
  }

  return result
}

/**
 * Require a feature or throw 403
 */
export async function requireFeature(tenantId: string, feature: string): Promise<void> {
  const enabled = await hasFeature(tenantId, feature)

  if (!enabled) {
    const error = new Error(`Feature "${feature}" not available in your plan`)
    ;(error as any).statusCode = 403
    ;(error as any).code = "FEATURE_NOT_AVAILABLE"
    throw error
  }
}
