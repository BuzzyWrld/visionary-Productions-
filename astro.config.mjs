// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// Static first, hosted on Railway as a Node server. The standalone Node adapter
// builds an HTTP server (dist/server/entry.mjs) that serves the prerendered
// pages and runs the one on demand route (the contact endpoint).
export default defineConfig({
  site: 'https://visionaryproductions.nyc',
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [sitemap()],
  // Services and pricing now live on one page. Keep the old path working.
  redirects: {
    '/pricing': '/services',
  },
});
