# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Rex Kirshner built with Astro as a static site generator. The site features dual deployment:
- **Traditional**: https://rexkirshner.com (via Cloudflare Pages, auto-deploys from GitHub)
- **Decentralized**:
  - https://logrex.eth.limo (ENS gateway)
  - https://rexkirshner.eth.limo (ENS gateway)

Content is managed through JSON and Markdown files—no code changes are required to update site content.

## Key Technologies

- **Astro v5**: Static site generator with minimal JavaScript
- **Tailwind CSS v4**: Utility-first CSS framework via Vite plugin
- **Sharp**: Image processing library for responsive image generation and optimization
- **MapLibre GL**: Open-source mapping library for interactive travel map
- **IPFS**: Decentralized hosting via automated GitHub Actions (Pinata)
- **Cloudflare R2**: Photo storage backend
- **Cloudflare Pages**: Primary hosting with automatic GitHub deployments
- **@astrojs/partytown**: Web worker-based script loading for Google Analytics
- **@astrojs/sitemap**: Automatic sitemap generation for SEO

## Development Commands

```bash
# Start development server (http://localhost:4321)
npm run dev

# Build for production (outputs to /dist)
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI commands
npm run astro

# Content management scripts
npm run upload-photos              # Upload photos to Cloudflare R2
npm run generate-photos-json       # Generate photos.json from directory
npm run generate-thumbnails        # Create WebP thumbnails
npm run update-photos-json         # Update photos.json with R2 URLs
npm run add-photo-metadata         # Add EXIF metadata to photos.json
npm run process-strava             # Process Strava data exports
npm run update-travel-map          # Parse KML and update travel map data
npm run update-travel-map:verbose  # Verbose output for debugging
```

## Architecture

### Deployment Strategy

**Dual Deployment:**
1. **Cloudflare Pages** (Primary - rexkirshner.com):
   - Auto-deploys from GitHub on every push to `main`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Fast global CDN delivery

2. **IPFS** (Decentralized - .eth.limo):
   - GitHub Action automatically pins to Pinata on every push
   - CID output in GitHub Actions logs
   - ENS contenthash must be manually updated with new CID
   - Accessible via ENS gateways

**DNS Management:**
- Domain registered with GoDaddy
- DNS managed by Cloudflare
- Email (Google Workspace) MX records preserved
- Nameservers: `blair.ns.cloudflare.com`, `yisroel.ns.cloudflare.com`

### Content-Driven Static Site

All site content lives in `/content` as JSON or Markdown files. The site compiles these into static HTML with minimal JavaScript. This architecture enables:
- Zero-JS by default (JS only loads for interactive features: lightbox, video modal, travel map, carousel)
- Content updates without code changes
- Optimal performance for both traditional CDN and IPFS deployment
- Fast builds and deterministic output

### Component Organization

**Reusable Interactive Components:**
- `PhotoGallery.astro`: Carousel + tabbed filtering + native `<dialog>` lightbox with keyboard navigation
- `VideoGallery.astro`: Vimeo video grid with tabbed filtering and modal player
- `VimeoEmbed.astro`: Responsive 16:9 Vimeo iframe wrapper (no Vimeo API script)
- `StravaHeatmap.astro`: Embedded Strava heatmap with placeholder fallback
- `TravelMap.astro`: Lazy-loaded interactive map using MapLibre GL with OpenStreetMap tiles
- `RunningStats.astro`: Display running statistics with tabbed data views

**Responsive Tab Patterns:**
All tab-based components (RunningStats, VideoGallery, PhotoGallery) implement mobile-responsive tab selectors:
- Desktop: Traditional tab buttons in horizontal layout
- Mobile: Dropdown `<select>` element (cleaner on narrow screens)
- Responsive breakpoint: `md` (768px)
- Each select has `id` and `name` attributes for accessibility
- JavaScript handles both button clicks and select changes

**Layout:**
- `BaseLayout.astro`: Global layout with:
  - Fixed navigation with scroll-activated logo fade-in
  - Mobile menu toggle (hamburger icon)
  - Contact link in navigation
  - Footer with social links and back-to-top
  - Comprehensive SEO meta tags (Open Graph, Twitter Cards, Schema.org)
  - Resource hints (preconnect, dns-prefetch)
  - Google Analytics via Partytown
  - Favicon references (PNG format, multiple sizes)

**Pages:**
- `index.astro`: Single-page site with all sections:
  - Home/About with profile carousel (3 photos, auto-rotating, deferred script)
  - Creative section (videos and photography with carousels and tabbed galleries)
  - Ethereum projects (collapsible accordion on mobile)
  - Programming projects (collapsible accordion on mobile)
  - Running (narrative, stats with tabs, heatmap, travel map toggle)

### Content Schema

