import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.object({ ja: z.string(), en: z.string() }),
    date: z.coerce.date(),
    locale: z.enum(['ja', 'en']),
    excerpt: z.object({ ja: z.string(), en: z.string() }),
  }),
});

export const collections = { news };
