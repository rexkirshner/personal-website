# SEO Audit Report

| Field | Value |
|-------|-------|
| Date | 2025-12-19 |
| Repository | personal-website |
| Framework | Astro 5.x |
| Rendering | SSG (Static Site Generation) |

**Assumptions:**
- DNS for rexkirshner.com is fully propagated (comment in code suggests it may not be)
- All three domains (rexkirshner.com, logrex.eth.limo, rexkirshner.eth.limo) are active
- Cloudflare Pages handles proper HTTP status codes (404s, redirects)
- IPFS deployment via GitHub Actions is working correctly

---

## Executive Summary

**Overall Health: Good** - The site has a solid SEO foundation with proper meta tags, structured data, and accessibility features. However, several issues need attention:

- **OG image points to wrong domain** - Using logrex.eth.limo instead of primary domain rexkirshner.com
- **Expansion page missing H1** - Only has H2 heading, which hurts page hierarchy
- **JSON-LD syntax issue** - ExpansionLayout uses unescaped JSON.stringify in script tag
- **No skip link** - Missing accessibility feature for keyboard navigation
- **Video modal breaks on mobile** - Hardcoded min-width: 600px
- **Good practices in place**: Canonical URLs, hreflang alternates, responsive images, lazy loading, resource hints, comprehensive OG/Twitter cards
- **Structured data present**: Person schema on main page, PodcastSeries on Expansion page
- **Missing schemas**: WebSite, BreadcrumbList, Organization

---

## Methodology

### Discovery Process
1. Read `package.json` to identify framework (Astro 5.x) and dependencies
2. Read `astro.config.mjs` to understand build configuration and integrations
3. Enumerated pages via glob pattern `src/pages/**/*.astro`
4. Inspected layouts (`BaseLayout.astro`, `ExpansionLayout.astro`) for SEO meta tags
5. Read `robots.txt` and verified sitemap configuration
6. Analyzed component accessibility (alt text, aria-labels, keyboard support)
7. Reviewed heading structure across all pages

### Files Inspected
- `package.json`, `astro.config.mjs`
- `src/pages/index.astro`, `src/pages/expansion.astro`
- `src/layouts/BaseLayout.astro`, `src/layouts/ExpansionLayout.astro`
- `src/components/PhotoGallery.astro`, `VideoGallery.astro`, `ExpansionGrid.astro`, `RunningStats.astro`
- `public/robots.txt`
- `content/site/meta.json`, `content/expansion/meta.json`
- `content/site/profile-pics.json`
- All files in `public/` directory

### What Couldn't Be Verified
- Live sitemap XML output (would require running build)
- Actual HTTP status codes (404 behavior, redirects)
- IPFS gateway accessibility and load times
- Google Search Console data
- Core Web Vitals metrics from real users

---

## Findings Table

| Priority | Issue | Impact | Location |
|----------|-------|--------|----------|
| P0 | OG image uses wrong domain (logrex.eth.limo) | HIGH - Social shares show wrong domain | `src/layouts/BaseLayout.astro:25` |
| P0 | ExpansionLayout JSON-LD not properly escaped | HIGH - May cause parsing errors | `src/layouts/ExpansionLayout.astro:61-75` |
| P1 | Expansion page missing H1 heading | MEDIUM - Hurts page hierarchy for SEO | `src/pages/expansion.astro` |
| P1 | No skip link for accessibility | MEDIUM - Keyboard users can't skip nav | `src/layouts/BaseLayout.astro` |
| P1 | Profile images have generic alt text | MEDIUM - Missed keyword opportunity | `src/pages/index.astro:31` |
| P1 | Video modal min-width breaks mobile | MEDIUM - Poor mobile UX | `src/components/VideoGallery.astro:218` |
| P1 | Missing og:image dimensions | LOW-MEDIUM - Slower social card rendering | `src/layouts/BaseLayout.astro` |
| P1 | hreflang without x-default | LOW-MEDIUM - May confuse search engines | `src/layouts/BaseLayout.astro:72-74` |
| P2 | Missing WebSite schema | LOW - Missed sitelinks searchbox opportunity | `src/layouts/BaseLayout.astro` |
| P2 | Missing BreadcrumbList schema | LOW - No rich breadcrumb results | `src/layouts/ExpansionLayout.astro` |
| P2 | No Organization schema | LOW - Missed knowledge panel opportunity | `src/layouts/BaseLayout.astro` |
| P2 | Running video uses external CDN image | LOW - No control over availability | `src/pages/index.astro:369` |

