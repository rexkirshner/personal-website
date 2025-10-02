import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define featured photos (wide aspect ratios good for carousel)
const featuredIds = [
  '2020-01-06-jungfraujoch-switzerland',
  '2018-10-22-grand-prismatic-springs-usa',
  '2021-12-18-toledo-spain',
  '2018-07-09-humantay-lake-peru',
  '2019-07-02-great-northern-mountain-usa'
];

// Categorize by location keywords
function categorizePhoto(location) {
  const categories = ['all'];
  const loc = location.toLowerCase();

  // Landscapes (mountains, panoramic views)
  if (loc.includes('mountain') || loc.includes('springs') ||
      loc.includes('switzerland') || loc.includes('peru')) {
    categories.push('landscapes');
  }

  // Cities
  if (loc.includes('london') || loc.includes('moscow') || loc.includes('cologne') ||
      loc.includes('seville') || loc.includes('toledo') || loc.includes('hong kong') ||
      loc.includes('new york') || loc.includes('dubai') || loc.includes('st louis')) {
    categories.push('cities');
  }

  // Underwater (none currently, but ready for future)
  if (loc.includes('underwater') || loc.includes('reef') || loc.includes('diving')) {
    categories.push('underwater');
  }

  // Nature (lakes, natural features, historic natural sites)
  if (loc.includes('lake') || loc.includes('bend') || loc.includes('kea') ||
      loc.includes('petra') || loc.includes('yazd') || loc.includes('portofino')) {
    categories.push('nature');
  }

  return categories;
}

function addMetadata() {
  const photosJsonPath = path.join(__dirname, '../content/photography/photos.json');
  const photos = JSON.parse(fs.readFileSync(photosJsonPath, 'utf-8'));

  console.log(`Adding metadata to ${photos.length} photos\n`);

  const updatedPhotos = photos.map(photo => {
    const featured = featuredIds.includes(photo.id);
    const categories = categorizePhoto(photo.location);

    console.log(`${photo.location}:`);
    console.log(`  Featured: ${featured}`);
    console.log(`  Categories: ${categories.join(', ')}`);

    return {
      ...photo,
      featured,
      categories,
    };
  });

  fs.writeFileSync(photosJsonPath, JSON.stringify(updatedPhotos, null, 2));
  console.log(`\n✓ Updated ${updatedPhotos.length} photos with metadata`);
  console.log(`\nFeatured photos: ${featuredIds.length}`);
  console.log(`Categories: landscapes, cities, underwater, nature, all`);
}

addMetadata();
