/**
 * Astro Content Collections Configuration
 *
 * This is the first content collection in the project. All other content
 * (videos, photos, projects, etc.) uses raw JSON imports. The blog uses
 * content collections because they provide:
 * - Schema validation via Zod for frontmatter
 * - Built-in markdown rendering
 * - Type-safe data access
 * - Automatic slug generation from filenames
 *
 * Blog content lives at /content/blog/ (project root, not src/) for
 * consistency with all other content directories. The glob loader is
 * configured with an explicit base path to support this.
 *
 * To add a new blog post, create a .md file in /content/blog/ with the
 * required frontmatter fields. See /doc/planning/blog-content-guide.md for details.
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: z.object({
    /** Post title displayed as h1 and in meta tags */
    title: z.string(),
    /** Publication date (used for sorting and article:published_time) */
    date: z.coerce.date(),
    /** Short description for listings, search, and meta description */
    description: z.string(),
    /** Tags for filtering (e.g., ["ethereum", "running", "travel"]) */
    tags: z.array(z.string()).default([]),
    /** Optional banner image path (also used as OG image if present) */
    image: z.string().optional(),
    /** Set to true to exclude from published listings */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
