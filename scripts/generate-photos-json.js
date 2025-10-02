import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const R2_PUBLIC_URL = 'https://pub-e0ec4ad25f664fab96989daac9d1a4cf.r2.dev';

// Parse filename to extract metadata
function parseFilename(filename) {
  // Format: "YYYY-MM-DD Location Country.jpeg"
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)\.(jpeg|jpg)$/i);
  if (!match) return null;

  const [, date, locationRaw] = match;
  const id = filename.replace(/\.(jpeg|jpg)$/i, '').toLowerCase().replace(/\s+/g, '-');

  // Split location into city/location and country (last word is country)
  const locationParts = locationRaw.split(' ');
  let location = locationRaw;

  if (locationParts.length >= 2) {
    const country = locationParts[locationParts.length - 1];
    const cityLocation = locationParts.slice(0, -1).join(' ');
    location = `${cityLocation}, ${country}`;
  }

  return {
    id,
    date,
    location,
    title: location,
  };
}

// Process photos to get metadata
async function processPhotos() {
  const photosDir = path.join(__dirname, '../content export/photos');
  const files = fs.readdirSync(photosDir)
    .filter(f => f.match(/\.(jpeg|jpg)$/i))
    .sort();

  console.log(`Found ${files.length} photos\n`);

  const photos = [];

  for (const file of files) {
    console.log(`Processing ${file}...`);

    const metadata = parseFilename(file);
    if (!metadata) {
      console.warn(`  ✗ Skipping - invalid format`);
      continue;
    }

    // Get image dimensions
    const photoPath = path.join(photosDir, file);
    const image = sharp(photoPath);
    const imageMetadata = await image.metadata();

    // For now, use the original as both thumbnail and original
    // (we'll optimize thumbnails later)
    const photoUrl = `${R2_PUBLIC_URL}/${encodeURIComponent(file)}`;

    photos.push({
      id: metadata.id,
      title: metadata.title,
      location: metadata.location,
      date: metadata.date,
      thumbnailUrl: photoUrl,
      originalUrl: photoUrl,
      alt: `Photography from ${metadata.location}`,
      width: imageMetadata.width,
      height: imageMetadata.height,
    });

    console.log(`  ✓ Added ${metadata.location}`);
  }

  // Sort by date (newest first)
  photos.sort((a, b) => b.date.localeCompare(a.date));

  // Write to photos.json
  const outputPath = path.join(__dirname, '../content/photography/photos.json');
  fs.writeFileSync(outputPath, JSON.stringify(photos, null, 2));
  console.log(`\n✓ Wrote ${photos.length} photos to ${outputPath}`);
}

processPhotos().catch(console.error);
