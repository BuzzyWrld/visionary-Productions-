// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// One repo, two hosts. Vercel sets the VERCEL env var during its build, so we
// use the Vercel adapter there (serverless output) and the Node standalone
// adapter everywhere else (Railway, local). Output stays static: only the
// contact endpoint renders on demand.
const onVercel = !!process.env.VERCEL;

export default defineConfig({
  site: 'https://visionaryproductions.nyc',
  output: 'static',
  adapter: onVercel ? vercel() : node({ mode: 'standalone' }),
  integrations: [sitemap()],
  // Services and pricing live on one page. Keep the old path working.
  redirects: {
    '/pricing': '/services',
  },
});