---

## Detailed Recommendations

### P0: Metadata: OG Image Uses Wrong Domain

**Current state:** Line 25 in `src/layouts/BaseLayout.astro`:
```javascript
const fullOgImageURL = ogImageURL.startsWith('http') ? ogImageURL : `https://logrex.eth.limo${ogImageURL}`;
```
Comment says "Use logrex.eth.limo for OG image until rexkirshner.com DNS propagates"

**Why it matters:** Social shares on Twitter, LinkedIn, Facebook will show logrex.eth.limo as the source, which is confusing for users and dilutes brand recognition. OG images should match the canonical domain.

**Recommendation:** Update to use primary domain:
```javascript
const fullOgImageURL = ogImageURL.startsWith('http') ? ogImageURL : `https://rexkirshner.com${ogImageURL}`;
```

**Where:** `src/layouts/BaseLayout.astro:25`

**Acceptance criteria:**
- Run `npm run build`
- Check `dist/index.html` for `<meta property="og:image" content="https://rexkirshner.com/images/og-image.jpg">`

---

### P0: Structured Data: ExpansionLayout JSON-LD Syntax Issue

**Current state:** Lines 61-75 in `src/layouts/ExpansionLayout.astro`:
```html
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    ...
  })}
</script>
```

This outputs literal `{JSON.stringify({...})}` text instead of actual JSON.

**Why it matters:** Invalid JSON-LD will be ignored by search engines. The PodcastSeries schema won't be recognized, missing rich result opportunities.

**Recommendation:** Use Astro's `set:html` directive:
```html
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  ...
})} />
```

**Where:** `src/layouts/ExpansionLayout.astro:61-75`

**Acceptance criteria:**
- Run `npm run build`
- Check `dist/expansion.html` contains valid JSON-LD (parseable by `JSON.parse()`)
- Validate at https://validator.schema.org/

---

### P1: Content Architecture: Expansion Page Missing H1

**Current state:** `src/pages/expansion.astro` has no H1 element. The first heading is H2 "All Episodes" at line 90.

**Why it matters:** Every page should have exactly one H1 that describes the page content. Search engines use H1 as a strong signal for page topic. Missing H1 can hurt rankings.

**Recommendation:** Add H1 heading in the hero section after the banner:
```html
<h1 class="text-4xl font-bold text-white text-center mb-4">Expansion Podcast</h1>
```
Then change "All Episodes" from H2 to remain H2 (as it's a subsection).

**Where:** `src/pages/expansion.astro:42` (inside the content section below banner)

**Acceptance criteria:**
- Page has exactly one H1 element
- H1 contains primary keyword "Expansion Podcast"
- Heading hierarchy is H1 > H2 (no skipped levels)

---

### P1: Accessibility: No Skip Link

**Current state:** `src/layouts/BaseLayout.astro` has a fixed navigation but no skip link for keyboard users.

**Why it matters:** Skip links allow keyboard and screen reader users to bypass repetitive navigation. Required for WCAG 2.1 Level A compliance. Also affects SEO as accessibility is a ranking factor.

**Recommendation:** Add skip link as first element in body:
```html
<body class="min-h-screen bg-white text-gray-900">
  <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:rounded">
    Skip to main content
  </a>
  <!-- Navigation -->