Content files are strongly structured:

**`/content/site/meta.json`**: Site-wide metadata including title, description, author, social links, and OG image path

**`/content/site/profile-pics.json`**: Array of profile images with responsive srcsets (uses dashes in filenames, not spaces)

**`/content/ethereum/projects.json`**: Array of Ethereum projects with id, title, type, tagline (optional), description, link, and image. Projects include Inevitable Ethereum Wiki, Strange Water Podcast, Expansion Podcast, and Signaling Theory Podcast.

**`/content/programming/projects.json`**: Array of programming projects with id, title, type, tagline, description, and link. Projects include AI Context System and Podcast Framework. Images optional.

**`/content/videos/videos.json`**: Array of videos with id, title, year, vimeoId, description, thumbnail path, and categories (featured, stories, year-reviews, running, all)

**`/content/photography/photos.json`**: Array of photos with:
- id, title, location, date
- thumbnailUrl (R2 URL for WebP thumbnail)
- originalUrl (R2 URL for original)
- categories (all, landscapes, cities, underwater, nature)
- alt, width, height
- Photos are hosted on Cloudflare R2; thumbnails are WebP format

**`/content/running/stats.json`**: Running statistics including:
- metadata (totalLocations, lastUpdated, dateRange)
- totals (totalMiles, totalRuns, totalCountries, homeStatesRan, travelStatesRan)
- byCountry array with country, miles, runs
- byState array with state, miles, runs, type (home/travel)
- homeVsTravel breakdown
- timeline data (yearly/monthly statistics)
- stravaLinks (profile URL, heatmap embed URL)

**`/content/running/narrative.md`**: Markdown narrative for running journey (displayed above stats)

**`/content/travel/map-data.json`**: Travel map data with:
- metadata (totalLocations, countries, lastUpdated, dateRange)
- bbox (bounding box)
- defaultZoom (1.2) and defaultCenter ([-70, 30] - Atlantic Ocean view)
- locations array with id, name, lat, lng, date, year, country
- paths array for flight routes (currently not displayed)

### JavaScript Patterns

This site uses minimal JavaScript with performance optimizations:

1. **Lightbox (PhotoGallery)**: Uses native `<dialog>` element with `define:vars` to pass photo data to script. Implements keyboard navigation (ESC, ←, →), click-outside-to-close, and next/prev buttons.

2. **Carousel (PhotoGallery)**: Featured photos carousel with:
   - Auto-advance every 8 seconds
   - Manual navigation (prev/next buttons, dots)
   - Pauses when off-screen (Intersection Observer)
   - Click to open in lightbox

3. **Video Modal (VideoGallery)**: Uses native `<dialog>` with dynamic Vimeo iframe injection. Clears iframe on close to stop playback.

4. **Mobile Menu (BaseLayout)**: Vanilla JS toggle with auto-close on link click.

5. **Nav Logo Fade (BaseLayout)**: Scroll listener that fades in "Rex Kirshner" logo in nav when user scrolls past the h1 title in home section. Uses opacity calculation based on title position.

6. **Profile Carousel (index.astro)**: 3-photo carousel with auto-rotate and manual controls. **Script is deferred to `window.load` event** to avoid blocking page load. Uses responsive WebP images with srcset (filenames use dashes, not spaces).

7. **Travel Map (TravelMap.astro)**: **Lazy-loaded** using dynamic imports. The map (1.5MB+ with dependencies) only loads when user clicks the "Show My Travel Map" toggle. Pattern:
   - Component exports `initMap()` async function
   - Function dynamically imports MapLibre GL and map data
   - Called from index.astro when toggle is clicked
   - Uses OpenStreetMap raster tiles
   - Centers on Atlantic Ocean ([-70, 30]) at zoom 1.2
   - Does NOT auto-fit to bounds - maintains fixed view showing US and Europe
   - Shows location markers with popups (name only)

8. **Responsive Tab Selectors**: All tabbed components implement a dual pattern:
   - Desktop: Tab buttons with active state styling
   - Mobile: Dropdown selector
   - Shared `switchTab()` function handles both interactions
   - Select changes update button states and vice versa

9. **Project Card Accordions (Ethereum & Programming)**: Collapsible cards on mobile to save vertical space:
   - Mobile (< 768px): Cards show title + type only, click to expand/collapse
   - Desktop (≥ 768px): All content visible in grid layout
   - Chevron icon rotates on toggle (mobile only)
   - Prevents link clicks from triggering accordion
   - Content uses `hidden md:block` pattern for responsive visibility
   - Separate scripts for `.ethereum-project` and `.programming-project` selectors

**Key Pattern**: Components use `define:vars` to pass Astro data to inline scripts. Scripts are scoped per-component and only execute when the component renders.

