# Project Context

**Last Updated:** 2026-01-06
**Purpose:** Project orientation and high-level architecture

---

## What Is This Project?

**Rex Kirshner Personal Website** - A personal portfolio showcasing Rex's work in Ethereum research, content creation, photography, and running. Built as a static site with dual deployment: traditional CDN (Cloudflare Pages) and decentralized IPFS (.eth.limo gateways).

**Goals:**
- Showcase professional work and creative content
- Provide fast, reliable access via traditional and decentralized web
- Maintain content through simple JSON/Markdown updates (no code changes needed)

**Key Stakeholders:**
- Owner: Rex Kirshner
- Users: Professional contacts, potential collaborators, general audience
- Contributors: Rex (solo maintainer)

---

## Getting Started

**First time here? (5-minute startup)**

1. **Read STATUS.md Quick Reference** (30 seconds)
   - Checkpoint: Can you find production URL and current phase?

2. **Check Active Tasks in STATUS.md** (2 minutes)
   - Checkpoint: Know what needs doing next?

3. **Review last session in SESSIONS.md** (2 minutes)
   - Checkpoint: Understand recent work and decisions?

4. **Start working**

**Need deeper context? (30-minute orientation)**
- Read this file (CONTEXT.md) for architecture - 10 minutes
- Read CLAUDE.md for development rules and patterns - 10 minutes
- Read DECISIONS.md for technical rationale - 10 minutes

**For AI agents taking over:**
CLAUDE.md at project root is comprehensive (19KB). Read it first - it has all architecture, patterns, and constraints. This CONTEXT.md supplements it with session state.

---

## Tech Stack

**Core Technologies:**
- **Framework:** Astro v5 - Static site generator with minimal JavaScript
- **Styling:** Tailwind CSS v4 - Utility-first CSS via Vite plugin
- **Mapping:** MapLibre GL - Open-source interactive maps (lazy-loaded)
- **Images:** Sharp - Image processing for responsive WebP generation
- **Storage:** Cloudflare R2 - Photo hosting via cdn.rexkirshner.com
- **Hosting:** Cloudflare Pages (primary) + IPFS/Pinata (decentralized)

**Why these choices?**
Performance and simplicity. Static HTML with zero JS by default. JS only loads for interactive features (lightbox, video modal, travel map, carousel). Must work on IPFS gateways with slow connections. See CLAUDE.md for detailed rationale.

---

## High-Level Architecture

**Type:** Static Portfolio Website (Single Page + Expansion subpage)

**Architecture Pattern:** Content-driven static site with minimal client-side interactivity

**System Diagram:**
```
Content (JSON/MD)     Build Time              Runtime
─────────────────     ──────────────          ────────────────
/content/*.json  ───► Astro Build ──────────► Static HTML/CSS
                        │                          │
                        ▼                          ▼
               /public/images ────────────► Cloudflare Pages
                                                   │
               Cloudflare R2 ◄─────────────────────┤ (photos)
               (cdn.rexkirshner.com)               │
                                                   ▼
                                            IPFS (Pinata)
                                                   │
                                                   ▼
                                           .eth.limo gateways
```

**Key Components:**
- **BaseLayout.astro:** Global layout with nav, footer, SEO meta tags
- **PhotoGallery.astro:** Carousel + tabbed filtering + lightbox
- **VideoGallery.astro:** Vimeo grid with modal player
- **TravelMap.astro:** Lazy-loaded MapLibre map
- **RunningStats.astro:** Tabbed statistics display

**Data Flow:**
Content lives in `/content/` as JSON files. At build time, Astro imports these and generates static HTML. Photos are hosted on Cloudflare R2 (not in repo). The build output goes to Cloudflare Pages for rexkirshner.com and gets pinned to IPFS for .eth.limo access.

**For detailed architectural decisions:** See CLAUDE.md (comprehensive) and DECISIONS.md

---

## Directory Structure

```
personal-website/
├── src/
│   ├── components/      # Astro components (galleries, stats, map)
│   ├── layouts/         # BaseLayout, ExpansionLayout
│   ├── pages/           # index.astro, expansion.astro
│   └── styles/          # global.css (Tailwind import)
├── content/             # All content as JSON/Markdown
│   ├── site/            # meta.json, profile-pics.json
│   ├── ethereum/        # projects.json
│   ├── videos/          # videos.json
│   ├── photography/     # photos.json (R2 URLs)
│   ├── running/         # stats.json, narrative.md
│   ├── travel/          # map-data.json
│   └── expansion/       # episodes.json
├── public/              # Static assets (favicons, local images)
├── scripts/             # Content management automation
├── context/             # AI Context System docs (this folder)
└── .claude/commands/    # ACS slash commands
```

**File Organization Principles:**
- Content separated from code (edit JSON, not components)
- Components are self-contained with scoped scripts
- Heavy assets on CDN (R2), not in repo

---

## Development Workflow

**Core Principles:**
1. **Read before edit** - Never modify code you haven't read
2. **Simplicity first** - Minimal changes, avoid over-engineering
3. **Test IPFS** - Any changes must work on IPFS gateways
4. **Performance matters** - Lighthouse 95+, build <3MB

**Git Workflow:**
- Branch: Main branch only (simple project)
- Commits: Descriptive messages with context
- **Push Protocol:** NEVER push without explicit user approval

**Common Commands:**
```bash
npm run dev          # Development server (localhost:4321)
npm run build        # Production build (outputs to /dist)
npm run preview      # Preview production build locally
```

**For detailed workflow:** See CLAUDE.md "Development Workflow" section

---

## Environment Setup

**Prerequisites:**
- Node.js 20+
- npm

**Initial Setup:**
```bash
# 1. Install dependencies
npm install

# 2. Configure environment (only needed for R2 uploads)
cp .env.example .env
# Edit .env with R2 credentials (optional)

# 3. Run development server
npm run dev
```

**Environment Variables:**
- `.env` contains R2 credentials (gitignored)
- Not required for basic development
- Only needed for `npm run upload-photos`

---

## Key Resources

**Documentation:**
- [CLAUDE.md](../CLAUDE.md) - Comprehensive project reference (auto-loaded)
- [STATUS.md](./STATUS.md) - Current state and tasks
- [DECISIONS.md](./DECISIONS.md) - Technical decisions
- [SESSIONS.md](./SESSIONS.md) - Session history

**Project URLs:**
- **Production:** https://rexkirshner.com
- **IPFS:** https://logrex.eth.limo / https://rexkirshner.eth.limo
- **CDN:** https://cdn.rexkirshner.com
- **Repository:** (private)

---

## Important Context & Gotchas

**IPFS Compatibility:**
- All paths must be relative (not absolute)
- Run `node scripts/fix-ipfs-paths.js` after build for IPFS deployment
- GitHub Action handles this automatically

**Image Handling:**
- All images must be WebP format
- Filenames use dashes, not spaces
- Photos hosted on R2, thumbnails also on R2
- Archive originals in `.archive/` to exclude from build

**Performance Constraints:**
- Build size must stay under 3MB
- Lazy-load heavy dependencies (MapLibre is 1.5MB+)
- Defer non-critical scripts

**Responsive Patterns:**
- Tabs: Dropdown on mobile, buttons on desktop (breakpoint: `md`)
- Accordions: Collapsed on mobile, expanded on desktop

---

## Current Work

**For current tasks, status, and next steps:** See [STATUS.md](./STATUS.md)

**For recent work and sessions:** See [SESSIONS.md](./SESSIONS.md)

**For technical decisions:** See [DECISIONS.md](./DECISIONS.md)

---

**This file provides orientation.** For what's happening now, always check STATUS.md first.
