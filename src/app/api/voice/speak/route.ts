import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';
import { generateSpeech } from '@/lib/openai';
import { calculateTTSCost } from '@/lib/pricing';
import { db, usersProfile } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';
import { env } from '@/lib/env';

// Force Node.js runtime for Buffer support
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!env.VOICE_ENABLED || !env.OPENAI_API_KEY) {
    return NextResponse.json({
      error: 'Voice features not enabled',
      stubbed: true,
    }, { status: 503 });
  }

  try {
    const { text, voice = 'alloy' } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 });
    }

    // Generate speech
    const audioBuffer = await generateSpeech(text, voice as any);
    const cost = calculateTTSCost(text.length);

    // Update usage
    await db.update(usersProfile)
      .set({
        usageCostEur: sql`${usersProfile.usageCostEur} + ${cost}`,
      })
      .where(eq(usersProfile.userId, user.userId));

    // Return audio
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Text-to-speech failed' },
      { status: 500 }
    );
  }
}
