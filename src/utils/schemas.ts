import { z } from 'zod';

export const basicChoiceSchema = z.object({
  id: z.string().min(1, 'Choice id is required'),
  title: z.string().min(1, 'Choice title is required'),
  color: z.string().min(1, 'Choice color is required'),
  description: z.string().optional(),
  link: z.string().optional(),
});

export const pollMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  pollLink: z.string().optional(),
  description: z.string().optional(),
  answerType: z.string().min(1, 'Answer type is required'),
  requestComment: z.boolean(),
});
