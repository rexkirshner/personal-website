import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DEFAULT_API_BASE = 'https://autonomous-rex.tail9ecc15.ts.net/datasets/activity-data/v1';
const API_BASE = (process.env.ACTIVITY_DATA_API_BASE || DEFAULT_API_BASE).replace(/\/+$/, '');
const REQUEST_TIMEOUT_MS = 15000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, '../content/running/stats.json');
const tempOutputPath = `${outputPath}.tmp`;

const round2 = (value) => Math.round(value * 100) / 100;

async function fetchJson(pathname) {
  const url = `${API_BASE}${pathname}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms for ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }

  return response.json();
}

function miles(totals) {
  requireNumber(totals.distance_mi, 'totals.distance_mi');
  return round2(totals.distance_mi);
}

function requireGroup(groups, key, label) {
  const group = groups.find((item) => item.key === key);

  if (!group) {
    throw new Error(`Missing ${label} group: ${key}`);
  }

  return group;
}

function requireNumber(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Missing or invalid number: ${label}`);
  }
}

function requireDate(value, label) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Missing or invalid date: ${label}`);
  }
}

function requireSummary(response, label, { groups = false } = {}) {
  if (!response?.build?.dataset_fingerprint) {
    throw new Error(`Missing dataset fingerprint for ${label}`);
  }
  if (!response.totals) {
    throw new Error(`Missing totals for ${label}`);
  }

  requireNumber(response.totals.activity_count, `${label}.totals.activity_count`);
  requireNumber(response.totals.distance_mi, `${label}.totals.distance_mi`);
  requireDate(response.totals.start_date, `${label}.totals.start_date`);
  requireDate(response.totals.end_date, `${label}.totals.end_date`);
  requireNumber(response.totals.max_distance_mi, `${label}.totals.max_distance_mi`);

  if (groups && !Array.isArray(response.groups)) {
    throw new Error(`Missing groups for ${label}`);
  }
}

function formatSummaryGroup(group, keyName) {
  if (typeof group.key !== 'string' || !group.key.trim()) {
    throw new Error(`Missing group key for ${keyName}`);
  }

  return {
    [keyName]: group.key,
    miles: miles(group.totals),
  };
}

function assertClose(name, actual, expected, tolerance = 0.05) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${name} mismatch: ${actual} vs ${expected}`);
  }
}

function getExistingStravaLinks() {
  const fallback = {
    profile: 'https://www.strava.com/athletes/19943890',
    heatmap: 'https://www.strava.com/athletes/19943890/heatmaps/embed',
  };

  if (!fs.existsSync(outputPath)) {
    return fallback;
  }

  const existingStats = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
  return existingStats.stravaLinks || fallback;
}

async function main() {
  console.log(`Fetching running stats from ${API_BASE}`);

  const health = await fetchJson('/health');
  if (!health.ready || health.status !== 'ok') {
    throw new Error(`Activity data API is not ready: ${JSON.stringify(health)}`);
  }
  if (health.validation?.errors || health.validation?.warnings) {
    throw new Error(`Activity data validation is not clean: ${JSON.stringify(health.validation)}`);
  }

  const [
    totals,
    byYear,
    byCountry,
    byState,
    homeTravel,
    treadmill,
    homeLocations,
  ] = await Promise.all([
    fetchJson('/summary?sport_type=Run'),
    fetchJson('/summary?sport_type=Run&group_by=year'),
    fetchJson('/summary?sport_type=Run&home_match_status=travel&group_by=country'),
    fetchJson('/summary?sport_type=Run&home_match_status=travel&country=USA&group_by=admin_region'),
    fetchJson('/summary?sport_type=Run&group_by=home_match_status'),
    fetchJson('/summary?sport_type=Run&group_by=treadmill'),
    fetchJson('/summary?sport_type=Run&home_match_status=at_home&group_by=home_base'),
  ]);

  requireSummary(totals, 'total run summary');
  requireSummary(byYear, 'year summary', { groups: true });
  requireSummary(byCountry, 'country summary', { groups: true });
  requireSummary(byState, 'state summary', { groups: true });
  requireSummary(homeTravel, 'home/travel summary', { groups: true });
  requireSummary(treadmill, 'treadmill summary', { groups: true });
  requireSummary(homeLocations, 'home location summary', { groups: true });

  const fingerprints = new Set([
    totals.build?.dataset_fingerprint,
    byYear.build?.dataset_fingerprint,
    byCountry.build?.dataset_fingerprint,
    byState.build?.dataset_fingerprint,
    homeTravel.build?.dataset_fingerprint,
    treadmill.build?.dataset_fingerprint,
    homeLocations.build?.dataset_fingerprint,
  ]);

  if (fingerprints.size !== 1 || fingerprints.has(undefined)) {
    throw new Error(`Summary responses used different dataset fingerprints: ${Array.from(fingerprints).join(', ')}`);
  }

  const homeGroup = requireGroup(homeTravel.groups, 'at_home', 'home/travel');
  const travelGroup = requireGroup(homeTravel.groups, 'travel', 'home/travel');
  const outdoorGroup = requireGroup(treadmill.groups, 'false', 'treadmill');
  const treadmillGroup = requireGroup(treadmill.groups, 'true', 'treadmill');

  const totalMiles = miles(totals.totals);
  const homeMiles = miles(homeGroup.totals);
  const travelMiles = miles(travelGroup.totals);
  const outdoorMiles = miles(outdoorGroup.totals);
  const treadmillMiles = miles(treadmillGroup.totals);

  assertClose('Home + travel miles', homeMiles + travelMiles, totalMiles);
  assertClose('Outdoor + treadmill miles', outdoorMiles + treadmillMiles, totalMiles);

  const stats = {
    timePeriod: {
      start: totals.totals.start_date,
      end: totals.totals.end_date,
    },
    totals: {
      miles: totalMiles,
      runs: totals.totals.activity_count,
      countries: byCountry.groups.length,
      avgDistance: round2(totals.totals.distance_mi / totals.totals.activity_count),
      longestRun: round2(totals.totals.max_distance_mi),
      homeMiles,
      travelMiles,
      outdoorMiles,
      treadmillMiles,
    },
    byCountry: byCountry.groups
      .map((group) => formatSummaryGroup(group, 'country'))
      .sort((a, b) => b.miles - a.miles),
    byState: byState.groups
      .map((group) => formatSummaryGroup(group, 'state'))
      .sort((a, b) => b.miles - a.miles),
    byYear: byYear.groups
      .map((group) => formatSummaryGroup(group, 'year'))
      .sort((a, b) => a.year.localeCompare(b.year)),
    homeLocations: homeLocations.groups
      .map((group) => formatSummaryGroup(group, 'location'))
      .sort((a, b) => b.miles - a.miles),
    stravaLinks: getExistingStravaLinks(),
  };

  fs.writeFileSync(tempOutputPath, `${JSON.stringify(stats, null, 2)}\n`);
  fs.renameSync(tempOutputPath, outputPath);

  console.log(`Wrote ${outputPath}`);
  console.log(`Runs: ${stats.totals.runs.toLocaleString()}`);
  console.log(`Miles: ${stats.totals.miles.toLocaleString()}`);
  console.log(`Countries: ${stats.totals.countries}`);
  console.log(`Date range: ${stats.timePeriod.start} to ${stats.timePeriod.end}`);
}

main().catch((error) => {
  if (fs.existsSync(tempOutputPath)) {
    fs.unlinkSync(tempOutputPath);
  }

  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
