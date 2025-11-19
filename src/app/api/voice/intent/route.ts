import { NextRequest, NextResponse } from 'next/server';
import { getUserFromHeaders } from '@/lib/auth';
import { createChatCompletion } from '@/lib/openai';
import { db, voiceCalls } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';

export async function POST(request: NextRequest) {
  const user = getUserFromHeaders(request.headers);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { callId, transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json({ error: 'Transcription required' }, { status: 400 });
    }

    // Classify intent using OpenAI
    const messages = [
      {
        role: 'system' as const,
        content: 'You are an intent classifier. Classify the following transcription into one of: booking, sales, support, other. Return only the intent word.',
      },
      {
        role: 'user' as const,
        content: transcription,
      },
    ];

    const { text: intent } = env.OPENAI_API_KEY
      ? await createChatCompletion(messages)
      : { text: 'support' };

    // Update voice call with intent
    if (callId) {
      await db.update(voiceCalls)
        .set({
          intent: intent.toLowerCase().trim(),
          scheduleRequested: intent.toLowerCase().includes('booking'),
        })
        .where(eq(voiceCalls.id, callId));
    }

    // If booking intent and n8n enabled, trigger webhook
    if (intent.toLowerCase().includes('booking') && env.N8N_ENABLED && env.N8N_WEBHOOK_URL) {
      try {
        await fetch(env.N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': 'signed-payload', // TODO: implement signing
          },
          body: JSON.stringify({
            userId: user.userId,
            callId,
            intent: 'booking',
            transcription,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error('n8n webhook error:', error);
      }
    }

    return NextResponse.json({
      callId,
      intent: intent.toLowerCase().trim(),
      scheduleRequested: intent.toLowerCase().includes('booking'),
    });
  } catch (error: any) {
    console.error('Intent classification error:', error);
    return NextResponse.json(
      { error: 'Intent classification failed' },
      { status: 500 }
    );
  }
}
