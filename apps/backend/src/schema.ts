import z from 'zod';

export const AskResultSchema = z.object({
    summary: z.string().min(1).max(1000).describe('The summary of the final answer to the user'),
    confidence: z.number().min(0).max(1).describe('Confidence score between 0 and 1'),
});

export type AskResult = z.infer<typeof AskResultSchema>;