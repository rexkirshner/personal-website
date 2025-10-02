/*
 * TRAVEL MAP DATA UPDATE WORKFLOW
 *
 * When you add new trips to TravelersPoint:
 * 1. Export KML from TravelersPoint
 * 2. Save to: /content export/travel map/trips958306 (1).kml
 * 3. Run: npm run update-travel-map
 * 4. Review the console output for changes
 * 5. Rebuild site: npm run build
 *
 * The script will:
 * - Parse all placemarks and paths
 * - Generate great-circle arcs for flight paths
 * - Simplify paths for performance
 * - Output to /content/travel/map-data.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DOMParser } from '@xmldom/xmldom';
import toGeoJSON from '@mapbox/togeojson';
import * as turf from '@turf/turf';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verbose = process.argv.includes('--verbose');

function log(message) {
  console.log(`✓ ${message}`);
}

function parseTravelData() {
  // Read KML file
  const kmlPath = path.join(__dirname, '../content export/travel map/trips958306 (1).kml');

  if (!fs.existsSync(kmlPath)) {
    console.error('❌ KML file not found at:', kmlPath);
    process.exit(1);
  }

  log('Parsing KML file...');
  const kmlContent = fs.readFileSync(kmlPath, 'utf-8');

  // Parse KML to GeoJSON
  const kml = new DOMParser().parseFromString(kmlContent);
  const geoJson = toGeoJSON.kml(kml);

  const locations = [];
  const paths = [];
  const countries = new Set();
  let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;

  // Process features
  geoJson.features.forEach(feature => {
    if (feature.geometry.type === 'Point') {
      // Extract location data
      const [lng, lat] = feature.geometry.coordinates;
      const name = feature.properties.name || '';
      const description = feature.properties.description || '';

      // Extract date from description (format: DDMmmYYYY)
      const dateMatch = description.match(/(\d{2})([A-Za-z]{3})(\d{4})/);
      let date = null;
      let year = null;

      if (dateMatch) {
        const day = dateMatch[1];
        const month = dateMatch[2];
        const yearStr = dateMatch[3];
        const monthMap = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
          'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
          'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };
        date = `${yearStr}-${monthMap[month]}-${day}`;
        year = parseInt(yearStr);
      }

      // Extract country from name (last part after comma)
      const parts = name.split(',').map(p => p.trim());
      const country = parts[parts.length - 1] || 'Unknown';
      countries.add(country);

      locations.push({
        id: feature.id || `loc_${locations.length}`,
        name: name.trim(),
        lat,
        lng,
        date,
        year,
        country
      });

      // Update bbox
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    } else if (feature.geometry.type === 'LineString') {
      // Store raw path coordinates (these are the curved arcs from the KML)
      let coords = feature.geometry.coordinates.map(([lng, lat]) => [lng, lat]);

      // Handle antimeridian crossing: split paths that cross the date line
      const segments = [];
      let currentSegment = [coords[0]];

      for (let i = 1; i < coords.length; i++) {
        const prev = coords[i - 1];
        const curr = coords[i];
        const prevLng = prev[0];
        const currLng = curr[0];

        // Check if we're crossing the antimeridian (jump > 180°)
        if (Math.abs(currLng - prevLng) > 180) {
          // Calculate interpolated point at the antimeridian
          const prevLat = prev[1];
          const currLat = curr[1];

          // Determine which direction we're crossing
          const crossingLng = prevLng > 0 ? 180 : -180;
          const nextStartLng = prevLng > 0 ? -180 : 180;

          // Linear interpolation for latitude at the crossing point
          // Find the fraction of the way between points where we cross
          const fraction = Math.abs((crossingLng - prevLng) / (currLng - prevLng + (prevLng > 0 ? 360 : -360)));
          const crossingLat = prevLat + fraction * (currLat - prevLat);

          // Add interpolated point to end current segment
          currentSegment.push([crossingLng, crossingLat]);
          segments.push(currentSegment);

          // Start new segment with interpolated point at opposite side
          currentSegment = [[nextStartLng, crossingLat], curr];
        } else {
          currentSegment.push(curr);
        }
      }

      // Add the final segment
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
      }

      // Process each segment (simplify and add to paths)
      segments.forEach(segment => {
        if (segment.length < 2) return; // Skip single-point segments

        const line = turf.lineString(segment);
        const simplified = turf.simplify(line, { tolerance: 0.01, highQuality: false });

        paths.push({
          coords: simplified.geometry.coordinates
        });
      });
    }
  });

  log(`Found ${locations.length} locations`);
  log(`Found ${paths.length} flight paths`);
  log(`Countries visited: ${countries.size}`);

  // Sort locations by date
  locations.sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  // Build final data structure
  const mapData = {
    metadata: {
      totalLocations: locations.length,
      countries: countries.size,
      lastUpdated: new Date().toISOString(),
      dateRange: {
        start: locations[0]?.date || null,
        end: locations[locations.length - 1]?.date || null
      }
    },
    bbox: [minLng, minLat, maxLng, maxLat],
    defaultZoom: 2,
    defaultCenter: [(minLng + maxLng) / 2, (minLat + maxLat) / 2],
    attribution: 'Map data © OpenStreetMap contributors',
    locations,
    paths
  };

  // Write output
  const outputPath = path.join(__dirname, '../content/travel/map-data.json');
  const outputDir = path.dirname(outputPath);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(mapData, null, 2));

  const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(0);

  log('Data written to /content/travel/map-data.json\n');

  console.log('Summary:');
  console.log(`- Total locations: ${locations.length}`);
  console.log(`- Countries: ${countries.size}`);
  console.log(`- Flight paths: ${paths.length}`);
  console.log(`- Date range: ${mapData.metadata.dateRange.start} to ${mapData.metadata.dateRange.end}`);
  console.log(`- File size: ${fileSize} KB`);

  if (verbose) {
    console.log('\nCountries visited:');
    Array.from(countries).sort().forEach(c => console.log(`  - ${c}`));
  }
}

parseTravelData();
