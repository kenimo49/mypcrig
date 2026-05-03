import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    lang: z.enum(['ja', 'en']).default('ja'),
    category: z.enum([
      'ranking',
      'review',
      'guide',
      'benchmark',
      'comparison',
      'column',
    ]).default('guide'),
    section: z.enum([
      'laptop',
      'gaming',
      'ai-dev',
      'mac',
      'desktop',
      'parts',
      'column',
    ]).default('laptop'),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    canonical_url: z.string().url().optional(),
    cross_posted_to: z.array(z.object({
      platform: z.string(),
      url: z.string().url(),
    })).default([]),
    og_image: z.string().optional(),
    affiliate_disclosure: z.boolean().default(true),
  }),
});

export const collections = { blog };
