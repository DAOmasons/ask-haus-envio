import { z } from 'zod';

const tiptapMarkSchema = z.object({
  type: z.string(),
  attrs: z.record(z.unknown()).optional(),
});

const tiptapNodeSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    type: z.string(),
    attrs: z.record(z.unknown()).optional(),
    content: z.array(tiptapNodeSchema).optional(),
    marks: z.array(tiptapMarkSchema).optional(),
    text: z.string().optional(),
  })
);

export const tiptapContentSchema = z.object({
  type: z.literal('doc'),
  content: z.array(tiptapNodeSchema),
});

export const basicChoiceSchema = z.object({
  id: z.string().min(1, 'Choice id is required'),
  title: z.string().min(1, 'Choice title is required'),
  color: z.string().min(1, 'Choice color is required'),
  description: z.string().optional(),
  link: z.string().optional(),
});

export const detailedChoiceSchema = z.object({
  id: z.string().min(1, 'Choice id is required'),
  title: z.string().min(1, 'Choice title is required'),
  color: z.string().min(1, 'Choice color is required'),
  description: tiptapContentSchema,
  link: z.string().optional(),
});

export const pollMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  pollLink: z.string().optional(),
  description: z.string().optional(),
  answerType: z.string().min(1, 'Answer type is required'),
  requestComment: z.boolean(),
});

export const contestMetadataSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: tiptapContentSchema,
  link: z.string().optional(),
  answerType: z.string().min(1, 'Answer type is required'),
  requestComment: z.boolean(),
});
