import { NextRequest, NextResponse } from 'next/server';
import { db, trainingJobs, usersProfile } from '@/lib/db';
import { getUserFromHeaders } from '@/lib/auth';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { error: 'URLs array required' },
        { status: 400 }
      );
    }

    // Create training job
    const [job] = await db.insert(trainingJobs).values({
      userId: user.userId,
      type: 'crawl',
      status: 'queued',
      sources: urls,
      stats: { totalUrls: urls.length, processed: 0, chunks: 0, embeddings: 0 },
    }).returning();

    // Update user data sources
    await db.update(usersProfile)
      .set({
        dataSources: {
          urls: urls,
          fileRefs: [],
        },
      })
      .where(eq(usersProfile.userId, user.userId));

    // TODO: Queue background job to process URLs
    // For now, mark as queued - implement worker later
    console.log('[TRAINING] Queued URL crawl job:', job.id, 'URLs:', urls.length);

    return NextResponse.json({
      jobId: job.id,
      status: 'queued',
      urls: urls.length,
      message: 'Training job queued. Processing will begin shortly.',
    });
  } catch (error: any) {
    console.error('Train URL error:', error);
    return NextResponse.json(
      { error: 'Failed to queue training job' },
      { status: 500 }
    );
  }
}
