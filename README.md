# Rex Kirshner - Personal Website

A modern, performant personal portfolio website built with Astro and deployed to IPFS, accessible via ENS.

## 🚀 Project Overview

This is a static website showcasing:
- Personal projects and Ethereum contributions
- Programming projects (AI Context System, Podcast Framework)
- Video portfolio (Vimeo-hosted)
- Photography gallery with lightbox
- Running journey and statistics
- About/bio section
- Expansion Podcast episodes (dedicated page at `/expansion` - created to highlight the work Rex did on the Expansion Podcast, which ran longer than his involvement and has since been canceled. This page contains all 35 episodes he hosted)

**Tech Stack:**
- **Framework:** Astro (static site generator)
- **Styling:** Tailwind CSS
- **Hosting:** IPFS (dual pinning: Pinata + Web3.Storage)
- **Domain:** ENS name via .eth.limo gateway
- **Photo Storage:** Cloudflare R2
- **Video Hosting:** Vimeo

## 📁 Project Structure

```
/
├── content/              # All site content (JSON/Markdown)
│   ├── site/
│   │   └── meta.json    # Site metadata, OG image, social links
│   ├── ethereum/
│   │   └── projects.json
│   ├── programming/
│   │   └── projects.json
│   ├── videos/
│   │   └── videos.json
│   ├── photography/
│   │   └── photos.json  # Photo metadata with R2 URLs
│   ├── running/
│   │   ├── stats.json
│   │   └── narrative.md
│   ├── expansion/       # Expansion Podcast episodes
│   │   ├── episodes.json
│   │   └── meta.json
│   └── travel/
│       └── map-data.json
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── PhotoGallery.astro
│   │   ├── VideoGallery.astro
│   │   ├── VimeoEmbed.astro
│   │   └── StravaHeatmap.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro     # Main homepage
│   │   └── expansion.astro # Expansion Podcast episodes page
│   └── styles/
│       └── global.css   # Tailwind imports
└── public/              # Static assets
    └── images/
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ and npm
- Git

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start dev server:**
   ```bash
   npm run dev
   ```
   Visit http://localhost:4321

3. **Build for production:**
   ```bash
   npm run build
   ```
   Output: `/dist` folder ready for IPFS

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production site
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

## 📝 Content Management

All content is managed through JSON and Markdown files in the `/content` directory. No code changes needed to update content!

### Update Site Metadata

Edit `/content/site/meta.json`:
```json
{
  "title": "Your Name",
  "tagline": "Your tagline",
  "description": "SEO description",
  "social": {
    "twitter": "https://twitter.com/yourhandle",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "email": "you@example.com",
    "strava": "https://strava.com/athletes/your-id"
  },
  "ogImage": "/images/og-image.jpg"
}
```

### Add/Update Ethereum Projects

Edit `/content/ethereum/projects.json`:
```json
[
  {
    "id": "project-slug",
    "title": "Project Title",
    "type": "Project Type",
    "description": "Project description",
    "link": "https://project-url.com",
    "image": "/images/ethereum/project-image.jpg"
  }
]
```

### Add/Update Videos

Edit `/content/videos/videos.json`:
```json
[
  {
    "id": "video-slug",
    "title": "Video Title",
    "year": 2024,
    "vimeoId": "123456789",  // Get from Vimeo video URL
    "description": "Video description",
    "thumbnail": "/images/videos/thumb.jpg"
  }
]
```

**Finding Vimeo ID:** From a URL like `https://vimeo.com/123456789`, the ID is `123456789`.

### Add/Update Photos

Edit `/content/photography/photos.json`:
```json
[
  {
    "id": "photo-1",
    "title": "Photo Title",
    "location": "Location Name",
    "thumbnailCID": "Qm...",  // IPFS CID for thumbnail (optional)
    "thumbnailUrl": "https://r2-url.com/thumb.webp",
    "originalUrl": "https://r2-url.com/original.jpg",
    "alt": "Descriptive alt text for accessibility",
    "width": 1920,
    "height": 1080
  }
]
```

### Update Running Stats

Edit `/content/running/stats.json`:
```json
{
  "timePeriod": {
    "start": "2016-11-02",
    "end": "2024-09-06"
  },
  "totals": {
    "miles": 15000,
    "countries": 42,
    "workMiles": 8000,
    "pleasureMiles": 7000
  },
  "byCountry": [
    {
      "country": "Country Name",
      "miles": 1000
    }
  ],
  "stravaLinks": {
    "profile": "https://www.strava.com/athletes/your-id",
    "heatmap": "https://www.strava.com/athletes/your-id/heatmaps/embed"
  }
}
```

**Getting Strava Heatmap URL:**
1. Go to your Strava profile
2. Click on "Training" → "My Heatmaps"
3. Use the embed URL format: `https://www.strava.com/athletes/YOUR_ID/heatmaps/embed`

