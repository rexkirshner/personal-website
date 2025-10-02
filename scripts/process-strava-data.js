import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse CSV manually (skip first 4 rows, headers on row 5)
function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.split('\n');

  // Headers are on line 5 (index 4)
  const headers = lines[4].split(',');

  const data = [];
  for (let i = 5; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted values)
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

    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    data.push(row);
  }

  return data;
}

function processStravaData() {
  const csvPath = path.join(__dirname, '../content export/strava/Strava Master.csv');
  const data = parseCSV(csvPath);

  console.log(`Loaded ${data.length} rows from CSV`);

  // Filter for runs only
  const runs = data.filter(row => row.type === 'Run');
  console.log(`Filtered to ${runs.length} runs`);

  // Initialize aggregations
  const byCountry = {};
  const byState = {};
  const byYear = {};
  const homeLocations = {
    'Home - PP': 0,
    'Home - SM': 0,
    'Home - MDR': 0,
    'Home - Manhattan': 0
  };
  let travelMiles = 0;
  let outdoorMiles = 0;
  let treadmillMiles = 0;
  let totalMiles = 0;
  let longestRun = 0;

  // Process each run
  runs.forEach(run => {
    const miles = parseFloat(run['distance (mi)']) || 0;
    const country = run.Country || 'Unknown';
    const state = run.State || 'Unknown';
    const year = run.Year || 'Unknown';
    const location = run.International || run.Location || '';
    const isTreadmill = run.Treadmill === 'TRUE';

    totalMiles += miles;

    // Track longest run
    if (miles > longestRun) {
      longestRun = miles;
    }

    // By country (exclude home locations)
    if (!country.includes('Home -')) {
      byCountry[country] = (byCountry[country] || 0) + miles;
    }

    // By state (US only, exclude home locations)
    if (country === 'USA' && !state.includes('Home -')) {
      byState[state] = (byState[state] || 0) + miles;
    }

    // By year
    byYear[year] = (byYear[year] || 0) + miles;

    // Home vs travel
    if (location.includes('Home - PP')) {
      homeLocations['Home - PP'] += miles;
    } else if (location.includes('Home - SM')) {
      homeLocations['Home - SM'] += miles;
    } else if (location.includes('Home - MDR')) {
      homeLocations['Home - MDR'] += miles;
    } else if (location.includes('Home - Manhattan')) {
      homeLocations['Home - Manhattan'] += miles;
    } else {
      travelMiles += miles;
    }

    // Outdoor vs treadmill
    if (isTreadmill) {
      treadmillMiles += miles;
    } else {
      outdoorMiles += miles;
    }
  });

  // Calculate home total
  const homeMiles = Object.values(homeLocations).reduce((sum, miles) => sum + miles, 0);

  // Sort and format data
  const countriesArray = Object.entries(byCountry)
    .map(([country, miles]) => ({ country, miles: Math.round(miles * 100) / 100 }))
    .sort((a, b) => b.miles - a.miles);

  const statesArray = Object.entries(byState)
    .map(([state, miles]) => ({ state, miles: Math.round(miles * 100) / 100 }))
    .sort((a, b) => b.miles - a.miles);

  const yearsArray = Object.entries(byYear)
    .map(([year, miles]) => ({ year, miles: Math.round(miles * 100) / 100 }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));

  const homeLocationsArray = Object.entries(homeLocations)
    .map(([location, miles]) => ({ location, miles: Math.round(miles * 100) / 100 }))
    .filter(item => item.miles > 0)
    .sort((a, b) => b.miles - a.miles);

  // Build final stats object
  const stats = {
    timePeriod: {
      start: "2016-11-01",
      end: new Date().toISOString().split('T')[0]
    },
    totals: {
      miles: Math.round(totalMiles * 100) / 100,
      runs: runs.length,
      countries: Object.keys(byCountry).length,
      avgDistance: Math.round((totalMiles / runs.length) * 100) / 100,
      longestRun: Math.round(longestRun * 100) / 100,
      homeMiles: Math.round(homeMiles * 100) / 100,
      travelMiles: Math.round(travelMiles * 100) / 100,
      outdoorMiles: Math.round(outdoorMiles * 100) / 100,
      treadmillMiles: Math.round(treadmillMiles * 100) / 100
    },
    byCountry: countriesArray,
    byState: statesArray,
    byYear: yearsArray,
    homeLocations: homeLocationsArray,
    stravaLinks: {
      profile: "https://www.strava.com/athletes/19943890",
      heatmap: "https://www.strava.com/athletes/19943890/heatmaps/embed"
    }
  };

  // Write to stats.json
  const outputPath = path.join(__dirname, '../content/running/stats.json');
  fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));

  console.log(`\n✓ Processed ${runs.length} runs`);
  console.log(`✓ Total miles: ${stats.totals.miles.toLocaleString()}`);
  console.log(`✓ Countries: ${stats.totals.countries}`);
  console.log(`✓ Home miles: ${stats.totals.homeMiles.toLocaleString()}`);
  console.log(`✓ Travel miles: ${stats.totals.travelMiles.toLocaleString()}`);
  console.log(`✓ Outdoor: ${stats.totals.outdoorMiles.toLocaleString()} | Treadmill: ${stats.totals.treadmillMiles.toLocaleString()}`);
  console.log(`\n✓ Stats written to ${outputPath}`);
}

processStravaData();
