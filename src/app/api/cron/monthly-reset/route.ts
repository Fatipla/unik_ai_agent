import { NextRequest, NextResponse } from 'next/server';
import { monthlyUsageReset } from '@/lib/schedulers/monthly-reset';

// Vercel Cron Job endpoint
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await monthlyUsageReset();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}
