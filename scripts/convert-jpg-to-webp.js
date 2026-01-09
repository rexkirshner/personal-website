/**
 * Convert JPG images to WebP format
 *
 * This script converts all JPG files in public/images to WebP format
 * for better compression and performance. Original files are preserved
 * until manually deleted after verification.
 *
 * Usage: node scripts/convert-jpg-to-webp.js [--dry-run]
 *
 * Options:
 *   --dry-run  Show what would be converted without making changes
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRY_RUN = process.argv.includes('--dry-run');
const WEBP_QUALITY = 85;

/**
 * Recursively find all JPG files in a directory
 */
function findJpgFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findJpgFiles(fullPath, files);
    } else if (entry.name.match(/\.jpe?g$/i)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Convert a single JPG file to WebP
 */
async function convertToWebp(inputPath) {
  const outputPath = inputPath.replace(/\.jpe?g$/i, '.webp');
  const inputStats = fs.statSync(inputPath);
  const inputSize = inputStats.size;

  if (DRY_RUN) {
    console.log(`  Would convert: ${path.basename(inputPath)} (${formatSize(inputSize)})`);
    return { inputSize, outputSize: 0, saved: 0 };
  }

  await sharp(inputPath)
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  const outputStats = fs.statSync(outputPath);
  const outputSize = outputStats.size;
  const saved = inputSize - outputSize;
  const percent = ((saved / inputSize) * 100).toFixed(1);

  console.log(`  ✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
  console.log(`    ${formatSize(inputSize)} → ${formatSize(outputSize)} (saved ${percent}%)`);

  return { inputSize, outputSize, saved };
}

/**
 * Format bytes to human-readable size
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

/**
 * Main conversion function
 */
async function main() {
  const imagesDir = path.join(__dirname, '../public/images');

  console.log('JPG to WebP Converter');
  console.log('=====================');
  console.log(`Quality: ${WEBP_QUALITY}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`);
  console.log('');

  const jpgFiles = findJpgFiles(imagesDir);

  if (jpgFiles.length === 0) {
    console.log('No JPG files found in public/images/');
    return;
  }

  console.log(`Found ${jpgFiles.length} JPG files:\n`);

  let totalInput = 0;
  let totalOutput = 0;
  let totalSaved = 0;

  for (const file of jpgFiles) {
    const relativePath = path.relative(imagesDir, file);
    console.log(`Converting: ${relativePath}`);

    const { inputSize, outputSize, saved } = await convertToWebp(file);
    totalInput += inputSize;
    totalOutput += outputSize;
    totalSaved += saved;
  }

  console.log('\n=====================');
  console.log('Summary:');
  console.log(`  Files converted: ${jpgFiles.length}`);

  if (!DRY_RUN) {
    console.log(`  Total input:  ${formatSize(totalInput)}`);
    console.log(`  Total output: ${formatSize(totalOutput)}`);
    console.log(`  Total saved:  ${formatSize(totalSaved)} (${((totalSaved / totalInput) * 100).toFixed(1)}%)`);
    console.log('\nNext steps:');
    console.log('1. Update videos.json to use .webp extensions');
    console.log('2. Update any hardcoded .jpg references in Astro files');
    console.log('3. Run npm run build and verify');
    console.log('4. Delete original .jpg files after verification');
  }
}

main().catch(console.error);
