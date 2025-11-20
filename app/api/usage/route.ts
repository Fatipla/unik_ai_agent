import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db } from '@/src/lib/db';
import { usage } from '@/src/lib/db/schema-nextauth';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userUsage = await db.query.usage.findFirst({
      where: eq(usage.userId, (session.user as any).id),
    });

    if (!userUsage) {
      // Create usage record if it doesn't exist
      const [newUsage] = await db.insert(usage).values({
        userId: (session.user as any).id,
        promptsMonth: 0,
        promptsDay: 0,
      }).returning();

      return NextResponse.json(newUsage);
    }

    return NextResponse.json(userUsage);
  } catch (error) {
    console.error('Usage fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}
