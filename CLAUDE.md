# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Rex Kirshner built with Astro as a static site generator. The site is designed to be deployed to IPFS and accessed via three domains:
- **Primary**: https://rexkirshner.com
- **ENS Gateway 1**: https://logrex.eth.limo
- **ENS Gateway 2**: https://rexkirshner.eth.limo

Content is managed through JSON and Markdown files—no code changes are required to update site content.

## Key Technologies

- **Astro v5**: Static site generator with minimal JavaScript
- **Tailwind CSS v4**: Utility-first CSS framework via Vite plugin
- **Sharp**: Image processing library for responsive image generation and optimization
- **MapLibre GL**: Open-source mapping library for interactive travel map
- **IPFS**: Decentralized hosting with dual pinning (Pinata + Web3.Storage)
- **Cloudflare R2**: Photo storage backend
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

### Content-Driven Static Site

All site content lives in `/content` as JSON or Markdown files. The site compiles these into static HTML with minimal JavaScript. This architecture enables:
- Zero-JS by default (JS only loads for interactive features: lightbox, video modal, travel map, carousel)
- Content updates without code changes
- Optimal performance for IPFS deployment (build optimized to ~2.5MB)
- Fast builds and deterministic output

### Component Organization

**Reusable Interactive Components:**
- `PhotoGallery.astro`: Grid + native `<dialog>` lightbox with keyboard navigation
- `VideoGallery.astro`: Vimeo video grid with modal player
- `VimeoEmbed.astro`: Responsive 16:9 Vimeo iframe wrapper (no Vimeo API script)
- `StravaHeatmap.astro`: Embedded Strava heatmap with placeholder fallback
- `TravelMap.astro`: Lazy-loaded interactive map using MapLibre GL with OpenStreetMap tiles
- `RunningStats.astro`: Display running statistics from stats.json

**Layout:**
- `BaseLayout.astro`: Global layout with:
  - Fixed navigation with scroll-activated logo fade-in
  - Mobile menu toggle
  - Footer with social links and back-to-top
  - Comprehensive SEO meta tags (Open Graph, Twitter Cards, Schema.org)
  - Resource hints (preconnect, dns-prefetch)
  - Google Analytics via Partytown
  - Favicon references (PNG format, multiple sizes)

**Pages:**
- `index.astro`: Single-page site with all sections:
  - Home/About with profile carousel (3 photos, deferred script)
  - Creative section (videos and photography)
  - Ethereum projects
  - Running (narrative, stats, heatmap, travel map toggle)

### Content Schema

Content files are strongly structured:

**`/content/site/meta.json`**: Site-wide metadata including title, description, author, social links, and OG image path

**`/content/ethereum/projects.json`**: Array of Ethereum projects with id, title, type, description, link, and image

**`/content/videos/videos.json`**: Array of videos with id, title, year, vimeoId, description, and thumbnail path

**`/content/photography/photos.json`**: Array of photos with:
- id, title, location, date
- thumbnailCID (optional legacy field)
- thumbnailUrl (R2 URL for WebP thumbnail)
- originalUrl (R2 URL for original)
- alt, width, height
- Photos are hosted on Cloudflare R2; thumbnails are WebP format

**`/content/running/stats.json`**: Running statistics including:
- timePeriod (e.g., "November 2016 - Present")
- totals (miles, countries, workMiles, pleasureMiles)
- byCountry array with country, miles
- stravaLinks (profile URL, heatmap embed URL)

**`/content/running/narrative.md`**: Markdown narrative for running journey (displayed above stats)

**`/content/travel/map-data.json`**: GeoJSON FeatureCollection with:
- type, features array
- bbox (bounding box for auto-fit)
- Each feature has geometry (Point coordinates) and properties (name, dates visited)

### JavaScript Patterns

This site uses minimal JavaScript with performance optimizations:

1. **Lightbox (PhotoGallery)**: Uses native `<dialog>` element with `define:vars` to pass photo data to script. Implements keyboard navigation (ESC, ←, →), click-outside-to-close, and next/prev buttons.

2. **Video Modal (VideoGallery)**: Uses native `<dialog>` with dynamic Vimeo iframe injection. Clears iframe on close to stop playback.

3. **Mobile Menu (BaseLayout)**: Vanilla JS toggle with auto-close on link click.

4. **Nav Logo Fade (BaseLayout)**: Scroll listener that fades in "Rex Kirshner" logo in nav when user scrolls past the h1 title in home section. Uses opacity calculation based on title position.

5. **Profile Carousel (index.astro)**: 3-photo carousel with auto-rotate and manual controls. **Script is deferred to `window.load` event** to avoid blocking page load. Uses responsive WebP images with srcset.

6. **Travel Map (TravelMap.astro)**: **Lazy-loaded** using dynamic imports. The map (1.5MB+ with dependencies) only loads when user clicks the "Show My Travel Map" toggle. Pattern:
   - Component exports `initMap()` async function
   - Function dynamically imports MapLibre GL and map data
   - Called from index.astro when toggle is clicked
   - Uses OpenStreetMap raster tiles
   - Auto-fits to bbox from map-data.json
   - Shows location markers with popups (name only, no dates)

