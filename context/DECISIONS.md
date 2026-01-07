# DECISIONS.md

**Decision log** - WHY choices were made. **Critical for AI agent review and takeover.**

**For current status:** See `STATUS.md`
**For session history:** See `SESSIONS.md`

---

## Why This File Exists

AI agents reviewing your code need to understand:
- **WHY** you made certain technical choices
- What **constraints** influenced decisions
- What **alternatives** you considered and rejected
- What **tradeoffs** you accepted

This file captures the reasoning that isn't obvious from code alone.

---

## Active Decisions

| ID | Title | Date | Status |
|----|-------|------|--------|
| D001 | Static Site with Astro | 2024-09 | Accepted |
| D002 | Dual Deployment (CDN + IPFS) | 2024-09 | Accepted |
| D003 | Photos on Cloudflare R2 | 2024-10 | Accepted |
| D004 | Lazy-load Travel Map | 2024-10 | Accepted |
| D005 | Keep comprehensive CLAUDE.md | 2026-01 | Accepted |

---

## D001 - Static Site with Astro

**Date:** 2024-09
**Status:** Accepted

### Context

Need a personal portfolio that's fast, simple to maintain, and works on decentralized hosting (IPFS). Must handle photo galleries, video embeds, and interactive elements while keeping build size small.

### Decision

Use Astro v5 as a static site generator with minimal JavaScript.

### Rationale

**Key factors:**
- Zero JS by default - only loads when needed for interactivity
- Content-driven architecture fits JSON/Markdown workflow
- Great performance out of the box
- Works perfectly with IPFS (static HTML files)

### Alternatives Considered

1. **Next.js**
   - Pros: Full-featured, great DX, SSR capabilities
   - Cons: Heavier runtime, more complex for static sites, overkill for portfolio
   - Why not: Don't need SSR, want minimal JS bundle

2. **Plain HTML/CSS**
   - Pros: Maximum simplicity, zero build step
   - Cons: No components, no templating, harder to maintain
   - Why not: Would require duplicating layout across pages

### Tradeoffs Accepted

- We gain: Minimal JS, fast builds, excellent IPFS compatibility
- We give up: Dynamic features, SSR capabilities

---

## D002 - Dual Deployment (CDN + IPFS)

**Date:** 2024-09
**Status:** Accepted

### Context

Want the site accessible via both traditional web (fast, reliable) and decentralized web (censorship-resistant, crypto-native audience via ENS domains).

### Decision

Deploy to Cloudflare Pages (primary) and IPFS via Pinata (decentralized).

### Rationale

- Cloudflare Pages for fast global CDN access at rexkirshner.com
- IPFS for .eth.limo access (logrex.eth, rexkirshner.eth)
- GitHub Actions automates both deployments
- Same static build works for both

### Consequences

**Positive:**
- Reaches both audiences
- Site survives if either platform goes down
- ENS integration for crypto community

**Negative:**
- Must maintain relative paths for IPFS compatibility
- ENS contenthash requires manual update after IPFS deploy
- Need to test both deployment targets

---

## D003 - Photos on Cloudflare R2

**Date:** 2024-10
**Status:** Accepted

### Context

Photo gallery has many high-resolution images. Can't include in git repo (too large) or build output (exceeds IPFS practical limits).

### Decision

Host all photos on Cloudflare R2 at cdn.rexkirshner.com. Store only URLs in photos.json.

### Rationale

- R2 is cost-effective for bandwidth
- CDN performance globally
- Keeps repo and build size small (<3MB target)
- Thumbnails in WebP format for performance

### Tradeoffs Accepted

- We gain: Fast photo loading, small build, easy photo management
- We give up: Full decentralization (R2 is centralized), dependency on Cloudflare

**For AI agents:** Photos are NOT in the repo. If you need to add photos, use the upload scripts. See CLAUDE.md "Photo Management Workflow".

---

## D004 - Lazy-load Travel Map

**Date:** 2024-10
**Status:** Accepted

### Context

MapLibre GL is 1.5MB+ with dependencies. Loading it on page load destroys performance for users who never open the map.

### Decision

Lazy-load MapLibre only when user clicks "View Travel Map" toggle.

### Rationale

- Most visitors don't interact with the map
- 1.5MB is significant on slow connections (IPFS gateways)
- Dynamic import pattern works well with Astro

### Implementation

```javascript
// In index.astro - map only loads on toggle click
const initMap = (window as any).__initTravelMap;
if (initMap) {
  await initMap(); // Dynamic import happens inside
}
```

**For AI agents:** Never move MapLibre to static imports. The lazy-load pattern is critical for IPFS performance.

---

## D005 - Keep Comprehensive CLAUDE.md

**Date:** 2026-01-06
**Status:** Accepted

### Context

Installing AI Context System (ACS). Project already has a comprehensive CLAUDE.md (19KB) with architecture, patterns, workflows, and constraints.

### Decision

Keep existing CLAUDE.md as the primary project reference. ACS supplements it with session state (STATUS.md, SESSIONS.md) rather than replacing it.

### Rationale

- CLAUDE.md is well-structured and complete
- Duplicating content in CONTEXT.md would create maintenance burden
- ACS adds value for session continuity, not orientation
- Less bloat by avoiding duplication

### Tradeoffs Accepted

- We gain: No duplication, existing docs preserved
- We give up: Strict adherence to ACS template structure

**For AI agents:** Read CLAUDE.md first for architecture and patterns. Use context/ files for session state and decisions.

---

## Superseded Decisions

| ID | Title | Date | Superseded By | Reason |
|----|-------|------|---------------|--------|
| - | - | - | - | - |

---

## Guidelines for AI Agents

When reviewing this file:
1. **Respect the context** - Decisions were made with specific constraints
2. **Check for changes** - Have triggers occurred that warrant reconsideration?
3. **Understand tradeoffs** - Don't suggest alternatives without acknowledging accepted tradeoffs
4. **Consider evolution** - Projects evolve, early decisions may need revisiting
5. **Ask before suggesting reversals** - Major architectural changes need user approval

When taking over development:
1. Read ALL decisions before making architectural changes
2. Understand WHY current approach exists
3. Check "When to Reconsider" sections for current relevance
4. Respect constraints that may still apply
5. Document new decisions in same format
