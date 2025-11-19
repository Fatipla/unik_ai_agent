import { NextRequest, NextResponse } from 'next/server';
import { dailyFreeReset } from '@/lib/schedulers/daily-reset';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await dailyFreeReset();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}
