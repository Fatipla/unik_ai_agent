import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { db } from '@/lib/db';
import { conversations } from '@/lib/db/schema-conversations';
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

    const userConversations = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, (session.user as any).id))
      .orderBy(desc(conversations.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ conversations: userConversations });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
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

    const { message, response, sessionId, tokensUsed } = await req.json();

    const [conversation] = await db
      .insert(conversations)
      .values({
        userId: (session.user as any).id,
        message,
        response,
        sessionId: sessionId || null,
        tokensUsed: tokensUsed || 0,
        type: 'chatbot',
      })
      .returning();

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error('Conversation save error:', error);
    return NextResponse.json(
      { error: 'Failed to save conversation' },
      { status: 500 }
    );
  }
}
