import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    title: z.string(), client: z.string().nullable(), industry: z.string(),
    description: z.string(), role: z.array(z.string()), technologies: z.array(z.string()),
    year: z.number().int().nullable(), period: z.string().optional(), url: z.url().nullable(),
    featured: z.boolean().default(false), confidential: z.boolean().default(false),
    anonymized: z.boolean().default(false), sample: z.boolean().default(true),
    published: z.boolean().default(false), order: z.number().default(99),
    locale: z.enum(['ja', 'en']).default('ja'),
  }).refine((data) => !(data.confidential || data.anonymized) || (data.client === null && data.url === null), { message: 'Confidential / anonymized works must omit client and URL. Use a safe public title, description and body.' }),
});
export const collections = { works };
