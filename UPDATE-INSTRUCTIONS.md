# Content Update Instructions

This guide explains how to update content on your personal website. All content is managed through JSON and Markdown files—no code changes required.

**After making any content changes, always run:**
```bash
npm run build
```
Then upload `/dist` to IPFS and update your ENS record with the new CID.

---

## Profile Pictures (Home/About Carousel)

**File:** `/content/site/profile-pics.json`

### Update existing photos:
1. Edit the JSON file directly
2. Change `src`, `srcset`, or `alt` text as needed

### Add new photos:
1. Place original image in a temporary location
2. Generate WebP versions at 3 sizes (400w, 600w, 800w):
   ```bash
   node -e "
   const sharp = require('sharp');
   sharp('your-photo.jpg').resize(400).webp({quality:85}).toFile('public/images/profile/your-photo-400w.webp');
   sharp('your-photo.jpg').resize(600).webp({quality:85}).toFile('public/images/profile/your-photo-600w.webp');
   sharp('your-photo.jpg').resize(800).webp({quality:85}).toFile('public/images/profile/your-photo-800w.webp');
   "
   ```
3. Add entry to `profile-pics.json`:
   ```json
   {
     "id": "profile-4",
     "src": "/images/profile/your-photo-800w.webp",
     "srcset": "/images/profile/your-photo-400w.webp 400w, /images/profile/your-photo-600w.webp 600w, /images/profile/your-photo-800w.webp 800w",
     "sizes": "(max-width: 768px) 100vw, 400px",
     "alt": "Rex Kirshner profile photo"
   }
   ```

### Remove photos:
Delete the entry from the JSON array.

---

## Home Section Bio

**File:** `/content/site/meta.json`

Edit the `description` field:
```json
{
  "description": "Your bio text here."
}
```

---

## Vimeo Videos (Creative Section)

**File:** `/content/videos/videos.json`

### Add a video:
1. Upload video to Vimeo and get the video ID (from URL)
2. Add thumbnail image to `/public/images/videos/`
3. Add entry to JSON:
   ```json
   {
     "id": "unique-id",
     "title": "Video Title",
     "year": 2024,
     "vimeoId": "123456789",
     "description": "Video description",
     "thumbnail": "/images/videos/thumbnail.jpg"
   }
   ```

### Update a video:
Edit the existing entry (change title, description, etc.)

### Remove a video:
Delete the entry from the JSON array.

### Reorder videos:
Change the order of entries in the array (top = first displayed).

---

## Photography Section

**File:** `/content/photography/photos.json`

### Add new photos (full workflow):
1. Place originals in temporary location
2. Generate WebP thumbnails:
   ```bash
   npm run generate-thumbnails
   ```
3. Upload to Cloudflare R2:
   ```bash
   npm run upload-photos
   ```
4. Update JSON with R2 URLs:
   ```bash
   npm run update-photos-json
   ```
5. (Optional) Add EXIF metadata:
   ```bash
   npm run add-photo-metadata
   ```
6. Move originals to `.archive/` folder
7. Rebuild: `npm run build`

### Quick updates (existing photos):
Edit `photos.json` directly to change:
- Title
- Location
- Date
- Order (rearrange array)

### Remove photos:
Delete the entry from the JSON array.

---

## Ethereum Projects

**File:** `/content/ethereum/projects.json`

### Add a project:
1. Add project cover image to `/public/images/ethereum/`
2. Add entry to JSON:
   ```json
   {
     "id": "project-slug",
     "title": "Project Name",
     "type": "Project Type",
     "description": "Project description",
     "link": "https://example.com",
     "image": "/images/ethereum/cover.webp"
   }
   ```

### Update a project:
Edit the existing entry (change title, description, link, image, etc.)

### Remove a project:
Delete the entry from the JSON array.

### Reorder projects:
Change the order of entries in the array.

---

## Running Section

### Stats and Numbers

**File:** `/content/running/stats.json`

Update any of these fields:
```json
{
  "timePeriod": "November 2016 - Present",
  "totals": {
    "miles": 5000,
    "countries": 50,
    "workMiles": 2500,
    "pleasureMiles": 2500
  },
  "byCountry": [
    {"country": "USA", "miles": 2000},
    {"country": "Japan", "miles": 150}
  ],
  "stravaLinks": {
    "profile": "https://strava.com/athletes/...",
    "heatmapEmbed": "https://..."
  }
}
```

### Running Narrative (Story Text)

**File:** `/content/running/narrative.md`

Edit this Markdown file directly. Format with standard Markdown:
- Paragraphs separated by blank lines
- **Bold** with `**text**`
- *Italic* with `*text*`

---

## Travel Map

**File:** `/content/travel/map-data.json`

### Update from KML:
1. Export updated KML file from Google My Maps
2. Place in `/content/travel/` directory
3. Run:
   ```bash
   npm run update-travel-map
   ```
4. Rebuild: `npm run build`

This automatically updates the map with new routes and locations.

---

## Site Metadata (SEO, Social Links, etc.)

**File:** `/content/site/meta.json`

Update any of these fields:
```json
{
  "title": "Your Name",
  "description": "Your bio/tagline",
  "author": "Your Name",
  "ogImage": "/images/og-image.jpg",
  "social": {
    "twitter": "https://twitter.com/...",
    "linkedin": "https://linkedin.com/in/...",
    "telegram": "https://t.me/...",
    "discord": "https://discord.gg/...",
    "email": "your@email.com"
  }
}
```

Changes here affect:
- Page title and meta description
- Open Graph tags (social sharing)
- Footer social links
- Contact section

---

## Quick Reference: All Content Files

| Content Type | File Path |
|--------------|-----------|
| Profile pics | `/content/site/profile-pics.json` |
| Site metadata | `/content/site/meta.json` |
| Ethereum projects | `/content/ethereum/projects.json` |
| Videos | `/content/videos/videos.json` |
| Photos | `/content/photography/photos.json` |
| Running stats | `/content/running/stats.json` |
| Running narrative | `/content/running/narrative.md` |
| Travel map | `/content/travel/map-data.json` |

---

## Deployment Checklist

After updating content:

1. ✅ Test locally: `npm run dev` → visit http://localhost:4321
2. ✅ Build for production: `npm run build`
3. ✅ Check `/dist` folder size (should be ~2.5MB)
4. ✅ Upload `/dist` to IPFS (Pinata + Web3.Storage)
5. ✅ Copy new IPFS CID
6. ✅ Update ENS contenthash with new CID
7. ✅ Test via `.eth.limo` gateway
8. ✅ Verify on all 3 domains:
   - rexkirshner.com
   - logrex.eth.limo
   - rexkirshner.eth.limo

---

## Need Help?

- **Code documentation**: See `CLAUDE.md`
- **All npm scripts**: Run `npm run` to see available commands
- **Dev server**: `npm run dev` (auto-reloads on file changes)
- **Production build**: `npm run build`