```
And add `id="main-content"` to the main element:
```html
<main id="main-content" class="pt-16">
```

**Where:** `src/layouts/BaseLayout.astro:112-113` and `:151`

**Acceptance criteria:**
- Tab to page shows visible "Skip to main content" link
- Clicking/activating link focuses main content area
- Link is visually hidden until focused

---

### P1: Metadata: Profile Images Have Generic Alt Text

**Current state:** `src/pages/index.astro:31`:
```html
alt={`Rex Kirshner profile ${index + 1}`}
```
Results in "Rex Kirshner profile 1", "Rex Kirshner profile 2", etc.

**Why it matters:** Alt text should be descriptive of the image content, not just a label. Better alt text improves accessibility and provides keyword context for image SEO.

**Recommendation:** Update `content/site/profile-pics.json` to include descriptive alt text:
```json
{
  "id": "profile-1",
  "alt": "Rex Kirshner portrait in professional attire"
}
```
Then use the alt from JSON in the component.

**Where:** `content/site/profile-pics.json` and `src/pages/index.astro:31`

**Acceptance criteria:**
- Each profile image has unique, descriptive alt text
- Alt text describes what's visible in the image

---

### P1: Performance: Video Modal Breaks on Mobile

**Current state:** `src/components/VideoGallery.astro:218`:
```css
#video-embed-container {
  min-width: 600px;
}
```

**Why it matters:** On mobile screens (< 600px), this causes horizontal overflow, breaking the layout and creating a poor user experience. Mobile-friendliness is a ranking factor.

**Recommendation:** Remove min-width or use responsive value:
```css
#video-embed-container {
  min-width: min(600px, 100%);
}
```
Or simply remove the min-width constraint.

**Where:** `src/components/VideoGallery.astro:218`

**Acceptance criteria:**
- Video modal displays correctly on 375px width (iPhone SE)
- No horizontal scrolling in modal
- Video maintains 16:9 aspect ratio

---

### P1: Metadata: Missing OG Image Dimensions

**Current state:** OG image tags don't include width/height:
```html
<meta property="og:image" content={fullOgImageURL} />
```

**Why it matters:** Including dimensions allows social platforms to render cards faster without fetching the image first. Improves perceived performance of shares.

**Recommendation:** Add dimension meta tags:
```html
<meta property="og:image" content={fullOgImageURL} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

**Where:** `src/layouts/BaseLayout.astro:54` (after og:image tag)

**Acceptance criteria:**
- OG image dimensions present in HTML output
- Values match actual og-image.jpg dimensions (verify with image tool)

---

### P1: Indexability: hreflang Without x-default

**Current state:** `src/layouts/BaseLayout.astro:72-74`:
```html
<link rel="alternate" href="https://rexkirshner.com" hreflang="en" />
<link rel="alternate" href="https://logrex.eth.limo" hreflang="en" />
<link rel="alternate" href="https://rexkirshner.eth.limo" hreflang="en" />
```

**Why it matters:** The `x-default` value tells search engines which URL to show for users whose language doesn't match any hreflang. Without it, search engines may pick arbitrarily.

**Recommendation:** Add x-default pointing to primary domain:
```html
<link rel="alternate" href="https://rexkirshner.com" hreflang="x-default" />
<link rel="alternate" href="https://rexkirshner.com" hreflang="en" />
<link rel="alternate" href="https://logrex.eth.limo" hreflang="en" />
<link rel="alternate" href="https://rexkirshner.eth.limo" hreflang="en" />
```

**Where:** `src/layouts/BaseLayout.astro:72`

**Acceptance criteria:**
- `x-default` hreflang present in HTML output
- Points to primary domain (rexkirshner.com)

---

### P2: Structured Data: Missing WebSite Schema

**Current state:** Only Person schema exists. No WebSite schema for sitelinks searchbox.

**Why it matters:** WebSite schema with SearchAction can enable sitelinks searchbox in Google results. Also provides additional context about the website.

**Recommendation:** Add WebSite schema to BaseLayout:
```javascript
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Rex Kirshner",
  "url": "https://rexkirshner.com",
  "description": description,
  "author": {
    "@type": "Person",
    "name": "Rex Kirshner"
  }
}
```

**Where:** `src/layouts/BaseLayout.astro:77` (as separate script block or combined with Person)

**Acceptance criteria:**
- WebSite schema present in HTML output
- Validates at https://validator.schema.org/

---

