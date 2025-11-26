import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { plans } from '@/lib/db/schema-plans';
import { eq, and } from 'drizzle-orm';

/**
 * GET /api/v1/plans
 * List all active plans with optional filters
 * 
 * Query parameters:
 * - product_type: chatbot | voice | bundle
 * - billing_period: monthly | yearly
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productType = searchParams.get('product_type');
    const billingPeriod = searchParams.get('billing_period');

    // Build where conditions
    const conditions = [eq(plans.isActive, true)];
    
    if (productType) {
      conditions.push(eq(plans.productType, productType));
    }
    
    if (billingPeriod) {
      conditions.push(eq(plans.billingPeriod, billingPeriod));
    }

    const allPlans = await db
      .select()
      .from(plans)
      .where(and(...conditions))
      .orderBy(plans.productType, plans.tier, plans.billingPeriod);

    // Transform for frontend consumption
    const transformed = allPlans.map((plan) => ({
      id: plan.id,
      product_type: plan.productType,
      tier: plan.tier,
      billing_period: plan.billingPeriod,
      currency: plan.currency,
      price: parseFloat(plan.price),
      // Flatten limits for easy access
      ...plan.limits,
    }));

    return NextResponse.json({
      plans: transformed,
      count: transformed.length,
    });
  } catch (error: any) {
    console.error('Plans fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}
