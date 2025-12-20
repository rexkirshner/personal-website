import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateThumbnails() {
  const photosDir = path.join(__dirname, '../content export/photos');
  const outputDir = path.join(__dirname, '../content export/photos-thumbnails');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(photosDir)
    .filter(f => f.match(/\.(jpeg|jpg|png)$/i))
    .sort();

  console.log(`Generating thumbnails for ${files.length} photos\n`);

  const photoData = [];

  for (const file of files) {
    console.log(`Processing ${file}...`);

    const inputPath = path.join(photosDir, file);
    const baseName = file.replace(/\.(jpeg|jpg|png)$/i, '');
    const outputFilename = `${baseName}-thumb.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();

    // Generate WebP thumbnail (400px wide, maintain aspect ratio)
    await sharp(inputPath)
      .resize(400, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    // Parse date and location from filename
    // Format: "2024-10-16 Lake Como Italy.jpeg"
    const match = baseName.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/);
    let date = '', location = '';
    if (match) {
      date = match[1];
      location = match[2];
    }

    photoData.push({
      filename: file,
      thumbnailFilename: outputFilename,
      date,
      location,
      width: metadata.width,
      height: metadata.height
    });

    console.log(`  ✓ Created ${outputFilename} (${metadata.width}x${metadata.height})`);
  }

  // Output JSON for reference
  console.log('\n--- Photo Data ---');
  console.log(JSON.stringify(photoData, null, 2));

  console.log(`\n✓ Generated ${files.length} thumbnails in ${outputDir}`);
}

generateThumbnails().catch(console.error);
