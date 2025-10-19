#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the episodes file
const episodesPath = path.join(__dirname, '..', 'content', 'expansion', 'episodes.json');
const episodesData = JSON.parse(fs.readFileSync(episodesPath, 'utf-8'));

// Approximate dates based on weekly releases starting May 2024
// The show ran from early 2024 for about 6 months
const startDate = new Date('2024-05-07'); // Starting in early May 2024

// Add dates to episodes
episodesData.episodes = episodesData.episodes.map((episode, index) => {
    // Calculate date for each episode (assuming weekly releases)
    const episodeDate = new Date(startDate);
    episodeDate.setDate(startDate.getDate() + (index * 7)); // Weekly releases

    // Format date as YYYY-MM-DD
    const formattedDate = episodeDate.toISOString().split('T')[0];

    // Format display date as "May 7, 2024"
    const displayDate = episodeDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return {
        ...episode,
        publishDate: formattedDate,
        displayDate: displayDate
    };
});

// Update metadata
episodesData.metadata.lastUpdated = new Date().toISOString();

// Write back to file
fs.writeFileSync(episodesPath, JSON.stringify(episodesData, null, 2));

console.log('✅ Added dates to all episodes');
console.log(`📅 Episodes range from ${episodesData.episodes[0].displayDate} to ${episodesData.episodes[episodesData.episodes.length - 1].displayDate}`);

// Note: These are estimated dates based on weekly releases
console.log('\n⚠️  Note: These are estimated dates assuming weekly releases.');
console.log('   To get accurate dates, you would need to use YouTube Data API or manually update them.');