**Key Pattern**: Components use `define:vars` to pass Astro data to inline scripts. Scripts are scoped per-component and only execute when the component renders.

**Performance Pattern**: Heavy scripts (carousel, travel map) are deferred or lazy-loaded to prioritize initial page load.

### Styling Approach

- Tailwind classes directly in component templates
- Scoped `<style>` blocks for component-specific styles (especially modals/dialogs)
- No global CSS beyond Tailwind import in `/src/styles/global.css`
- Smooth scroll via CSS `scroll-behavior: smooth` in BaseLayout

### Performance Optimizations

The site has been heavily optimized for slow internet connections and IPFS deployment:

1. **Image Optimization**:
   - All profile and content images converted to WebP
   - Responsive images with srcset (400w, 600w, 800w variants)
   - `sizes` attribute for proper responsive loading
   - `fetchpriority="high"` on first profile image (LCP)
   - Original JPG/PNG files moved to `.archive/` to exclude from build

2. **Lazy Loading**:
   - Travel map (MapLibre GL + GeoJSON data) only loads on user interaction
   - Uses dynamic imports: `await import('maplibre-gl')`

3. **Script Deferral**:
   - Profile carousel script wrapped in `window.addEventListener('load', ...)`
   - Runs after page fully loaded to avoid blocking

4. **Resource Hints**:
   - `preconnect` for R2 photo CDN (with crossorigin)
   - `dns-prefetch` for OpenStreetMap tiles, Vimeo CDN

5. **Analytics Performance**:
   - Google Analytics loaded via Partytown (runs in web worker)
   - Prevents GA from blocking main thread

**Results**: Build reduced from 9.8MB → 2.5MB (75% reduction). Initial JS from 1.5MB → ~10KB.

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
   - Optimized to 1200x630px, 99KB JPEG
   - Served from `/images/og-image.jpg`

7. **Favicons**:
   - `favicon.png` (32x32)
   - `apple-touch-icon.png` (180x180)
   - `icon-512.png` (512x512)
   - All generated from source PNG using Sharp

### IPFS Deployment Considerations

1. **Deterministic Builds**: The `/dist` output must be identical for the same content to ensure consistent IPFS CIDs.

2. **Hash-Based Assets**: All assets should use content hashing for cache busting (Astro handles this by default).

3. **No Client-Side Routing**: Uses anchor links (#ethereum, #videos, etc.) instead of client-side routing to ensure all content is accessible on first load via IPFS gateways.

4. **Dual Pinning**: Site is pinned to both Pinata and Web3.Storage for redundancy.

5. **ENS Integration**: ENS contenthash points directly to IPFS CID (no IPNS in V1 for simplicity).

## Performance Requirements

- Lighthouse Performance ≥95
- Lighthouse Accessibility ≥95
- Lighthouse Best Practices ≥95
- Cold load via .eth.limo ≤2.5s on 4G
- Build size ≤3MB (currently ~2.5MB)

## Content Update Workflow

1. Edit JSON/Markdown files in `/content`
2. Run `npm run build`
3. Upload `/dist` to IPFS via Pinata and Web3.Storage
4. Update ENS contenthash with new CID
5. Test via `.eth.limo` gateway

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
   - Generating bbox for auto-fit
   - Creating both line data and point markers
5. Rebuild site

**Data Structure**: GeoJSON FeatureCollection with LineStrings for routes and Points for location markers.

## Important Notes for Future Development

- **Do not add client-side routing**: This is a single-page site with anchor links only
- **Keep JavaScript minimal**: Only add JS when absolutely necessary for interactivity
- **Preserve content schema**: Changes to JSON structure will break the site
- **Test IPFS compatibility**: Any new features should work on IPFS gateways (some features like service workers may not)
- **Maintain dual pinning**: Always pin to both Pinata and Web3.Storage
- **Performance is critical**: Site must load quickly on slow connections for IPFS/ENS access
- **Lazy load heavy dependencies**: Follow TravelMap pattern for any large libraries
- **Defer non-critical scripts**: Follow carousel pattern for scripts that aren't needed immediately
- **Use WebP for all images**: Better compression than JPG/PNG
- **Archive original images**: Keep originals in `.archive/` to exclude from build

## Writing Style

When writing copy for this site, use Rex's voice:
- Short, direct sentences
- No flowery or overly descriptive language
- Personal and conversational but not casual
- Clear and concise
- Example structure: "I [verb]. I [verb]. I believe..."
- Focus on concrete actions and outcomes, not abstract concepts

## Development Workflow

1. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.
2. The plan should have a list of todo items that you can check off as you complete them
3. Before you begin working, check in with me and I will verify the plan.
4. Then, begin working on the todo items, marking them as complete as you go.
5. Please every step of the way just give me a high level explanation of what changes you made
6. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.
7. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.
8. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY
9. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY

CRITICAL: When debugging, you MUST trace through the ENTIRE code flow step by step. No assumptions. No shortcuts.
