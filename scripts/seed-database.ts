import { db, usersProfile, conversations, messages, trainingJobs } from '../src/lib/db';
import { hashPassword } from '../src/lib/auth';
import { getCurrentMonthString } from '../src/lib/pricing';

// Helper to normalize plan names (standard->starter, enterprise->business)
function normalizePlan(plan: string): string {
  if (plan === 'standard') return 'starter';
  if (plan === 'enterprise') return 'business';
  return plan;
}

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create demo user (Standard plan with 7-day trial)
    const [demoUser] = await db.insert(usersProfile).values([{
      email: 'demo@unik.ai',
      displayName: 'Demo User',
      passwordHash: await hashPassword('Demo1234!'),
      plan: normalizePlan('standard'),
      billingInterval: 'monthly',
      usageMonth: getCurrentMonthString(),
      activation: ['widget'],
      dataSources: {
        urls: ['https://docs.unik.ai/getting-started', 'https://docs.unik.ai/api-reference'],
        fileRefs: ['demo-guide.pdf'],
      },
      usagePrompts: 12,
      usageCompletions: 12,
      usageTokensIn: 850,
      usageTokensOut: 3200,
      usageCostEur: '0.45',
    }]).returning();

    console.log('✅ Created demo user:', demoUser.email);

    // Create sample conversations
    const [conv1] = await db.insert(conversations).values([{
      userId: demoUser.userId,
      source: 'widget',
      lang: 'en',
      tone: 'professional',
      planSnapshot: normalizePlan('standard'),
      tokensIn: 150,
      tokensOut: 400,
      costEur: '0.08',
    }).returning();

    // Add messages to conversation
    await db.insert(messages).values([
      {
        conversationId: conv1.id,
        role: 'user',
        text: 'How do I install the widget on my website?',
        tokensIn: 0,
        tokensOut: 0,
      },
      {
        conversationId: conv1.id,
        role: 'assistant',
        text: 'Installing the Unik AI widget is simple! Just copy the 1-line script tag from your dashboard and paste it before the closing </body> tag in your HTML. The widget will automatically appear on your site with your custom branding and settings.',
        tokensIn: 150,
        tokensOut: 400,
      },
    ]);

    const [conv2] = await db.insert(conversations).values({
      userId: demoUser.userId,
      source: 'widget',
      lang: 'en',
      tone: 'professional',
      planSnapshot: 'standard',
      tokensIn: 180,
      tokensOut: 500,
      costEur: '0.10',
    }).returning();

    await db.insert(messages).values([
      {
        conversationId: conv2.id,
        role: 'user',
        text: 'What happens when I reach my monthly AI cost limit?',
        tokensIn: 0,
        tokensOut: 0,
      },
      {
        conversationId: conv2.id,
        role: 'assistant',
        text: 'Great question! Unik AI has a built-in cost protection system. When your monthly AI costs reach 50% of your plan revenue (€9.995 for Standard plan), new requests are gracefully blocked with an upgrade prompt. This ensures you never have unexpected AI bills. You can upgrade anytime to continue service without interruption.',
        tokensIn: 180,
        tokensOut: 500,
      },
    ]);

    const [conv3] = await db.insert(conversations).values({
      userId: demoUser.userId,
      source: 'widget',
      lang: 'en',
      tone: 'friendly',
      planSnapshot: 'standard',
      tokensIn: 120,
      tokensOut: 350,
      costEur: '0.07',
      leadEmail: 'potential@customer.com',
    }).returning();

    await db.insert(messages).values([
      {
        conversationId: conv3.id,
        role: 'user',
        text: 'Can I train the AI with my own documentation?',
        tokensIn: 0,
        tokensOut: 0,
      },
      {
        conversationId: conv3.id,
        role: 'assistant',
        text: 'Absolutely! You can train your AI agent with custom knowledge from URLs or by uploading files (PDF, DOCX, TXT). Go to Dashboard > Knowledge Base to add your content. The AI will use this information to provide accurate, context-aware responses specific to your business.',
        tokensIn: 120,
        tokensOut: 350,
      },
    ]);

    console.log('✅ Created 3 sample conversations');

    // Create training jobs
    await db.insert(trainingJobs).values([
      {
        userId: demoUser.userId,
        type: 'crawl',
        status: 'done',
        sources: ['https://docs.unik.ai/getting-started'],
        stats: { totalUrls: 1, processed: 1, chunks: 15, embeddings: 15 },
      },
      {
        userId: demoUser.userId,
        type: 'upload',
        status: 'done',
        sources: ['demo-guide.pdf'],
        stats: { totalFiles: 1, processed: 1, chunks: 8, embeddings: 8 },
      },
    ]);

    console.log('✅ Created training jobs');

    // Create test users for different plans
    const [freeUser] = await db.insert(usersProfile).values({
      email: 'free@test.com',
      displayName: 'Free User',
      passwordHash: await hashPassword('Test1234!'),
      plan: 'free',
      usageMonth: getCurrentMonthString(),
    }).returning();

    const [proUser] = await db.insert(usersProfile).values({
      email: 'pro@test.com',
      displayName: 'Pro User',
      passwordHash: await hashPassword('Test1234!'),
      plan: 'pro',
      billingInterval: 'monthly',
      usageMonth: getCurrentMonthString(),
      activation: ['widget', 'voice', 'whatsapp'],
      aiVoiceEnabled: true,
    }).returning();

    const [entUser] = await db.insert(usersProfile).values({
      email: 'enterprise@test.com',
      displayName: 'Enterprise User',
      passwordHash: await hashPassword('Test1234!'),
      plan: 'enterprise',
      billingInterval: 'yearly',
      usageMonth: getCurrentMonthString(),
      activation: ['widget', 'voice', 'whatsapp'],
      aiVoiceEnabled: true,
    }).returning();

    console.log('✅ Created test users for all plans');

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('📝 Test Credentials:');
    console.log('');
    console.log('Demo User (Standard):');
    console.log('  Email: demo@unik.ai');
    console.log('  Password: Demo1234!');
    console.log('');
    console.log('Free User:');
    console.log('  Email: free@test.com');
    console.log('  Password: Test1234!');
    console.log('');
    console.log('Pro User:');
    console.log('  Email: pro@test.com');
    console.log('  Password: Test1234!');
    console.log('');
    console.log('Enterprise User:');
    console.log('  Email: enterprise@test.com');
    console.log('  Password: Test1234!');
    console.log('');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
