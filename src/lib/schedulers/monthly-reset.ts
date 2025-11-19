import { db, usersProfile } from '@/lib/db';
import { getCurrentMonthString } from '@/lib/pricing';
import { sql } from 'drizzle-orm';

export async function monthlyUsageReset() {
  const currentMonth = getCurrentMonthString();
  
  console.log('[SCHEDULER] Running monthly usage reset for:', currentMonth);
  
  try {
    const result = await db.update(usersProfile)
      .set({
        usageMonth: currentMonth,
        usagePrompts: 0,
        usageCompletions: 0,
        usageTokensIn: 0,
        usageTokensOut: 0,
        usageCostEur: '0',
        usageCeilHit: false,
        updatedAt: new Date(),
      })
      .where(sql`usage_month != ${currentMonth}`);
    
    console.log('[SCHEDULER] Monthly reset complete. Rows updated:', result.rowCount);
    return { success: true, updated: result.rowCount };
  } catch (error) {
    console.error('[SCHEDULER] Monthly reset error:', error);
    throw error;
  }
}
