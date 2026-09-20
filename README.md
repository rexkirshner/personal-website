# Rex Kirshner's personal website

Source for [rexkirshner.com](https://rexkirshner.com), built as a static Astro site.

The same build is published through two delivery paths:

- Cloudflare Pages serves `rexkirshner.com`.
- Pinata/IPFS serves the ENS gateways at `rexkirshner.eth.limo` and `logrex.eth.limo`.

## Repository and custody

- Canonical source: private Forgejo repository `lab/personal-website`.
- Deployment mirror: [GitHub](https://github.com/rexkirshner/personal-website).
- Project custody details: [`CUSTODY.md`](./CUSTODY.md).
- Raw photo exports and other external source media are kept outside Git in the Source Vault. Generated site assets and structured site content remain in this repository.

Forgejo is the source-of-truth repository. GitHub exists because Cloudflare Pages and the IPFS workflow deploy from its `main` branch.

## Stack

- Astro 5
- Tailwind CSS 4
- Sharp for image processing
- MapLibre GL for the travel map
- Cloudflare Pages and R2
- Pinata/IPFS and ENS
- Vimeo for video hosting

## Local development

Node.js 20 or newer and npm are recommended.

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:4321`.

Build and preview the production output with:

```bash
npm run build
npm run preview
```

The static build is written to `dist/`.

## Project layout

```text
content/
  blog/             Blog posts in Markdown
  ethereum/         Ethereum project metadata
  expansion/        Expansion podcast metadata
  photography/      Photo metadata; image bytes live in R2
  running/          Running statistics and narrative
  site/             Site-wide metadata and profile photos
  travel/           Generated travel-map data
  videos/           Video metadata
doc/planning/       Authoring and implementation notes
public/             Static assets shipped with the site
scripts/            Content, image, deployment, and ENS utilities
src/components/     Reusable Astro components
src/layouts/        Shared page layout
src/pages/          Homepage, blog, contact, and podcast routes
```

## Common maintenance

### Blog posts

Create Markdown files in `content/blog/`. The filename becomes the URL slug. Do not repeat the post title as an H1 in the body; the template renders it from frontmatter.

Blog images are hosted at `cdn.rexkirshner.com/blog/` so the same content works through Cloudflare and IPFS. See [`doc/planning/blog-content-guide.md`](./doc/planning/blog-content-guide.md) for the content format.

### Photos

Original exports belong in the ignored `content export/photos/` directory and the Source Vault, not Git. The normal workflow is:

```bash
npm run generate-thumbnails
npm run upload-photos
npm run update-photos-json
npm run add-photo-metadata   # optional
npm run build
```

The upload commands require the local ignored environment configuration. Never commit credentials.

### Running statistics

```bash
npm run update-running-stats
npm run build
```

The updater fetches the activity-data API, validates the response, and rewrites `content/running/stats.json`.

### Travel map

Place the TravelersPoint KML export at the path documented in `AGENTS.md`, then run:

```bash
npm run update-travel-map
npm run build
```

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Astro development server |
| `npm run build` | Build the production site into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run update-running-stats` | Refresh running statistics |
| `npm run update-travel-map` | Regenerate travel-map data from KML |
| `npm run generate-thumbnails` | Generate responsive photo thumbnails |
| `npm run upload-photos` | Upload photo assets to Cloudflare R2 |
| `npm run update-photos-json` | Update R2 URLs in photo metadata |
| `npm run update-ens -- --dry-run` | Preview an ENS contenthash update |
| `npm run update-ens -- <CID>` | Set the configured ENS names to a specific IPFS CID |

## Deployment

Deployment is intentionally split between the two remotes:

1. Push the completed commit to canonical Forgejo.
2. Push the same `main` commit to GitHub.
3. Cloudflare Pages automatically builds and deploys `dist/` to `rexkirshner.com`.
4. `.github/workflows/deploy.yml` builds the site, fixes paths for IPFS, and pins the result to Pinata.
5. Compare the workflow's CID with the current ENS contenthash. If it changed, run `npm run update-ens` and verify both `.eth.limo` gateways.

Updating ENS writes to Ethereum mainnet and spends gas. Run the dry-run first and do not send a transaction without explicit approval.

The expected production checks are:

- `https://rexkirshner.com`
- `https://rexkirshner.eth.limo`
- `https://logrex.eth.limo`
- successful Cloudflare Pages and GitHub Actions deployments for the deployed commit

## Performance requirements

- Lighthouse Performance, Accessibility, and Best Practices: at least 95
- Cold load through `.eth.limo`: no more than 2.5 seconds on 4G
- Keep JavaScript minimal and lazy-load heavy dependencies
- Use WebP for locally built image assets

## Operational references

- `AGENTS.md` and `CLAUDE.md`: detailed architecture and maintenance instructions
- `CUSTODY.md`: preservation authority and Source Vault cross-reference
- `.github/workflows/deploy.yml`: IPFS deployment workflow
- `scripts/update-ens.js`: ENS contenthash updater

## License

Personal project. All rights reserved.
