import { NextRequest, NextResponse } from 'next/server';
import { db, trainingJobs, usersProfile } from '@/lib/db';
import { getUserFromHeaders } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const fileRefs: string[] = [];

    // Process each file
    for (const file of files) {
      if (file instanceof File) {
        // TODO: Upload to storage (Vercel Blob or S3)
        // For now, just log
        console.log('[TRAINING] File upload:', file.name, file.type, file.size);
        fileRefs.push(`file_${Date.now()}_${file.name}`);
      }
    }

    // Create training job
    const [job] = await db.insert(trainingJobs).values({
      userId: user.userId,
      type: 'upload',
      status: 'queued',
      sources: fileRefs,
      stats: { totalFiles: fileRefs.length, processed: 0, chunks: 0, embeddings: 0 },
    }).returning();

    // Update user data sources
    const [profile] = await db.select().from(usersProfile).where(eq(usersProfile.userId, user.userId)).limit(1);
    const currentSources = profile?.dataSources as any || { urls: [], fileRefs: [] };
    
    await db.update(usersProfile)
      .set({
        dataSources: {
          urls: currentSources.urls || [],
          fileRefs: [...(currentSources.fileRefs || []), ...fileRefs],
        },
      })
      .where(eq(usersProfile.userId, user.userId));

    console.log('[TRAINING] Queued file upload job:', job.id, 'Files:', fileRefs.length);

    return NextResponse.json({
      jobId: job.id,
      status: 'queued',
      files: fileRefs.length,
      message: 'Files uploaded. Training job queued.',
    });
  } catch (error: any) {
    console.error('Train upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
