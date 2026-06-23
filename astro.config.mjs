// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// Static first. The contact endpoint opts into on demand rendering with
// `export const prerender = false`, so we run on the Vercel adapter while
// every page stays pre rendered and fast.
export default defineConfig({
  site: 'https://visionaryproductions.nyc',
  output: 'static',
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
  integrations: [sitemap()],
  image: {
    // Allow the Astro image pipeline to optimize local photos to WebP.
    domains: [],
  },
});
