import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// New photos with their categories based on visual review
const newPhotos = [
  {
    filename: "2018-12-03 Kauai USA.jpeg",
    title: "Na Pali Coast, USA",
    location: "Kauai, USA",
    alt: "Dramatic green cliffs of the Na Pali Coast with sailboat on turquoise ocean",
    categories: ["all", "landscapes"],
    featured: false
  },
  {
    filename: "2019-03-31 Big Blue Hole Belize.jpeg",
    title: "Great Blue Hole, Belize",
    location: "Great Blue Hole, Belize",
    alt: "Aerial view of the Great Blue Hole surrounded by turquoise reef",
    categories: ["all", "nature"],
    featured: false
  },
  {
    filename: "2019-04-14 Kilauea USA.jpeg",
    title: "Kilauea Volcano, USA",
    location: "Kilauea, USA",
    alt: "Aerial view of Kilauea volcano crater with steam rising",
    categories: ["all", "nature", "landscapes"],
    featured: false
  },
  {
    filename: "2019-08-07 Bordeaux France.jpeg",
    title: "Bordeaux Vineyard, France",
    location: "Bordeaux, France",
    alt: "Stone gate entrance to French vineyard with rows of grapevines",
    categories: ["all", "nature"],
    featured: false
  },
  {
    filename: "2020-02-11 New York City USA.jpeg",
    title: "New York City, USA",
    location: "New York City, USA",
    alt: "New York City skyline view from bridge at sunset",
    categories: ["all", "cities"],
    featured: false
  },
  {
    filename: "2020-03-14 Cabo San Lucas Mexico.jpeg",
    title: "Mako Shark, Mexico",
    location: "Cabo San Lucas, Mexico",
    alt: "Mako shark swimming underwater in clear blue ocean",
    categories: ["all", "animals"],
    featured: false
  },
  {
    filename: "2021-01-31 Grand Staircase Utah.jpeg",
    title: "Grand Staircase, USA",
    location: "Grand Staircase-Escalante, USA",
    alt: "Snowy red rock canyon landscape in Utah",
    categories: ["all", "landscapes"],
    featured: false
  },
  {
    filename: "2021-04-26 Dubai UAE.jpeg",
    title: "Dubai Desert, UAE",
    location: "Dubai, UAE",
    alt: "Sand dunes in Dubai desert at sunset",
    categories: ["all", "landscapes"],
    featured: false
  },
  {
    filename: "2021-10-28 Hawaii USA.jpeg",
    title: "Manta Ray, USA",
    location: "Hawaii, USA",
    alt: "Manta ray swimming underwater with small fish",
    categories: ["all", "animals"],
    featured: false
  },
  {
    filename: "2021-12-21 Zermatt Switzerland.jpeg",
    title: "Matterhorn, Switzerland",
    location: "Zermatt, Switzerland",
    alt: "The iconic Matterhorn peak covered in snow",
    categories: ["all", "landscapes"],
    featured: true
  },
  {
    filename: "2022-06-04 Los Angeles CA.jpeg",
    title: "Misty Mountains, USA",
    location: "Los Angeles, USA",
    alt: "Layered misty blue mountains at sunrise",
    categories: ["all", "landscapes"],
    featured: false
  },
  {
    filename: "2022-08-23 Tenorio Volcano Costa Rica.jpeg",
    title: "Rio Celeste, Costa Rica",
    location: "Tenorio Volcano, Costa Rica",
    alt: "Rio Celeste waterfall with bright turquoise water in jungle",
    categories: ["all", "nature"],
    featured: false
  },
  {
    filename: "2022-08-25 Costa Rica.png",
    title: "School of Fish, Costa Rica",
    location: "Costa Rica",
    alt: "Large school of fish swimming underwater",
    categories: ["all", "animals"],
    featured: false
  },
  {
    filename: "2023-05-25 Lake Maggiore Switzerland.jpeg",
    title: "Lake Maggiore, Switzerland",
    location: "Lake Maggiore, Switzerland",
    alt: "Fishing boat on Lake Maggiore with green mountains",
    categories: ["all", "landscapes"],
    featured: false
  },
  {
    filename: "2023-05-26 Lake Maggiore Switzerland.jpeg",
    title: "Lake Maggiore Panorama, Switzerland",
    location: "Lake Maggiore, Switzerland",
    alt: "Panoramic view of Lake Maggiore from mountain summit",
    categories: ["all", "landscapes"],
    featured: true
  },
  {
    filename: "2023-06-21 Mount Rainier USA.jpeg",
    title: "Mount Rainier, USA",
    location: "Mount Rainier, USA",
    alt: "Mount Rainier peak rising above the clouds",
    categories: ["all", "landscapes"],
    featured: false
  },
  {
    filename: "2023-06-22 Grand Teton USA.jpeg",
    title: "Grand Teton, USA",
    location: "Grand Teton, USA",
    alt: "Panoramic view of the Grand Teton mountain range",
    categories: ["all", "landscapes"],
    featured: false
  },
  {
    filename: "2023-12-15 Victoria Falls Zimbabwe.jpeg",
    title: "Victoria Falls, Zimbabwe",
    location: "Victoria Falls, Zimbabwe",
    alt: "Victoria Falls with rainbow and mist",
    categories: ["all", "nature", "landscapes"],
    featured: true
  },
  {
    filename: "2023-12-18 Chobe National Park Botswana.jpeg",
    title: "Elephants at Sunset, Botswana",
    location: "Chobe National Park, Botswana",
    alt: "Elephant herd crossing river at sunset",
    categories: ["all", "animals"],
    featured: false
  },
  {
    filename: "2023-12-19 Chobe National Park Botswana.jpeg",
    title: "Lioness, Botswana",
    location: "Chobe National Park, Botswana",
    alt: "Lioness yawning in the grass",
    categories: ["all", "animals"],
    featured: false
  },
  {
    filename: "2023-12-20 Chobe National Park Botswana.jpeg",
    title: "Lion, Botswana",
    location: "Chobe National Park, Botswana",
    alt: "Male lion walking in golden light",
    categories: ["all", "animals"],
    featured: false
  },
  {
    filename: "2023-12-23 Maurituis.jpeg",
    title: "Le Morne, Mauritius",
    location: "Le Morne, Mauritius",
    alt: "Aerial view of Le Morne peninsula with underwater waterfall illusion",
    categories: ["all", "landscapes"],
    featured: false
  },
  {
    filename: "2024-06-20 Bora Bora.png",
    title: "Eagle Rays, French Polynesia",
    location: "Bora Bora, French Polynesia",
    alt: "School of eagle rays swimming over sandy ocean floor",
    categories: ["all", "animals"],
    featured: false
  },
  {
    filename: "2024-06-22 Moorea.png",
    title: "Sea Turtle, French Polynesia",
    location: "Moorea, French Polynesia",
    alt: "Green sea turtle swimming with diver in clear blue water",
    categories: ["all", "animals"],
    featured: false
  },
  {
    filename: "2024-10-11 Los Angeles CA.jpeg",
    title: "Los Angeles, USA",
    location: "Los Angeles, USA",
    alt: "Aerial view of downtown Los Angeles at sunset with mountains",
    categories: ["all", "cities"],
    featured: false
  },
  {
    filename: "2024-10-16 Lake Como Italy.jpeg",
    title: "Varenna, Italy",
    location: "Lake Como, Italy",
    alt: "Colorful Varenna village on Lake Como with misty mountains",
    categories: ["all", "cities"],
    featured: false
  }
];

