# Blog Content Guide

Blog posts are Markdown files with YAML frontmatter. Each `.md` file in
`/content/blog/` becomes a page at `/blog/<filename-without-extension>`.

## Creating a New Post

Create a `.md` file with this frontmatter:

```yaml
---
title: "Your Post Title"
date: 2026-03-10
description: "A short description for listings and social sharing."
tags: ["ethereum", "travel"]
image: "https://cdn.rexkirshner.com/blog/your-banner.webp"  # optional, must be R2 URL
draft: false                                                  # optional, defaults to false
---

Your markdown content here...
```

## Required Fields

| Field         | Type     | Description                                      |
|---------------|----------|--------------------------------------------------|
| `title`       | string   | Post title (h1 and meta tags)                    |
| `date`        | date     | Publication date (YYYY-MM-DD)                    |
| `description` | string   | Short summary for listings, search, and OG tags  |

## Optional Fields

| Field   | Type     | Default | Description                                |
|---------|----------|---------|--------------------------------------------|
| `tags`  | string[] | `[]`    | Tags for filtering on /blog                |
| `image` | string   | —       | Banner image R2 URL (also used as OG image)|
| `draft` | boolean  | `false` | If true, excluded from published listings  |

## File Naming

The filename (minus `.md`) becomes the URL slug:
- `my-first-post.md` → `/blog/my-first-post`
- Use lowercase with hyphens
- Keep slugs short and descriptive

## Content Conventions

### No duplicate title
Do **not** include a `# Title` heading in the markdown body. The template already renders the title from frontmatter as an `<h1>`. Adding one in the body creates duplicate headings (bad for accessibility and SEO).

### Twitter/X handles
`@handles` are automatically converted to profile links by the `remarkTwitterHandles` remark plugin. Write `@CurveCap` in markdown and it renders as [CurveCap](https://x.com/CurveCap) — no manual linking needed. The `@` sign is removed in the rendered output.

- Works in any text node (paragraphs, blockquotes, list items)
- Skipped inside links, code blocks, and inline code
- Handles must be 1–15 characters: letters, numbers, underscores

### Blockquotes
Use standard markdown blockquotes (`>`). Do **not** wrap the text in double quotes — the blockquote formatting already denotes a quotation.

```markdown
# Good
> The metric ate the meaning.

# Bad
> "The metric ate the meaning."
```

### Cross-posted content
If the post originally appeared elsewhere, add an italic attribution line at the top of the body (after frontmatter, before content):

```markdown
*Original Appearance: <a href="https://x.com/your/status/url" target="_blank" rel="noopener noreferrer">Twitter</a>*
```

Uses inline HTML so the link opens in a new tab (markdown links don't support `target="_blank"`).

## Images

- **All blog images must be hosted on Cloudflare R2** — never in the local build
- Upload to the `blog/` folder in the `rexkirshner-com` R2 bucket via `npx wrangler r2 object put`
- Use WebP format for best compression
- Reference as full R2 CDN URL: `https://cdn.rexkirshner.com/blog/filename.webp`
- Banner images go in the `image` frontmatter field
- Inline images in post body use standard Markdown: `![alt text](https://cdn.rexkirshner.com/blog/image.webp)`
- Images must NOT be stored locally because the site is pinned to IPFS and large images bloat the build

## Schema Validation

Frontmatter is validated by Zod schema in `/src/content.config.ts`. The build will
fail if required fields are missing or types are wrong — this is intentional.

## Post Template Features

Every blog post automatically gets (via `blog/[slug].astro`):
- Title rendered as `<h1>` from frontmatter
- Formatted date and "See all posts" link
- Share button (top-right) with dropdown: Twitter, LinkedIn, Copy Link
- Banner image (if `image` field is set)
- Tag display
- Full SEO: Open Graph article tags, BlogPosting Schema.org JSON-LD
- Twitter handle auto-linking via remark plugin
- Prose styling via `@tailwindcss/typography`
