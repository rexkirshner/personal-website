# Blog Content

Blog posts are Markdown files with YAML frontmatter. Each `.md` file in this
directory becomes a page at `/blog/<filename-without-extension>`.

## Creating a New Post

Create a `.md` file with this frontmatter:

```yaml
---
title: "Your Post Title"
date: 2026-03-10
description: "A short description for listings and social sharing."
tags: ["ethereum", "travel"]
image: "/images/blog/your-banner.webp"  # optional
draft: false                             # optional, defaults to false
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
| `image` | string   | —       | Banner image path (also used as OG image)  |
| `draft` | boolean  | `false` | If true, excluded from published listings  |

## File Naming

The filename (minus `.md`) becomes the URL slug:
- `my-first-post.md` → `/blog/my-first-post`
- Use lowercase with hyphens
- Keep slugs short and descriptive

## Images

- Place banner images in `/public/images/blog/`
- Use WebP format for best compression
- Reference as `/images/blog/filename.webp` in frontmatter
- Inline images in post body use standard Markdown: `![alt text](/images/blog/image.webp)`

## Schema Validation

Frontmatter is validated by Zod schema in `/content.config.ts`. The build will
fail if required fields are missing or types are wrong — this is intentional.