**Performance Pattern**: Heavy scripts (carousel, travel map) are deferred or lazy-loaded to prioritize initial page load.

### Styling Approach

- Tailwind classes directly in component templates
- Scoped `<style>` blocks for component-specific styles (especially modals/dialogs)
- No global CSS beyond Tailwind import in `/src/styles/global.css`
- Smooth scroll via CSS `scroll-behavior: smooth` in BaseLayout
- Responsive breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)

### Performance Optimizations

The site has been heavily optimized for slow internet connections and IPFS deployment:

1. **Image Optimization**:
   - All profile and content images converted to WebP
   - Responsive images with srcset (400w, 600w, 800w variants)
   - `sizes` attribute for proper responsive loading
   - `fetchpriority="high"` on first profile image (LCP)
   - Filenames use dashes instead of spaces for proper URL handling
   - Original JPG/PNG files moved to `.archive/` to exclude from build

2. **Lazy Loading**:
   - Travel map (MapLibre GL + GeoJSON data) only loads on user interaction
   - Uses dynamic imports: `await import('maplibre-gl')`
   - Profile images beyond first use `loading="lazy"`

3. **Script Deferral**:
   - Profile carousel script wrapped in `window.addEventListener('load', ...)`
   - Runs after page fully loaded to avoid blocking

4. **Resource Hints**:
   - `preconnect` for R2 photo CDN (with crossorigin)
   - `dns-prefetch` for OpenStreetMap tiles, Vimeo CDN

5. **Analytics Performance**:
   - Google Analytics loaded via Partytown (runs in web worker)
   - Prevents GA from blocking main thread

**Results**: Optimized build size ~2.5MB. Initial JS ~10KB.

### SEO Implementation

Comprehensive SEO setup for multi-domain deployment:

1. **Meta Tags (BaseLayout.astro)**:
   - Canonical URL always points to rexkirshner.com
   - Full Open Graph tags (og:title, og:description, og:image, og:url, etc.)
   - Twitter Cards with @LogarithmicRex handle
   - Author, robots, theme-color meta tags

2. **Alternate Links**:
   - All three domains listed as alternates with hreflang="en"

3. **Schema.org Structured Data**:
   - JSON-LD Person markup with:
     - Name, URL, image, jobTitle, description
     - knowsAbout array (Ethereum, Blockchain, Photography, Running, Content Creation)
     - sameAs array with social profile URLs
     - Email contact

4. **Sitemap**:
   - Generated automatically via @astrojs/sitemap
   - Includes all three domains via `customPages` config

5. **robots.txt**:
   - Allow all crawlers
   - References sitemap for all three domains

6. **OG Image**:
   - Optimized to 1200x630px
   - Served from `/images/og-image.jpg`

7. **Favicons**:
   - `favicon.png` (32x32)
   - `apple-touch-icon.png` (180x180)
   - `icon-512.png` (512x512)
   - All generated from source PNG using Sharp

### Deployment Workflows

**Cloudflare Pages (Automatic):**
1. Push to `main` branch on GitHub
2. Cloudflare Pages automatically:
   - Clones repo
   - Runs `npm install`
   - Runs `npm run build`
   - Deploys `/dist` to global CDN
3. Site live at rexkirshner.com within 1-3 minutes

**IPFS (Automatic via GitHub Actions):**
1. Push to `main` branch triggers `.github/workflows/deploy.yml`
2. GitHub Action:
   - Builds site (`npm run build`)
   - Pins `/dist` to Pinata using `aquiladev/ipfs-action`
   - Outputs CID in GitHub Actions logs and summary
3. Manual step: Update ENS contenthash with new CID
4. Site accessible via .eth.limo gateways

**ENS Update (Manual):**
1. Get CID from GitHub Actions output (format: `ipfs://[CID]`)
2. Update ENS contenthash for logrex.eth and rexkirshner.eth
3. Wait for ENS propagation (~5-15 minutes)
4. Test via https://logrex.eth.limo and https://rexkirshner.eth.limo

## Performance Requirements

- Lighthouse Performance ≥95
- Lighthouse Accessibility ≥95
- Lighthouse Best Practices ≥95
- Cold load via .eth.limo ≤2.5s on 4G
- Build size ≤3MB (currently ~2.5MB)

## Content Update Workflow

**For rexkirshner.com (automatic):**
1. Edit JSON/Markdown files in `/content`
2. Commit and push to GitHub
3. Cloudflare Pages auto-deploys within 1-3 minutes

**For .eth.limo (semi-automatic):**
1. Edit JSON/Markdown files in `/content`
2. Commit and push to GitHub
3. GitHub Action auto-pins to IPFS
4. Get CID from GitHub Actions logs
5. Update ENS contenthash manually
6. Test via .eth.limo gateway

## Photo Management Workflow

