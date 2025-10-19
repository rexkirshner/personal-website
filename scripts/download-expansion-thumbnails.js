#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the YouTube IDs from the generated file
const youtubeIdsPath = path.join(__dirname, '..', 'content', 'expansion', 'youtube-ids.json');
const youtubeData = JSON.parse(fs.readFileSync(youtubeIdsPath, 'utf-8'));

// Create output directory
const outputDir = path.join(__dirname, '..', 'public', 'images', 'expansion');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// YouTube thumbnail URL patterns (in order of quality preference)
const thumbnailPatterns = [
    'https://img.youtube.com/vi/{id}/maxresdefault.jpg',   // 1280x720
    'https://img.youtube.com/vi/{id}/sddefault.jpg',       // 640x480
    'https://img.youtube.com/vi/{id}/hqdefault.jpg',       // 480x360
    'https://img.youtube.com/vi/{id}/mqdefault.jpg',       // 320x180
    'https://img.youtube.com/vi/{id}/default.jpg'          // 120x90
];

async function downloadImage(url) {
    try {
        const response = await fetch(url);
        if (response.ok) {
            const buffer = await response.arrayBuffer();
            return Buffer.from(buffer);
        }
    } catch (error) {
        console.error(`Failed to download from ${url}:`, error.message);
    }
    return null;
}

async function downloadThumbnail(episode) {
    console.log(`📥 Downloading thumbnail for episode ${episode.id}: ${episode.title}`);

    let imageBuffer = null;
    let successUrl = null;

    // Try each thumbnail pattern in order of quality
    for (const pattern of thumbnailPatterns) {
        const url = pattern.replace('{id}', episode.youtubeId);
        imageBuffer = await downloadImage(url);

        if (imageBuffer) {
            successUrl = url;
            console.log(`  ✅ Downloaded from: ${url.split('/').slice(-2).join('/')}`);
            break;
        }
    }

    if (!imageBuffer) {
        console.error(`  ❌ Failed to download thumbnail for episode ${episode.id}`);
        return false;
    }

    // Convert to WebP and save
    const outputPath = path.join(outputDir, `${episode.id}-thumbnail.webp`);

    try {
        await sharp(imageBuffer)
            .resize(1280, 720, {
                fit: 'cover',
                position: 'center'
            })
            .webp({ quality: 85 })
            .toFile(outputPath);

        console.log(`  💾 Saved as WebP: ${path.basename(outputPath)}`);
        return true;
    } catch (error) {
        console.error(`  ❌ Failed to process image for episode ${episode.id}:`, error.message);
        return false;
    }
}

async function downloadAllThumbnails() {
    console.log('🎬 Starting Expansion Podcast thumbnail download...');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`📊 Total episodes to process: ${youtubeData.length}`);
    console.log('');

    let successful = 0;
    let failed = 0;

    for (const episode of youtubeData) {
        if (!episode.youtubeId) {
            console.log(`⚠️ Skipping episode ${episode.id} (no YouTube ID)`);
            continue;
        }

        const success = await downloadThumbnail(episode);
        if (success) {
            successful++;
        } else {
            failed++;
        }

        // Add a small delay to be respectful to YouTube's servers
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('');
    console.log('✨ Download complete!');
    console.log(`  ✅ Successful: ${successful}`);
    if (failed > 0) {
        console.log(`  ❌ Failed: ${failed}`);
    }
}

// Run the download
downloadAllThumbnails().catch(console.error);