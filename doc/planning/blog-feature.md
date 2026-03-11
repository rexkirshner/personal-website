# Blog Feature — Implementation Plan

**Created:** 2026-03-10
**Status:** Approved, not yet started

## Overview

Add a blog to the personal website. Minimal, clean design inspired by vitalik.eth.limo. Markdown files with YAML frontmatter, rendered as static pages with individual URLs for social sharing.

## Requirements

### Content
- Standard Markdown files with YAML frontmatter (generic, portable to other mediums)
- Frontmatter fields: title, date, description, tags, image (optional banner), draft (optional)
- Tags (not categories) — a post can have multiple tags
- No RSS feed for now
- No comments — purely static

### Design
- Minimal, Vitalik-style aesthetic
- Blog listing: reverse-chronological, date + title per entry
- Individual posts: date, title, optional banner image, rendered markdown body
- Posts may have inline images beyond the banner

### Navigation & UX
- "Blog" nav link between Blockchain and Creative
- Homepage blog preview section (all posts, date + title) between Blockchain and Creative
- Blog listing page with client-side tag filtering and text search (title/description)

### Social Sharing & SEO
- Each post has a unique URL at `/blog/[slug]`
- Share links: Twitter, LinkedIn, copy-URL
- OG image: banner image if present, otherwise default blog OG image (to be provided later)
- `og:type` = `article` for blog posts (with `article:published_time`, `article:tag`)
- `BlogPosting` Schema.org JSON-LD per post

### Constraints
- IPFS compatible (relative paths, `build.format: 'file'`)
- Build size stays under 3MB budget
- Zero JS for post pages (except share copy-URL button)
- Tailwind typography for prose styling

## Architecture Decisions

### Content Collections (new pattern)
This project currently imports all content as raw JSON. The blog introduces Astro content collections for the first time via `content.config.ts`. This is scoped only to `/content/blog/` — existing JSON content is not converted. Content collections are the right tool for markdown with frontmatter and provide schema validation, type safety, and built-in markdown rendering.

### Client-Side Tag Filtering (not static tag pages)
Tags are filtered client-side on `/blog` via JavaScript rather than generating separate `/blog/tag/[tag]` static pages. With few initial posts, static tag pages would be near-empty and add routing complexity. This can be revisited when content volume justifies shareable tag URLs.

### Nav Link Context Awareness
BaseLayout nav links are currently `#anchor` links that assume the homepage. Blog pages use BaseLayout, so nav links must become context-aware: `#anchor` on homepage, `/#anchor` on other pages. This also fixes a pre-existing issue on the `/expansion` page.

### Homepage Preview Scaling
The homepage blog preview shows all posts initially. When post count grows (50+), this should be capped to the latest ~10 with a "View all" link. Documented here and in CLAUDE.md for future reference.

## Implementation Tasks

### Phase 1 — Foundation (parallel, no dependencies)

**Task 1: Set up Astro content collection for blog**
- Create `content.config.ts` with Zod schema for blog frontmatter
- Create `/content/blog/` directory
- Document the pattern break in CLAUDE.md

**Task 2: Add @tailwindcss/typography plugin**
- Install `@tailwindcss/typography`
- Add `@import "@tailwindcss/typography"` to `global.css` (Tailwind v4 pattern)
- Verify compatibility with existing Tailwind v4 + Vite plugin setup

**Task 10: Add ogType prop to BaseLayout**
- Add `ogType` prop (default: `"website"`)
- When `"article"`, accept and render `article:published_time` and `article:tag` meta tags
- Prerequisite for blog post pages

### Phase 2 — Pages (depends on Phase 1)

**Task 8: Create a sample blog post** *(needs Task 1)*
- Create one test `.md` file in `/content/blog/`
- Include all frontmatter fields
- Body with headings, links, blockquote, image reference

**Task 3: Create blog listing page at /blog** *(needs Tasks 1, 2)*
- `src/pages/blog/index.astro`
- Reverse-chronological list: date + linked title
- Tag filter links at top (client-side JS)
- Text search input filtering by title/description (client-side JS)
- Uses BaseLayout with SEO props

**Task 4: Create individual blog post page at /blog/[slug]** *(needs Tasks 1, 2, 10)*
- `src/pages/blog/[slug].astro` with `getStaticPaths`
- Date + "See all posts" link, h1 title, optional banner, prose-styled markdown body
- Share links: Twitter, LinkedIn, copy-URL
- OG: banner image or default fallback, `og:type=article`, article meta tags
- `BlogPosting` Schema.org JSON-LD

**Task 6: Add blog preview section to homepage** *(needs Task 1)*
- New `#blog` section in `index.astro` between Blockchain and Creative
- All published posts as date + linked title
- "View all posts" link to `/blog`

### Phase 3 — Navigation (depends on Phase 2)

**Task 7: Add Blog to navigation** *(needs Task 6)*
- Add "Blog" link to BaseLayout nav (after Blockchain, before Creative)
- Fix all nav links to be context-aware: `#anchor` on homepage, `/#anchor` on other pages
- Update both desktop and mobile menus

### Phase 4 — Verification

**Task 9: Verify build, IPFS compatibility, and SEO** *(needs all above)*
- `npm run build` succeeds
- Pages generate correctly with relative paths
- Sitemap includes blog pages
- OG tags correct per-post (article type, published_time, tags)
- BlogPosting schema renders
- Share links functional
- Client-side tag filtering and search work
- Build size under 3MB
- Update CLAUDE.md with blog documentation
