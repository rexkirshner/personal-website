#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CDN base URL
const CDN_BASE = 'https://cdn.rexkirshner.com';

// 1. Update photos.json
console.log('📸 Updating photos.json...');
const photosPath = path.join(__dirname, '..', 'content', 'photography', 'photos.json');
const photos = JSON.parse(fs.readFileSync(photosPath, 'utf-8'));

const updatedPhotos = photos.map(photo => {
  // Extract filename from current URL
  const filename = decodeURIComponent(photo.thumbnailUrl.split('/').pop());

  return {
    ...photo,
    thumbnailUrl: `${CDN_BASE}/photos/thumbnails/${filename}`,
    originalUrl: `${CDN_BASE}/photos/display-size/${filename}`
  };
});

fs.writeFileSync(photosPath, JSON.stringify(updatedPhotos, null, 2));
console.log(`✅ Updated ${updatedPhotos.length} photo URLs`);

// 2. Update episodes.json
console.log('\n🎙️ Updating episodes.json...');
const episodesPath = path.join(__dirname, '..', 'content', 'expansion', 'episodes.json');
const episodesData = JSON.parse(fs.readFileSync(episodesPath, 'utf-8'));

episodesData.episodes = episodesData.episodes.map(episode => {
  // Extract filename from current path (e.g., "/images/expansion/ep1-thumbnail.webp" -> "ep1-thumbnail.webp")
  const filename = episode.thumbnail.split('/').pop();

  return {
    ...episode,
    thumbnail: `${CDN_BASE}/podcasts/expansion/${filename}`
  };
});

// Update metadata
episodesData.metadata.lastUpdated = new Date().toISOString();
episodesData.metadata.thumbnailSource = 'CDN (cdn.rexkirshner.com)';

fs.writeFileSync(episodesPath, JSON.stringify(episodesData, null, 2));
console.log(`✅ Updated ${episodesData.episodes.length} episode thumbnail URLs`);

// 3. Update BaseLayout.astro preconnect
console.log('\n🔗 Updating BaseLayout.astro preconnect...');
const layoutPath = path.join(__dirname, '..', 'src', 'layouts', 'BaseLayout.astro');
let layoutContent = fs.readFileSync(layoutPath, 'utf-8');

// Replace old R2 preconnect with new CDN
layoutContent = layoutContent.replace(
  '<link rel="preconnect" href="https://pub-e0ec4ad25f664fab96989daac9d1a4cf.r2.dev" crossorigin />',
  '<link rel="preconnect" href="https://cdn.rexkirshner.com" crossorigin />'
);

fs.writeFileSync(layoutPath, layoutContent);
console.log('✅ Updated preconnect to cdn.rexkirshner.com');

console.log('\n📋 Summary:');
console.log('- Photos: Using cdn.rexkirshner.com/photos/');
console.log('- Expansion: Using cdn.rexkirshner.com/podcasts/expansion/');
console.log('- Banner & OG: Keeping local in /public/images/expansion/');
console.log('\n🎉 CDN migration complete!');