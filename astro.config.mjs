// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';
import { remarkTwitterHandles } from './src/plugins/remark-twitter-handles.js';

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkTwitterHandles],
  },
  site: 'https://rexkirshner.com',
  build: {
    // Use relative paths for assets to support IPFS deployment
    // This ensures CSS/JS work on both regular domains and IPFS gateways
    format: 'file'
  },
  integrations: [
    sitemap(),
    partytown({
      config: {
        forward: ['dataLayer.push']
      }
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});