// API test: Paddle webhook signature and idempotency

import { describe, it, expect, beforeEach } from 'vitest';
import crypto from 'crypto';

const WEBHOOK_SECRET = 'test_secret_12345';
const WEBHOOK_URL = 'http://localhost:9002/api/webhooks/paddle';

function createPaddleSignature(body: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = `${timestamp}:${body}`;
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `ts=${timestamp};h1=${hash}`;
}

describe('Paddle Webhook', () => {
  it('rejects invalid signature', async () => {
    const body = JSON.stringify({
      event_id: 'evt_test123',
      event_type: 'subscription.created',
      data: {},
    });

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Paddle-Signature': 'ts=123;h1=invalid',
      },
      body,
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid signature');
  });

  it('accepts valid signature and processes event', async () => {
    const body = JSON.stringify({
      event_id: 'evt_test456',
      event_type: 'subscription.created',
      data: {
        id: 'sub_123',
        customer_id: 'ctm_123',
        status: 'active',
      },
    });

    const signature = createPaddleSignature(body, WEBHOOK_SECRET);

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Paddle-Signature': signature,
      },
      body,
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.received).toBe(true);
  });

  it('skips duplicate events (idempotent)', async () => {
    const body = JSON.stringify({
      event_id: 'evt_test789',
      event_type: 'subscription.updated',
      data: {},
    });

    const signature = createPaddleSignature(body, WEBHOOK_SECRET);

    // First request
    const response1 = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Paddle-Signature': signature,
      },
      body,
    });

    expect(response1.status).toBe(200);

    // Second request (duplicate)
    const response2 = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Paddle-Signature': signature,
      },
      body,
    });

    expect(response2.status).toBe(200);
    const data2 = await response2.json();
    expect(data2.duplicate).toBe(true);
  });
});
