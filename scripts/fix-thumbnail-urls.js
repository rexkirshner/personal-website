import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photosPath = path.join(__dirname, '../content/photography/photos.json');
const photos = JSON.parse(fs.readFileSync(photosPath, 'utf-8'));

// New photos (uploaded without thumbnails_ prefix)
const newPhotoIds = new Set([
  '2018-12-03-kauai-usa',
  '2019-03-31-big-blue-hole-belize',
  '2019-04-14-kilauea-usa',
  '2019-08-07-bordeaux-france',
  '2020-02-11-new-york-city-usa',
  '2020-03-14-cabo-san-lucas-mexico',
  '2021-01-31-grand-staircase-utah',
  '2021-04-26-dubai-uae',
  '2021-10-28-hawaii-usa',
  '2021-12-21-zermatt-switzerland',
  '2022-06-04-los-angeles-ca',
  '2022-08-23-tenorio-volcano-costa-rica',
  '2022-08-25-costa-rica',
  '2023-05-25-lake-maggiore-switzerland',
  '2023-05-26-lake-maggiore-switzerland',
  '2023-06-21-mount-rainier-usa',
  '2023-06-22-grand-teton-usa',
  '2023-12-15-victoria-falls-zimbabwe',
  '2023-12-18-chobe-national-park-botswana',
  '2023-12-19-chobe-national-park-botswana',
  '2023-12-20-chobe-national-park-botswana',
  '2023-12-23-maurituis',
  '2024-06-20-bora-bora',
  '2024-06-22-moorea',
  '2024-10-11-los-angeles-ca',
  '2024-10-16-lake-como-italy'
]);

// Old photos need thumbnails_ prefix, new photos don't
photos.forEach(photo => {
  const isNewPhoto = newPhotoIds.has(photo.id);
  const hasPrefix = photo.thumbnailUrl.includes('/thumbnails/thumbnails_');

  if (isNewPhoto && hasPrefix) {
    // New photo with prefix - remove it
    photo.thumbnailUrl = photo.thumbnailUrl.replace('/thumbnails/thumbnails_', '/thumbnails/');
    console.log('Removed prefix:', photo.id);
  } else if (!isNewPhoto && !hasPrefix) {
    // Old photo without prefix - add it back
    photo.thumbnailUrl = photo.thumbnailUrl.replace('/thumbnails/', '/thumbnails/thumbnails_');
    console.log('Added prefix:', photo.id);
  }
});

fs.writeFileSync(photosPath, JSON.stringify(photos, null, 2));
console.log('\nDone!');
