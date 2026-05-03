import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    updated: z.date().optional(),
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

    // ランキング/レビュー型の追加メタデータ
    score: z.number().min(0).max(10).optional(),
    score_label: z.string().optional(),
    pros: z.array(z.string()).default([]),
    cons: z.array(z.string()).default([]),
    verdict: z.string().optional(),
    summary_specs: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).default([]),
    price_yen: z.number().optional(),
    purchase_url: z.string().url().optional(),
  }),
});

export const collections = { blog };
