import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL?.trim();

export default defineConfig({
  site: site || undefined,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
