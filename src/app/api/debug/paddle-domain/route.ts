// Debug endpoint for Paddle domain TXT record
// Returns TXT value in non-production, 404 in production

import { NextResponse } from 'next/server';

export async function GET() {
  // Only allow in non-production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const txt = process.env.PADDLE_DOMAIN_TXT ?? null;

  return NextResponse.json({ txt }, { status: 200 });
}