// Photo dimensions from thumbnail generation
const dimensions = {
  "2018-12-03 Kauai USA.jpeg": { width: 3972, height: 2316 },
  "2019-03-31 Big Blue Hole Belize.jpeg": { width: 3840, height: 2160 },
  "2019-04-14 Kilauea USA.jpeg": { width: 4032, height: 3024 },
  "2019-08-07 Bordeaux France.jpeg": { width: 3938, height: 2955 },
  "2020-02-11 New York City USA.jpeg": { width: 4032, height: 3024 },
  "2020-03-14 Cabo San Lucas Mexico.jpeg": { width: 3313, height: 2485 },
  "2021-01-31 Grand Staircase Utah.jpeg": { width: 2572, height: 2034 },
  "2021-04-26 Dubai UAE.jpeg": { width: 8038, height: 3760 },
  "2021-10-28 Hawaii USA.jpeg": { width: 4000, height: 3000 },
  "2021-12-21 Zermatt Switzerland.jpeg": { width: 2700, height: 2160 },
  "2022-06-04 Los Angeles CA.jpeg": { width: 3840, height: 2160 },
  "2022-08-23 Tenorio Volcano Costa Rica.jpeg": { width: 6062, height: 3916 },
  "2022-08-25 Costa Rica.png": { width: 3840, height: 2160 },
  "2023-05-25 Lake Maggiore Switzerland.jpeg": { width: 3840, height: 2160 },
  "2023-05-26 Lake Maggiore Switzerland.jpeg": { width: 16346, height: 3800 },
  "2023-06-21 Mount Rainier USA.jpeg": { width: 3840, height: 2160 },
  "2023-06-22 Grand Teton USA.jpeg": { width: 9397, height: 3845 },
  "2023-12-15 Victoria Falls Zimbabwe.jpeg": { width: 10564, height: 3894 },
  "2023-12-18 Chobe National Park Botswana.jpeg": { width: 2630, height: 3507 },
  "2023-12-19 Chobe National Park Botswana.jpeg": { width: 3558, height: 2795 },
  "2023-12-20 Chobe National Park Botswana.jpeg": { width: 4032, height: 3024 },
  "2023-12-23 Maurituis.jpeg": { width: 3840, height: 2160 },
  "2024-06-20 Bora Bora.png": { width: 3400, height: 2151 },
  "2024-06-22 Moorea.png": { width: 4000, height: 2988 },
  "2024-10-11 Los Angeles CA.jpeg": { width: 4032, height: 3024 },
  "2024-10-16 Lake Como Italy.jpeg": { width: 5712, height: 4284 }
};

