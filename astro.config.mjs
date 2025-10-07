// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
// If you're using React components, also add:
// import react from '@astrojs/react';

export default defineConfig({
  site: 'https://jebisson.github.io/EESAD',
  base: '/EESAD',
  integrations: [
    tailwind({ applyBaseStyles: true }),
    // react(),
  ],
});