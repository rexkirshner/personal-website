#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videosJsonPath = path.join(__dirname, '..', 'content', 'videos', 'videos.json');
const outputDir = path.join(__dirname, '..', 'public', 'images', 'videos');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  const videosContent = fs.readFileSync(videosJsonPath, 'utf-8');
  const videos = JSON.parse(videosContent);

  console.log(`📥 Downloading ${videos.length} video thumbnails...`);

  for (const video of videos) {
    if (video.thumbnail && video.thumbnail.startsWith('http')) {
      const filename = `${video.id}.jpg`;
      const filepath = path.join(outputDir, filename);

      console.log(`  Downloading ${video.title}...`);

      try {
        await downloadImage(video.thumbnail, filepath);
        console.log(`    ✓ Saved to ${filename}`);
      } catch (error) {
        console.error(`    ✗ Failed: ${error.message}`);
      }
    }
  }

  console.log('\n✅ Download complete!');
  console.log('\nNext step: Update videos.json to use local paths:');
  console.log('Run: node scripts/update-video-thumbnails.js');
}

main();
