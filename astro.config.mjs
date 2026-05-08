// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkAffiliate } from './src/lib/remark-affiliate.mjs';

export default defineConfig({
  site: 'https://mypcrig.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkAffiliate],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
