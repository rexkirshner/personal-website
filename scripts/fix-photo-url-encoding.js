#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read photos.json
const photosPath = path.join(__dirname, '..', 'content', 'photography', 'photos.json');
const photos = JSON.parse(fs.readFileSync(photosPath, 'utf-8'));

// Fix URL encoding for spaces
const fixedPhotos = photos.map(photo => {
  return {
    ...photo,
    // Replace spaces with %20 in URLs
    thumbnailUrl: photo.thumbnailUrl.replace(/ /g, '%20'),
    originalUrl: photo.originalUrl.replace(/ /g, '%20')
  };
});

// Write back to file
fs.writeFileSync(photosPath, JSON.stringify(fixedPhotos, null, 2));

console.log('✅ Fixed URL encoding for', fixedPhotos.length, 'photos');
console.log('📸 Spaces replaced with %20 in all photo URLs');