import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photosPath = path.join(__dirname, '../content/photography/photos.json');
const photos = JSON.parse(fs.readFileSync(photosPath, 'utf-8'));

// Add carouselUrl to featured photos
photos.forEach(photo => {
  if (photo.featured) {
    // Extract base filename from originalUrl and create carousel URL
    const originalFilename = decodeURIComponent(photo.originalUrl.split('/').pop());
    const carouselFilename = originalFilename.replace(/\.(jpeg|jpg|png)$/i, '-carousel.webp');
    const encodedCarouselFilename = encodeURIComponent(carouselFilename).replace(/%20/g, '%20');

    photo.carouselUrl = `https://cdn.rexkirshner.com/photos/carousel/${carouselFilename.replace(/ /g, '%20')}`;
    console.log(`Added carouselUrl for: ${photo.id}`);
  }
});

fs.writeFileSync(photosPath, JSON.stringify(photos, null, 2));
console.log('\n✓ Updated photos.json with carouselUrl for featured photos');
