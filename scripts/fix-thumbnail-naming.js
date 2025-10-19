#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read photos.json
const photosPath = path.join(__dirname, '..', 'content', 'photography', 'photos.json');
const photos = JSON.parse(fs.readFileSync(photosPath, 'utf-8'));

// Fix thumbnail URLs to match CDN naming format
const fixedPhotos = photos.map(photo => {
  // Extract the base filename from the current URL
  // e.g., "2021-12-18%20Toledo%20Spain.jpeg" -> "2021-12-18%20Toledo%20Spain"
  const filename = photo.thumbnailUrl.split('/').pop().replace('.jpeg', '');

  // Decode %20 back to spaces for manipulation
  const decodedFilename = filename.replace(/%20/g, ' ');

  // Create the new thumbnail URL with the correct format
  // Format: thumbnails_[filename]-thumb.webp
  const newThumbnailName = `thumbnails_${decodedFilename}-thumb.webp`.replace(/ /g, '%20');

  return {
    ...photo,
    thumbnailUrl: `https://cdn.rexkirshner.com/photos/thumbnails/${newThumbnailName}`
    // Keep originalUrl as is - those are working
  };
});

// Write back to file
fs.writeFileSync(photosPath, JSON.stringify(fixedPhotos, null, 2));

console.log('✅ Fixed thumbnail naming for', fixedPhotos.length, 'photos');
console.log('📸 Updated format: thumbnails_[name]-thumb.webp');
console.log('Example: thumbnails_2021-12-18%20Toledo%20Spain-thumb.webp');