import { NextRequest, NextResponse } from 'next/server';
import { db, trainingJobs } from '@/lib/db';
import { getUserFromHeaders } from '@/lib/auth';
import { eq, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const jobs = await db.select()
      .from(trainingJobs)
      .where(eq(trainingJobs.userId, user.userId))
      .orderBy(desc(trainingJobs.createdAt))
      .limit(50);

    return NextResponse.json({ jobs });
  } catch (error: any) {
    console.error('Get training jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training jobs' },
      { status: 500 }
    );
  }
}
