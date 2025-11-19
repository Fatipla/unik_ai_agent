import { db, usersProfile, paddleCustomers, paddlePayments } from '@/lib/db';
import { eq, and, lt } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';

interface DunningSchedule {
  attemptNumber: number;
  daysAfterFailure: number;
  emailTemplate: string;
}

const DUNNING_SCHEDULE: DunningSchedule[] = [
  { attemptNumber: 1, daysAfterFailure: 1, emailTemplate: 'payment_failed_1' },
  { attemptNumber: 2, daysAfterFailure: 3, emailTemplate: 'payment_failed_2' },
  { attemptNumber: 3, daysAfterFailure: 7, emailTemplate: 'payment_failed_3' },
  { attemptNumber: 4, daysAfterFailure: 14, emailTemplate: 'payment_failed_final' },
];

export async function processDunning() {
  // Find users with failed payments in the last 14 days
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const failedPayments = await db.select()
    .from(paddlePayments)
    .where(
      and(
        eq(paddlePayments.status, 'failed'),
        lt(paddlePayments.createdAt, fourteenDaysAgo)
      )
    );

  for (const payment of failedPayments) {
    const [profile] = await db.select()
      .from(usersProfile)
      .where(eq(usersProfile.userId, payment.userId))
      .limit(1);

    if (!profile || !profile.email) continue;

    // Calculate days since failure
    const daysSinceFailure = Math.floor(
      (Date.now() - payment.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Find appropriate dunning step
    const dunningStep = DUNNING_SCHEDULE.find(
      (step) => step.daysAfterFailure === daysSinceFailure
    );

    if (dunningStep) {
      await sendDunningEmail(profile.email, dunningStep.emailTemplate, {
        userName: profile.displayName || profile.email,
        amount: (payment.amount / 100).toFixed(2),
        currency: payment.currency,
      });

      console.log(`[Dunning] Sent ${dunningStep.emailTemplate} to ${profile.email}`);
    }

    // After final attempt, suspend account
    if (daysSinceFailure >= 14) {
      await db.update(usersProfile)
        .set({
          plan: 'free',
          usageCeilHit: true,
        })
        .where(eq(usersProfile.userId, payment.userId));

      console.log(`[Dunning] Suspended account for ${profile.email}`);
    }
  }
}

async function sendDunningEmail(email: string, template: string, vars: any) {
  // Integrate with your email provider (Postmark, SendGrid, etc.)
  await sendEmail({
    to: email,
    template,
    variables: vars,
  });
}
