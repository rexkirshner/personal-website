/**
 * Process Strava CSV export and generate stats.json
 *
 * CSV Structure (row 5 = header, data starts row 6):
 * Col 8: Year
 * Col 10: type (Run, AlpineSki, etc.)
 * Col 14: distance (mi)
 * Col 15: Location (city/place)
 * Col 16: State (for USA) or "0" for international
 * Col 17: Country (USA, Greece, or "Home - *" for home runs)
 * Col 18: DOM/INT/Home indicator
 * Col 19: Treadmill (TRUE/FALSE)
 * Col 20: Cumulative miles
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCSVLine(line) {
  const cols = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      cols.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  cols.push(current.trim());
  return cols;
}

function processStravaData(csvPath) {
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const lines = csv.split('\n');

  // Skip first 5 rows (headers), start at row 6 (index 5)
  const dataLines = lines.slice(5).filter(l => l.trim());

  const runs = [];
  let firstDate = null;
  let lastDate = null;

  for (const line of dataLines) {
    const cols = parseCSVLine(line);

    // Skip non-run activities
    const activityType = cols[10];
    if (activityType !== 'Run') continue;

    const year = cols[8];
    const distance = parseFloat(cols[14]);
    const location = cols[15] || '';
    const state = cols[16] || '';
    const country = cols[17] || '';
    const treadmill = cols[19] === 'TRUE';
    const dateStr = cols[5]; // Date column

    if (isNaN(distance) || distance <= 0) continue;

    // Track date range
    if (!firstDate) firstDate = dateStr;
    lastDate = dateStr;

    // Determine if home or travel
    const isHome = country.startsWith('Home -');
    const homeLocation = isHome ? country : null;

    // For travel, determine actual country
    let actualCountry = country;
    let actualState = state;
    if (isHome) {
      actualCountry = 'USA';
      actualState = null;
    }

    runs.push({
      year,
      distance,
      location,
      state: actualState,
      country: actualCountry,
      homeLocation,
      treadmill,
      isHome
    });
  }

  console.log(`Processed ${runs.length} runs`);

  // Calculate totals
  const totalMiles = runs.reduce((s, r) => s + r.distance, 0);
  const totalRuns = runs.length;
  const avgDistance = totalMiles / totalRuns;
  const longestRun = Math.max(...runs.map(r => r.distance));

  // Home vs Travel
  const homeMiles = runs.filter(r => r.isHome).reduce((s, r) => s + r.distance, 0);
  const travelMiles = runs.filter(r => !r.isHome).reduce((s, r) => s + r.distance, 0);

  // Outdoor vs Treadmill
  const outdoorMiles = runs.filter(r => !r.treadmill).reduce((s, r) => s + r.distance, 0);
  const treadmillMiles = runs.filter(r => r.treadmill).reduce((s, r) => s + r.distance, 0);

  // By Country (travel only)
  const byCountryMap = {};
  for (const run of runs.filter(r => !r.isHome)) {
    const country = run.country;
    byCountryMap[country] = (byCountryMap[country] || 0) + run.distance;
  }
  const byCountry = Object.entries(byCountryMap)
    .map(([country, miles]) => ({ country, miles: Math.round(miles * 100) / 100 }))
    .sort((a, b) => b.miles - a.miles);

  // By State (USA travel only)
  const byStateMap = {};
  for (const run of runs.filter(r => !r.isHome && r.country === 'USA' && r.state && r.state !== '0')) {
    byStateMap[run.state] = (byStateMap[run.state] || 0) + run.distance;
  }
  const byState = Object.entries(byStateMap)
    .map(([state, miles]) => ({ state, miles: Math.round(miles * 100) / 100 }))
    .sort((a, b) => b.miles - a.miles);

  // By Year
  const byYearMap = {};
  for (const run of runs) {
    byYearMap[run.year] = (byYearMap[run.year] || 0) + run.distance;
  }
  const byYear = Object.entries(byYearMap)
    .map(([year, miles]) => ({ year, miles: Math.round(miles * 100) / 100 }))
    .sort((a, b) => a.year.localeCompare(b.year));

  // By Home Location
  const byHomeMap = {};
  for (const run of runs.filter(r => r.isHome)) {
    byHomeMap[run.homeLocation] = (byHomeMap[run.homeLocation] || 0) + run.distance;
  }
  const homeLocations = Object.entries(byHomeMap)
    .map(([location, miles]) => ({ location, miles: Math.round(miles * 100) / 100 }))
    .sort((a, b) => b.miles - a.miles);

  // Count unique countries
  const uniqueCountries = new Set(runs.filter(r => !r.isHome).map(r => r.country));

  // Parse date strings to ISO format
  function parseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    let year = parts[2];
    if (year.length === 2) {
      year = parseInt(year) > 50 ? '19' + year : '20' + year;
    }
    return `${year}-${month}-${day}`;
  }

  const stats = {
    timePeriod: {
      start: parseDate(firstDate),
      end: parseDate(lastDate)
    },
    totals: {
      miles: Math.round(totalMiles * 100) / 100,
      runs: totalRuns,
      countries: uniqueCountries.size,
      avgDistance: Math.round(avgDistance * 100) / 100,
      longestRun: Math.round(longestRun * 100) / 100,
      homeMiles: Math.round(homeMiles * 100) / 100,
      travelMiles: Math.round(travelMiles * 100) / 100,
      outdoorMiles: Math.round(outdoorMiles * 100) / 100,
      treadmillMiles: Math.round(treadmillMiles * 100) / 100
    },
    byCountry,
    byState,
    byYear,
    homeLocations,
    stravaLinks: {
      profile: "https://www.strava.com/athletes/19943890",
      heatmap: "https://www.strava.com/athletes/19943890/heatmaps/embed"
    }
  };

  return stats;
}

// Main
const csvPath = process.argv[2] || '/Users/rexkirshner/Desktop/Strava Master.csv';
const outputPath = path.join(__dirname, '../content/running/stats.json');

console.log('Processing Strava CSV:', csvPath);
const stats = processStravaData(csvPath);

console.log('\nSummary:');
console.log(`- Total runs: ${stats.totals.runs}`);
console.log(`- Total miles: ${stats.totals.miles}`);
console.log(`- Countries: ${stats.totals.countries}`);
console.log(`- Date range: ${stats.timePeriod.start} to ${stats.timePeriod.end}`);
console.log(`- Home miles: ${stats.totals.homeMiles}`);
console.log(`- Travel miles: ${stats.totals.travelMiles}`);
console.log(`- Years: ${stats.byYear.map(y => y.year).join(', ')}`);

fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));
console.log(`\nWritten to: ${outputPath}`);
