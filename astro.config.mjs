// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Static first, deployed on Vercel. The contact endpoint opts into on demand
// rendering with `export const prerender = false`; every other page is
// prerendered and served as a static asset.
export default defineConfig({
  site: 'https://visionaryproductions.nyc',
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  integrations: [sitemap()],
  // Services and pricing live on one page. Keep the old path working.
  redirects: {
    '/pricing': '/services',
  },
});
