#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// R2 bucket base URL - UPDATE THIS WITH THE CORRECT FORMAT
const R2_BASE_URL = 'https://pub-e0f39303872630b8f70b0793db6069f7.r2.dev';

// Read episodes.json
const episodesPath = path.join(__dirname, '..', 'content', 'expansion', 'episodes.json');
const episodesData = JSON.parse(fs.readFileSync(episodesPath, 'utf-8'));

// Update thumbnail URLs
episodesData.episodes = episodesData.episodes.map(episode => {
  // Extract filename from current path
  const filename = episode.thumbnail.split('/').pop();

  return {
    ...episode,
    thumbnail: `${R2_BASE_URL}/${filename}`
  };
});

// Update metadata
episodesData.metadata.lastUpdated = new Date().toISOString();
episodesData.metadata.thumbnailSource = 'Cloudflare R2';

// Write updated episodes.json
fs.writeFileSync(episodesPath, JSON.stringify(episodesData, null, 2));

console.log('✅ Updated episodes.json with R2 URLs');
console.log(`📁 Base URL: ${R2_BASE_URL}`);
console.log(`📊 Total episodes updated: ${episodesData.episodes.length}`);

// Update meta.json for banner and OG image
const metaPath = path.join(__dirname, '..', 'content', 'expansion', 'meta.json');
const metaData = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

// Update OG image URL
metaData.ogImage = `${R2_BASE_URL}/og-image.jpg`;

// Write updated meta.json
fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2));

console.log('✅ Updated meta.json with R2 OG image URL');

// Update expansion.astro for banner image
const expansionPath = path.join(__dirname, '..', 'src', 'pages', 'expansion.astro');
let expansionContent = fs.readFileSync(expansionPath, 'utf-8');

// Replace banner image src
expansionContent = expansionContent.replace(
  'src="/images/expansion/expansion-banner.jpg"',
  `src="${R2_BASE_URL}/expansion-banner.jpg"`
);

// Write updated expansion.astro
fs.writeFileSync(expansionPath, expansionContent);

console.log('✅ Updated expansion.astro with R2 banner URL');
console.log('\n📝 Next steps:');
console.log('1. Test that all images load correctly from R2');
console.log('2. Remove local images from /public/images/expansion/');
console.log('3. Commit the changes');