### Update Bio

Edit `/content/about/bio.md` using Markdown formatting.

## 📸 Photo Management with Cloudflare R2

### Setup R2 Bucket

1. Create Cloudflare account
2. Go to R2 Object Storage
3. Create a new bucket (e.g., `rexkirshner-photos`)
4. Configure public access
5. Set up custom domain (optional)

### Upload Photos

1. Export photos from Squarespace
2. Generate responsive thumbnails (WebP, 2-3 sizes):
   ```bash
   # Using sharp or similar tool
   npm install -g sharp-cli
   sharp -i original.jpg -o thumb-400.webp resize 400
   sharp -i original.jpg -o thumb-800.webp resize 800
   ```
3. Upload to R2:
   - Original: `photos/original.jpg`
   - Thumbnails: `photos/thumb-400.webp`, `photos/thumb-800.webp`
4. Update `/content/photography/photos.json` with R2 URLs

### R2 URL Format

Public URLs: `https://pub-xxxxx.r2.dev/photos/image.jpg`

Or with custom domain: `https://photos.yoursite.com/photos/image.jpg`

## 🚢 Deployment to IPFS

### Prerequisites

- Accounts with:
  - **Pinata** (primary pinning service)
  - **Web3.Storage** (secondary pinning service)
  - **ENS** domain configured

### Build & Deploy

1. **Build production site:**
   ```bash
   npm run build
   ```

2. **Deploy to Pinata:**
   - Upload `/dist` folder to Pinata
   - Get CID (e.g., `QmXXX...`)

3. **Pin to Web3.Storage (redundancy):**
   - Upload same `/dist` to Web3.Storage
   - Verify same CID

4. **Update ENS:**
   - Go to ENS manager
   - Set contenthash to `ipfs://QmXXX...`
   - Wait for propagation

5. **Test:**
   - Visit `yourname.eth.limo`
   - Verify site loads correctly

### Using CLI Tools

**Pinata CLI:**
```bash
npm install -g pinata-cli
pinata upload dist/
```

**IPFS CLI:**
```bash
ipfs add -r dist/
# Copy CID, then pin on Pinata & Web3.Storage
```

### Automated Deployment (Optional)

Create `.github/workflows/deploy.yml` for automatic deployment on push:
```yaml
name: Deploy to IPFS
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci && npm run build
      - name: Deploy to Pinata
        run: # Add Pinata deployment script
```

## 🎨 Customization

### Styling

- Global styles: `/src/styles/global.css`
- Tailwind config: `/tailwind.config.cjs`
- Component styles: Scoped `<style>` tags in `.astro` files

### Adding Sections

1. Create content JSON/Markdown file
2. Create component in `/src/components/`
3. Import and use in `/src/pages/index.astro`
4. Update navigation in `/src/layouts/BaseLayout.astro`

## ⚡ Performance

### Targets (from PRD)

- Lighthouse Performance: ≥95
- Lighthouse Accessibility: ≥95
- Lighthouse Best Practices: ≥95
- Cold load (via .eth.limo): ≤2.5s on 4G

### Optimization Tips

- Use WebP images with fallbacks
- Lazy-load images (`loading="lazy"`)
- Minimize JS (only lightbox & charts are interactive)
- Compress assets before uploading to R2
- Test with Lighthouse in Chrome DevTools

### Running Lighthouse

```bash
npm run build
npm run preview
# In Chrome DevTools: Lighthouse tab → Run audit
```

## 🐛 Troubleshooting

### Dev server not starting
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Lightbox not working
- Check browser console for errors
- Ensure photos have valid `originalUrl` values
- Verify `<dialog>` support (all modern browsers)

### Vimeo videos not loading
- Verify `vimeoId` is correct (numbers only)
- Check Vimeo privacy settings (must be public or unlisted)
- Test embed URL: `https://player.vimeo.com/video/YOUR_ID`

### Strava heatmap not showing
- Verify heatmap privacy settings on Strava
- Ensure URL format: `https://www.strava.com/athletes/ID/heatmaps/embed`
- Check if iframe loads (may be blocked by some browsers)

### IPFS site not loading
- Try multiple gateways: `.eth.limo`, `ipfs.io`, `dweb.link`
- Verify CID is pinned on both Pinata & Web3.Storage
- Clear browser cache
- Check ENS contenthash is set correctly

## 📄 License

Personal project - All rights reserved

## 🙋 Support

For issues or questions, check:
- Astro docs: https://docs.astro.build
- Tailwind docs: https://tailwindcss.com/docs
- IPFS docs: https://docs.ipfs.tech
- ENS docs: https://docs.ens.domains

---

**Built with:** Astro v5 • Tailwind CSS v4 • Sharp • IPFS • ENS

**Last Updated:** October 2025

