import { NextRequest, NextResponse } from 'next/server';
import { db, webhooksLog } from '@/lib/db';
import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';
import { env } from '@/lib/env';

export async function POST(
  request: NextRequest,
  { params }: { params: { flow: string } }
) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-signature');

    // Verify signature if n8n enabled
    if (env.N8N_ENABLED && env.N8N_SIGNING_SECRET) {
      const expectedSignature = createHash('sha256')
        .update(rawBody + env.N8N_SIGNING_SECRET)
        .digest('hex');

      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // Calculate payload hash for idempotency
    const payloadHash = createHash('sha256').update(rawBody).digest('hex');

    // Check if already processed
    const existing = await db.select()
      .from(webhooksLog)
      .where(eq(webhooksLog.payloadHash, payloadHash))
      .limit(1);

    if (existing.length > 0) {
      console.log('[WEBHOOK] Duplicate payload detected:', payloadHash);
      return NextResponse.json({ status: 'already_processed' });
    }

    // Log webhook
    await db.insert(webhooksLog).values({
      provider: 'n8n',
      payloadHash,
      status: 'received',
      retries: 0,
    });

    // Parse and process payload
    const payload = JSON.parse(rawBody);
    console.log('[WEBHOOK] n8n webhook received:', params.flow, payload);

    // TODO: Process based on flow type
    // For now, just log and return success

    // Update status
    await db.update(webhooksLog)
      .set({ status: 'processed' })
      .where(eq(webhooksLog.payloadHash, payloadHash));

    return NextResponse.json({ status: 'success' });
  } catch (error: any) {
    console.error('[WEBHOOK] n8n error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
