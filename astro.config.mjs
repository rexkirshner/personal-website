// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://rexkirshner.com',
  build: {
    // Use relative paths for assets to support IPFS deployment
    // This ensures CSS/JS work on both regular domains and IPFS gateways
    format: 'file'
  },
  integrations: [
    sitemap({
      customPages: [
        'https://logrex.eth.limo',
        'https://rexkirshner.eth.limo'
      ]
    }),
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