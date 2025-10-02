#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videosJsonPath = path.join(__dirname, '..', 'content', 'videos', 'videos.json');

async function main() {
  const videosContent = fs.readFileSync(videosJsonPath, 'utf-8');
  const videos = JSON.parse(videosContent);

  console.log(`📝 Updating ${videos.length} video thumbnail paths...`);

  const updated = videos.map(video => {
    if (video.thumbnail && video.thumbnail.startsWith('http')) {
      const newPath = `/images/videos/${video.id}.jpg`;
      console.log(`  ${video.title}: ${newPath}`);
      return {
        ...video,
        thumbnail: newPath
      };
    }
    return video;
  });

  fs.writeFileSync(videosJsonPath, JSON.stringify(updated, null, 2) + '\n');

  console.log('\n✅ videos.json updated!');
}

main();
