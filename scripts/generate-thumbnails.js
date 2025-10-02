import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Process photos to generate thumbnails
async function generateThumbnails() {
  const photosDir = path.join(__dirname, '../content export/photos');
  const outputDir = path.join(__dirname, '../content export/photos-thumbnails');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(photosDir)
    .filter(f => f.match(/\.(jpeg|jpg)$/i))
    .sort();

  console.log(`Generating thumbnails for ${files.length} photos\n`);

  for (const file of files) {
    console.log(`Processing ${file}...`);

    const inputPath = path.join(photosDir, file);
    const outputFilename = file.replace(/\.(jpeg|jpg)$/i, '-thumb.webp');
    const outputPath = path.join(outputDir, outputFilename);

    // Generate WebP thumbnail (400px wide, maintain aspect ratio)
    await sharp(inputPath)
      .resize(400, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    console.log(`  ✓ Created ${outputFilename}`);
  }

  console.log(`\n✓ Generated ${files.length} thumbnails in ${outputDir}`);
  console.log('\nNext steps:');
  console.log('1. Upload the thumbnails to R2 in a "thumbnails" folder');
  console.log('2. Run: npm run update-photos-json');
}

generateThumbnails().catch(console.error);
