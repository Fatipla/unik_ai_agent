import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db } from '@/lib/db';
import { voiceCalls } from '@/lib/db/schema-conversations';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const userVoiceCalls = await db
      .select()
      .from(voiceCalls)
      .where(eq(voiceCalls.userId, (session.user as any).id))
      .orderBy(desc(voiceCalls.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ voiceCalls: userVoiceCalls });
  } catch (error) {
    console.error('Voice calls fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch voice calls' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { callSid, duration, status, transcript, recordingUrl, costEur } = await req.json();

    const [voiceCall] = await db
      .insert(voiceCalls)
      .values({
        userId: (session.user as any).id,
        callSid: callSid || null,
        duration: duration || 0,
        status: status || 'completed',
        transcript: transcript || null,
        recordingUrl: recordingUrl || null,
        costEur: costEur || '0',
        endedAt: new Date(),
      })
      .returning();

    return NextResponse.json({ voiceCall });
  } catch (error) {
    console.error('Voice call save error:', error);
    return NextResponse.json(
      { error: 'Failed to save voice call' },
      { status: 500 }
    );
  }
}
