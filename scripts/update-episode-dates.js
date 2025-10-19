#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read and parse the updated CSV with dates
const csvPath = '/Users/rexkirshner/Downloads/Expansion Episodes - Sheet1 (1).csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse dates from CSV
const lines = csvContent.split('\n').filter(line => line.trim());
const dates = [];

// Skip header and process each line
for (let i = 1; i < lines.length; i++) {
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
    values.push(current.trim());

    // Date is in the second column (index 1)
    const dateStr = values[1];
    if (dateStr) {
        // Parse the date without timezone adjustment
        const [year, month, day] = dateStr.split('-');
        const formattedDate = dateStr; // Keep as YYYY-MM-DD

        // Format display date properly
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const displayDate = `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;

        dates.push({
            publishDate: formattedDate,
            displayDate: displayDate
        });
    }
}

// Read the current episodes.json
const episodesPath = path.join(__dirname, '..', 'content', 'expansion', 'episodes.json');
const episodesData = JSON.parse(fs.readFileSync(episodesPath, 'utf-8'));

// Update each episode with the correct date
episodesData.episodes = episodesData.episodes.map((episode, index) => {
    if (index < dates.length) {
        return {
            ...episode,
            publishDate: dates[index].publishDate,
            displayDate: dates[index].displayDate
        };
    }
    return episode;
});

// Update metadata
episodesData.metadata.lastUpdated = new Date().toISOString();

// Write back to file
fs.writeFileSync(episodesPath, JSON.stringify(episodesData, null, 2));

console.log('✅ Updated all episode dates with correct values from CSV');
console.log(`📅 Date range: ${dates[0].displayDate} to ${dates[dates.length - 1].displayDate}`);
console.log(`📊 Total episodes updated: ${Math.min(episodesData.episodes.length, dates.length)}`);