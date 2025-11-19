import { NextRequest, NextResponse } from 'next/server';
import { db, usersProfile } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { getCurrentMonthString } from '@/lib/pricing';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existing = await db.select().from(usersProfile).where(eq(usersProfile.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const [user] = await db.insert(usersProfile).values({
      email,
      displayName: displayName || email.split('@')[0],
      passwordHash,
      plan: 'free',
      billingInterval: 'monthly',
      usageMonth: getCurrentMonthString(),
      activation: [],
      dataSources: { urls: [], fileRefs: [] },
    }).returning();

    // Generate token
    const token = generateToken({
      userId: user.userId,
      email: user.email,
      plan: user.plan,
    });

    return NextResponse.json({
      user: {
        userId: user.userId,
        email: user.email,
        displayName: user.displayName,
        plan: user.plan,
      },
      token,
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
