import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const R2_PUBLIC_URL = 'https://pub-e0ec4ad25f664fab96989daac9d1a4cf.r2.dev';

// Update photos.json with thumbnail URLs
function updatePhotosJson() {
  const photosJsonPath = path.join(__dirname, '../content/photography/photos.json');
  const photos = JSON.parse(fs.readFileSync(photosJsonPath, 'utf-8'));

  console.log(`Updating ${photos.length} photos with thumbnail URLs\n`);

  const updatedPhotos = photos.map(photo => {
    // Extract the filename from the original URL
    const originalFilename = decodeURIComponent(photo.originalUrl.split('/').pop());

    // Create thumbnail filename: remove .jpeg/.jpg and add -thumb.webp
    const thumbnailFilename = originalFilename.replace(/\.(jpeg|jpg)$/i, '-thumb.webp');

    // Create thumbnail URL with thumbnails/ prefix
    const thumbnailUrl = `${R2_PUBLIC_URL}/thumbnails/${encodeURIComponent(thumbnailFilename)}`;

    console.log(`${photo.location}: ${thumbnailFilename}`);

    return {
      ...photo,
      thumbnailUrl,
    };
  });

  // Write updated photos.json
  fs.writeFileSync(photosJsonPath, JSON.stringify(updatedPhotos, null, 2));
  console.log(`\n✓ Updated ${updatedPhotos.length} photos in ${photosJsonPath}`);
}

updatePhotosJson();
