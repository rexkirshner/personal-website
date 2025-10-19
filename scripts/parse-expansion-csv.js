#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the CSV file
const csvPath = '/Users/rexkirshner/Downloads/Expansion Episodes - Sheet1.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Split into lines and parse
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',');

const episodes = [];

// Parse each episode line
for (let i = 1; i < lines.length; i++) {
    // Handle CSV with potential commas in values (basic parsing)
    const line = lines[i];
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let char of line) {
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim()); // Add the last value

    // Extract YouTube ID from URL
    const youtubeUrl = values[7] || '';
    const youtubeMatch = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    const youtubeId = youtubeMatch ? youtubeMatch[1] : '';

    // Build guests array
    const guests = [];
    if (values[1] && values[1].toLowerCase() !== 'roundup') {
        // Guest 1
        if (values[1]) {
            guests.push({
                name: values[1],
                social: values[2] || null
            });
        }
        // Guest 2
        if (values[3]) {
            guests.push({
                name: values[3],
                social: values[4] || null
            });
        }
        // Guest 3
        if (values[5]) {
            guests.push({
                name: values[5],
                social: values[6] || null
            });
        }
    }

    const episode = {
        id: `ep${i}`,
        number: i,
        title: values[0] || '',
        thumbnail: `/images/expansion/ep${i}-thumbnail.webp`,
        youtubeId: youtubeId,
        youtubeUrl: values[7] || '',
        appleUrl: values[8] || '',
        spotifyUrl: values[9] || '',
        guests: guests,
        isRoundup: values[1] && values[1].toLowerCase() === 'roundup'
    };

    episodes.push(episode);
}

// Create the final JSON structure
const episodesData = {
    episodes: episodes,
    metadata: {
        totalEpisodes: episodes.length,
        lastUpdated: new Date().toISOString(),
        description: "Rex Kirshner's appearances on the Expansion Podcast, exploring crypto's modular future, scaling solutions, and the evolution of blockchain technology."
    }
};

// Write to JSON file
const outputPath = path.join(__dirname, '..', 'content', 'expansion', 'episodes.json');
fs.writeFileSync(outputPath, JSON.stringify(episodesData, null, 2));

console.log(`✅ Successfully parsed ${episodes.length} episodes`);
console.log(`📁 Saved to: ${outputPath}`);

// Also create a YouTube IDs file for the thumbnail download script
const youtubeIds = episodes.map(ep => ({
    id: ep.id,
    youtubeId: ep.youtubeId,
    title: ep.title
})).filter(ep => ep.youtubeId);

const youtubeIdsPath = path.join(__dirname, '..', 'content', 'expansion', 'youtube-ids.json');
fs.writeFileSync(youtubeIdsPath, JSON.stringify(youtubeIds, null, 2));
console.log(`📁 YouTube IDs saved to: ${youtubeIdsPath}`);