Photos are hosted on Cloudflare R2 (not IPFS) for cost and performance. The complete workflow is:

1. Export photos from source (Lightroom, phone, etc.)
2. Place originals in `/public/images/photography/` (temporary)
3. Run `npm run generate-thumbnails` to create WebP thumbnails at multiple sizes
4. Run `npm run upload-photos` to upload originals and thumbnails to R2
5. Run `npm run update-photos-json` to update photos.json with R2 URLs
6. Optionally run `npm run add-photo-metadata` to add EXIF data
7. Move originals to `.archive/` to exclude from build
8. Rebuild site with `npm run build`

**Scripts in `/scripts/`**:
- `generate-thumbnails.js`: Uses Sharp to create WebP thumbnails
- `upload-photos.js`: Uploads to R2 via AWS SDK
- `generate-photos-json.js`: Creates initial photos.json from directory
- `update-photos-json.js`: Updates JSON with R2 URLs after upload
- `add-photo-metadata.js`: Extracts EXIF data and adds to JSON

## Travel Map Workflow

The travel map is built from KML export and converted to GeoJSON:

1. Export KML file from Google My Maps
2. Place in `/content/travel/` directory
3. Run `npm run update-travel-map` to parse KML and generate map-data.json
4. Script (`parse-travel-kml.js`) handles:
   - Parsing KML using @mapbox/togeojson
   - Splitting multi-segment LineStrings at antimeridian (-180/180)
   - Generating bbox and metadata
   - Creating location markers (paths currently not rendered)
   - Setting default view: center [-70, 30], zoom 1.2
5. Rebuild site

**Important**: The map does NOT auto-fit to bounds. It maintains a fixed view centered on the Atlantic Ocean showing both US and Europe.

## Important Notes for Future Development

- **Do not add client-side routing**: This is a single-page site with anchor links only
- **Keep JavaScript minimal**: Only add JS when absolutely necessary for interactivity
- **Preserve content schema**: Changes to JSON structure will break the site
- **Test IPFS compatibility**: Any new features should work on IPFS gateways
- **Performance is critical**: Site must load quickly on slow connections for IPFS/ENS access
- **Lazy load heavy dependencies**: Follow TravelMap pattern for any large libraries
- **Defer non-critical scripts**: Follow carousel pattern for scripts that aren't needed immediately
- **Use WebP for all images**: Better compression than JPG/PNG
- **Archive original images**: Keep originals in `.archive/` to exclude from build
- **Image filenames**: Use dashes, not spaces (e.g., `profile-pic-1.webp` not `profile pic 1.webp`)
- **Responsive tabs**: Use dropdown selectors on mobile, tab buttons on desktop (breakpoint: `md`)
- **Form elements**: Always include `id` and `name` attributes on `<select>` elements for accessibility
- **Travel map**: Maintains fixed Atlantic Ocean view, does NOT auto-fit to bounds

## File Organization

**Active Development:**
- `/src`: All Astro components, pages, layouts
- `/content`: All content JSON/Markdown files
  - `/content/site`: Site metadata and profile pics
  - `/content/ethereum`: Ethereum projects
  - `/content/programming`: Programming projects
  - `/content/videos`: Vimeo videos
  - `/content/photography`: Photo metadata (images on R2)
  - `/content/running`: Running stats and narrative
  - `/content/travel`: Travel map data
  - `/content/expansion`: Expansion Podcast episodes
- `/public`: Static assets (images, favicons, robots.txt)
- `/scripts`: Content management automation scripts
- `.github/workflows`: GitHub Actions for IPFS deployment

**Archived (excluded from builds):**
- `.archive/`: Original migration files, high-res images, old exports

## Writing Style

When writing copy for this site, use Rex's voice:
- Short, direct sentences
- No flowery or overly descriptive language
- Personal and conversational but not casual
- Clear and concise
- Example structure: "I [verb]. I [verb]. I believe..."
- Focus on concrete actions and outcomes, not abstract concepts

## Development Workflow

1. First think through the problem, read the codebase for relevant files, and write a plan using the TodoWrite tool.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
8. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY

CRITICAL: When debugging, you MUST trace through the ENTIRE code flow step by step. No assumptions. No shortcuts.

## AI Context System

This project uses the AI Context System for session continuity. Configuration and preferences are in `context/.context-config.json`.

**Context Files:**
- `context/STATUS.md` - Current state and active tasks
- `context/SESSIONS.md` - Session history
- `context/DECISIONS.md` - Technical decisions with rationale
- `context/CONTEXT.md` - Project orientation (supplements this file)

**Session Commands:**
- `/save` - Quick session update (2-3 min)
- `/save-full` - Comprehensive save before breaks (10-15 min)
- `/review-context` - Orient at session start
- `/code-review` - Run code audits
