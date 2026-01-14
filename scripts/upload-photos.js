import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// Validate required environment variables
const requiredEnvVars = {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:');
  missingVars.forEach((v) => console.error(`  - ${v}`));
  console.error('\nCreate a .env file with these variables. See .env.example for reference.');
  process.exit(1);
}

// Configure S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

// Parse filename to extract metadata
function parseFilename(filename) {
  // Format: "YYYY-MM-DD Location.jpeg"
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)\.(jpeg|jpg)$/i);
  if (!match) return null;

  const [, date, location, ext] = match;
  const id = filename.replace(/\.(jpeg|jpg)$/i, '').toLowerCase().replace(/\s+/g, '-');

  return {
    id,
    date,
    location,
    title: location,
  };
}

// Upload file to R2
async function uploadToR2(buffer, key, contentType) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `${R2_PUBLIC_URL}/${key}`;
}

// Process and upload a single photo
async function processPhoto(photoPath, filename) {
  console.log(`Processing ${filename}...`);

  const metadata = parseFilename(filename);
  if (!metadata) {
    console.warn(`Skipping ${filename} - invalid format`);
    return null;
  }

  // Read original image
  const imageBuffer = fs.readFileSync(photoPath);
  const image = sharp(imageBuffer);
  const imageMetadata = await image.metadata();

  // Generate WebP thumbnail (800px wide, maintain aspect ratio)
  const thumbnailBuffer = await image
    .resize(800, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  // Upload original
  const originalKey = `originals/${metadata.id}.jpg`;
  const originalUrl = await uploadToR2(imageBuffer, originalKey, 'image/jpeg');
  console.log(`  ✓ Uploaded original: ${originalUrl}`);

  // Upload thumbnail
  const thumbnailKey = `thumbnails/${metadata.id}-thumb.webp`;
  const thumbnailUrl = await uploadToR2(thumbnailBuffer, thumbnailKey, 'image/webp');
  console.log(`  ✓ Uploaded thumbnail: ${thumbnailUrl}`);

  return {
    id: metadata.id,
    title: metadata.title,
    location: metadata.location,
    date: metadata.date,
    thumbnailUrl,
    originalUrl,
    alt: `Photography from ${metadata.location}`,
    width: imageMetadata.width,
    height: imageMetadata.height,
  };
}

// Main function
async function main() {
  const photosDir = path.join(__dirname, '../content export/photos');
  const files = fs.readdirSync(photosDir)
    .filter(f => f.match(/\.(jpeg|jpg)$/i))
    .sort();

  console.log(`Found ${files.length} photos to process\n`);

  const photos = [];

  for (const file of files) {
    const photoPath = path.join(photosDir, file);
    const result = await processPhoto(photoPath, file);
    if (result) {
      photos.push(result);
    }
  }

  // Sort by date (newest first)
  photos.sort((a, b) => b.date.localeCompare(a.date));

  // Write to photos.json
  const outputPath = path.join(__dirname, '../content/photography/photos.json');
  fs.writeFileSync(outputPath, JSON.stringify(photos, null, 2));
  console.log(`\n✓ Wrote ${photos.length} photos to ${outputPath}`);
}

main().catch(console.error);
