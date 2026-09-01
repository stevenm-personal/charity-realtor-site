import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Eventual production domain. Configuring this now only affects generated
// URLs (canonical links, og:url, sitemap) - it does not change DNS, Cloudflare
// routing, or make the site indexable. See SEO.md for the launch checklist.
const PRODUCTION_SITE = 'https://charitymenefee.com';

// Pages that are permanently noindex and must not appear in the sitemap.
const SITEMAP_EXCLUDED_PATHS = ['/privacy/', '/disclaimer/', '/404', '/404/', '/404.html', '/social-preview/'];

export default defineConfig({
  output: 'static',
  site: PRODUCTION_SITE,
  integrations: [
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname;
        return !SITEMAP_EXCLUDED_PATHS.includes(path);
      },
    }),
  ],
});
