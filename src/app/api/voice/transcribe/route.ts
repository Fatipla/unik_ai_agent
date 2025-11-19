import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';
import { transcribeAudio } from '@/lib/openai';
import { calculateWhisperCost } from '@/lib/pricing';
import { db, voiceCalls, usersProfile } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!env.VOICE_ENABLED || !env.OPENAI_API_KEY) {
    return NextResponse.json({
      error: 'Voice features not enabled',
      transcription: 'This is a demo transcription. Enable VOICE_ENABLED and add OPENAI_API_KEY to use real transcription.',
      stubbed: true,
    });
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file required' }, { status: 400 });
    }

    // Transcribe audio
    const { text, duration } = await transcribeAudio(audioFile);
    const cost = calculateWhisperCost(duration);

    // Create voice call record
    const [call] = await db.insert(voiceCalls).values({
      userId: user.userId,
      transcriptPath: `transcripts/${Date.now()}.txt`,
    }).returning();

    // Update usage
    await db.update(usersProfile)
      .set({
        usageCostEur: sql`${usersProfile.usageCostEur} + ${cost}`,
      })
      .where(eq(usersProfile.userId, user.userId));

    return NextResponse.json({
      callId: call.id,
      transcription: text,
      duration,
      costEur: cost,
    });
  } catch (error: any) {
    console.error('Transcribe error:', error);
    return NextResponse.json(
      { error: 'Transcription failed' },
      { status: 500 }
    );
  }
}
