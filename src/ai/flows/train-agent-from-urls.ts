'use server';

/**
 * @fileOverview Trains the AI agent by crawling content from provided URLs.
 *
 * - trainAgentFromUrls - A function that queues a training job for the agent based on URLs.
 * - TrainAgentFromUrlsInput - The input type for the trainAgentFromUrls function.
 * - TrainAgentFromUrlsOutput - The return type for the trainAgentFromUrls function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrainAgentFromUrlsInputSchema = z.object({
  urls: z
    .array(z.string().url())
    .describe('An array of URLs to crawl and train the AI agent with.'),
  uid: z.string().describe('The user ID.'),
});
export type TrainAgentFromUrlsInput = z.infer<typeof TrainAgentFromUrlsInputSchema>;

const TrainingJobStatusSchema = z.enum(['queued', 'running', 'done', 'failed']);

const TrainAgentFromUrlsOutputSchema = z.object({
  jobId: z.string().describe('The ID of the training job.'),
  status: TrainingJobStatusSchema.describe('The status of the training job.'),
});
export type TrainAgentFromUrlsOutput = z.infer<typeof TrainAgentFromUrlsOutputSchema>;

export async function trainAgentFromUrls(input: TrainAgentFromUrlsInput): Promise<TrainAgentFromUrlsOutput> {
  return trainAgentFromUrlsFlow(input);
}

const trainAgentFromUrlsFlow = ai.defineFlow(
  {
    name: 'trainAgentFromUrlsFlow',
    inputSchema: TrainAgentFromUrlsInputSchema,
    outputSchema: TrainAgentFromUrlsOutputSchema,
  },
  async input => {
    const jobId = generateJobId();

    // Simulate queuing a training job (replace with actual implementation).
    await queueTrainingJob(jobId, input.uid, input.urls);

    return {
      jobId,
      status: 'queued' as const,
    };
  }
);

async function queueTrainingJob(jobId: string, uid: string, urls: string[]): Promise<void> {
  // In a real implementation, this function would:
  // 1. Create a training job record in Firestore (trainingJobs collection).
  // 2. Push a message to a queue (e.g., Pub/Sub) to trigger the crawler.
  // 3. The crawler would then crawl the URLs, chunk the content, create embeddings,
  //    and store them in a vector database or similar.
  console.log(`[queueTrainingJob] Job ${jobId} queued for user ${uid} with URLs:`, urls);

  // Simulate writing to Firestore
  // await firestore.collection('trainingJobs').doc(jobId).set({
  //   uid: uid,
  //   type: 'crawl',
  //   status: 'queued',
  //   sources: urls,
  //   createdAt: new Date(),
  // });

  // Simulate pushing to a queue
  // await pubsub.topic('training-jobs').publishMessage({data: Buffer.from(JSON.stringify({
  //   jobId: jobId,
  //   uid: uid,
  //   urls: urls,
  // }))});

  // Placeholder for actual queueing logic
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
}

function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}