### P2: Structured Data: Missing BreadcrumbList Schema

**Current state:** Expansion page has no breadcrumb schema.

**Why it matters:** BreadcrumbList schema can enable breadcrumb rich results in Google, improving CTR and showing site hierarchy.

**Recommendation:** Add to ExpansionLayout:
```javascript
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://rexkirshner.com"
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "Expansion Podcast",
    "item": "https://rexkirshner.com/expansion"
  }]
}
```

**Where:** `src/layouts/ExpansionLayout.astro:75`

**Acceptance criteria:**
- BreadcrumbList schema present on expansion page
- Validates at https://validator.schema.org/

---

## Decisions Needed

1. **OG Image Domain**: Confirm rexkirshner.com DNS is propagated and can be used for OG images
2. **Profile Photo Alt Text**: Need descriptive alt text for each of the 3 profile images
3. **Expansion Page H1**: Confirm desired H1 text (suggest "Expansion Podcast" or "Expansion Podcast Episodes")
4. **hreflang Strategy**: Are all 3 domains intended to be indexed, or should .eth.limo domains have noindex?
5. **WebSite Schema SearchAction**: Should a search box be enabled (requires backend search functionality)?
6. **Video Thumbnail Strategy**: Host video thumbnails locally vs continue using Vimeo CDN?
7. **404 Page**: Does a custom 404 page exist? Should one be created?
8. **Podcast Episode Schema**: Should individual episodes have PodcastEpisode schema?

---

## Implementation Roadmap

### Phase 1: Quick Wins (< 1 day each)

1. **Fix OG image domain** - Change logrex.eth.limo to rexkirshner.com in BaseLayout
2. **Add OG image dimensions** - Add width/height meta tags
3. **Add hreflang x-default** - Single line addition
4. **Fix ExpansionLayout JSON-LD** - Change to use set:html directive
5. **Remove video modal min-width** - CSS change

### Phase 2: Medium Effort (1-3 days each)

1. **Add skip link** - HTML + CSS changes, testing
2. **Add H1 to Expansion page** - Content decision + implementation
3. **Update profile image alt text** - JSON update + template change
4. **Add WebSite schema** - New structured data block

### Phase 3: Larger Efforts (3+ days)

1. **Add BreadcrumbList schema** - Requires navigation structure analysis
2. **Implement PodcastEpisode schema for all 35 episodes** - Significant structured data work
3. **Host video thumbnails locally** - Download, optimize, update references
4. **Create custom 404 page** - Design, implementation, testing on all domains

---

## Appendix

### Route Inventory

| Route | Type | Template File |
|-------|------|---------------|
| `/` | Static | `src/pages/index.astro` |
| `/expansion` | Static | `src/pages/expansion.astro` |

### Section Anchors (index.astro)

| Anchor | Section |
|--------|---------|
| `#home` | About/Profile |
| `#consulting` | Consulting |
| `#ethereum` | Blockchain Projects |
| `#creative` | Creative (Videos, Photos, Travel Map) |
| `#running` | Running Journey |
| `#contact` | Footer |

### Files Inspected

```
package.json
astro.config.mjs
public/robots.txt
src/pages/index.astro
src/pages/expansion.astro
src/layouts/BaseLayout.astro
src/layouts/ExpansionLayout.astro
src/components/PhotoGallery.astro
src/components/VideoGallery.astro
src/components/ExpansionGrid.astro
src/components/ExpansionLightbox.astro
src/components/RunningStats.astro
content/site/meta.json
content/site/profile-pics.json
content/expansion/meta.json
content/ethereum/projects.json
```

### Verification Commands (for team reference)

```bash
# Build and check HTML output
npm run build
cat dist/index.html | grep -A2 'og:image'
cat dist/expansion.html | grep 'application/ld+json'

# Validate structured data
npx structured-data-testing-tool dist/index.html

# Check for H1 tags
grep -n '<h1' dist/*.html

# Test mobile viewport
npx lighthouse https://rexkirshner.com --only-categories=accessibility,seo

# Validate hreflang
curl -s https://rexkirshner.com | grep hreflang
```
