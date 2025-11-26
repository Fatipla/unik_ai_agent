import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { plans } from '@/src/lib/db/schema-plans';
import { eq } from 'drizzle-orm';

/**
 * GET /api/v1/plans/comparison
 * Returns structured comparison data grouped by product_type and tier
 * with both monthly and yearly variants side-by-side
 */
export async function GET() {
  try {
    const allPlans = await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true))
      .orderBy(plans.productType, plans.tier);

    // Group by product_type -> tier -> billing_period
    const comparison: Record<string, Record<string, { monthly: any; yearly: any }>> = {
      chatbot: { standard: { monthly: null, yearly: null }, pro: { monthly: null, yearly: null }, enterprise: { monthly: null, yearly: null } },
      voice: { standard: { monthly: null, yearly: null }, pro: { monthly: null, yearly: null }, enterprise: { monthly: null, yearly: null } },
      bundle: { standard: { monthly: null, yearly: null }, pro: { monthly: null, yearly: null }, enterprise: { monthly: null, yearly: null } },
    };

    allPlans.forEach((plan) => {
      const transformed = {
        id: plan.id,
        product_type: plan.productType,
        tier: plan.tier,
        billing_period: plan.billingPeriod,
        currency: plan.currency,
        price: parseFloat(plan.price),
        ...plan.limits,
      };

      const productType = plan.productType;
      const tier = plan.tier;
      const billingPeriod = plan.billingPeriod;

      if (comparison[productType] && comparison[productType][tier]) {
        comparison[productType][tier][billingPeriod] = transformed;
      }
    });

    return NextResponse.json({
      comparison,
      metadata: {
        product_types: ['chatbot', 'voice', 'bundle'],
        tiers: ['standard', 'pro', 'enterprise'],
        billing_periods: ['monthly', 'yearly'],
        yearly_discount: '20%',
      },
    });
  } catch (error: any) {
    console.error('Plans comparison error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch plans comparison' },
      { status: 500 }
    );
  }
}