// Read existing photos
const photosPath = path.join(__dirname, '../content/photography/photos.json');
const existingPhotos = JSON.parse(fs.readFileSync(photosPath, 'utf-8'));

// Generate new photo entries
const newPhotoEntries = newPhotos.map(photo => {
  const baseName = photo.filename.replace(/\.(jpeg|jpg|png)$/i, '');
  const dateMatch = baseName.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : '';

  // URL encode the filename (replace spaces with %20)
  const urlEncodedName = baseName.replace(/ /g, '%20');
  const ext = photo.filename.match(/\.(jpeg|jpg|png)$/i)[0].toLowerCase();

  // Create ID from date and location
  const id = baseName.toLowerCase().replace(/\s+/g, '-');

  return {
    id,
    title: photo.title,
    location: photo.location,
    date,
    thumbnailUrl: `https://cdn.rexkirshner.com/photos/thumbnails/thumbnails_${urlEncodedName}-thumb.webp`,
    originalUrl: `https://cdn.rexkirshner.com/photos/display-size/${urlEncodedName}${ext}`,
    alt: photo.alt,
    width: dimensions[photo.filename].width,
    height: dimensions[photo.filename].height,
    featured: photo.featured,
    categories: photo.categories
  };
});

// Combine and sort by date (newest first)
const allPhotos = [...newPhotoEntries, ...existingPhotos].sort((a, b) => {
  return new Date(b.date) - new Date(a.date);
});

// Write updated photos.json
fs.writeFileSync(photosPath, JSON.stringify(allPhotos, null, 2));

console.log(`Added ${newPhotoEntries.length} new photos`);
console.log(`Total photos: ${allPhotos.length}`);
console.log(`\nFeatured photos: ${allPhotos.filter(p => p.featured).length}`);
console.log(`Animals category: ${allPhotos.filter(p => p.categories.includes('animals')).length}`);
console.log(`Landscapes category: ${allPhotos.filter(p => p.categories.includes('landscapes')).length}`);
console.log(`Cities category: ${allPhotos.filter(p => p.categories.includes('cities')).length}`);
console.log(`Nature category: ${allPhotos.filter(p => p.categories.includes('nature')).length}`);
