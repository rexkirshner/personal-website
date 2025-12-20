import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Featured photo filenames (need source files)
const featuredPhotos = [
  { id: '2023-12-15-victoria-falls-zimbabwe', filename: '2023-12-15 Victoria Falls Zimbabwe.jpeg' },
  { id: '2023-05-26-lake-maggiore-switzerland', filename: '2023-05-26 Lake Maggiore Switzerland.jpeg' },
  { id: '2021-12-21-zermatt-switzerland', filename: '2021-12-21 Zermatt Switzerland.jpeg' },
  { id: '2021-12-18-toledo-spain', filename: '2021-12-18 Toledo Spain.jpeg' },
  { id: '2020-01-06-jungfraujoch-switzerland', filename: '2020-01-06 Jungfraujoch Switzerland.jpeg' },
  { id: '2019-07-02-great-northern-mountain-usa', filename: '2019-07-02 Great Northern Mountain USA.jpeg' },
  { id: '2018-10-22-grand-prismatic-springs-usa', filename: '2018-10-22 Grand Prismatic Springs USA.jpeg' },
  { id: '2018-07-09-humantay-lake-peru', filename: '2018-07-09 Humantay Lake Peru.jpeg' }
];

const photosDir = path.join(__dirname, '../content export/photos');
const outputDir = path.join(__dirname, '../content export/photos-carousel');

async function generateCarouselImages() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generating carousel-optimized WebP images...\n');

  for (const photo of featuredPhotos) {
    const inputPath = path.join(photosDir, photo.filename);
    const outputFilename = photo.filename.replace(/\.(jpeg|jpg|png)$/i, '-carousel.webp');
    const outputPath = path.join(outputDir, outputFilename);

    if (!fs.existsSync(inputPath)) {
      console.log(`⚠ Source not found: ${photo.filename}`);
      console.log(`  Need to download from R2 or provide source file`);
      continue;
    }

    const metadata = await sharp(inputPath).metadata();

    // Resize to max 1920px wide, maintain aspect ratio
    await sharp(inputPath)
      .resize(1920, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const inputStats = fs.statSync(inputPath);
    const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

    console.log(`✓ ${photo.filename}`);
    console.log(`  Original: ${(inputStats.size / 1024 / 1024).toFixed(2)}MB → Carousel: ${(outputStats.size / 1024).toFixed(0)}KB (${savings}% smaller)`);
  }

  console.log(`\n✓ Carousel images saved to: ${outputDir}`);
  console.log('\nNext steps:');
  console.log('1. Upload carousel images to R2: cdn.rexkirshner.com/photos/carousel/');
  console.log('2. Run: node scripts/add-carousel-urls.js');
}

generateCarouselImages().catch(console.error);
