// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL || 'https://desk-shivam-shukla.github.io';
const base = process.env.PUBLIC_BASE_PATH || '/the-emmys-salon/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: { ja: 'ja-JP', en: 'en-US' },
      },
    }),
  ],
});
