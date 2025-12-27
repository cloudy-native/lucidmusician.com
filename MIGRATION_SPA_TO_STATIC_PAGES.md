# Migration Plan: SPA  Regular Pages (Static HTML per route)

This document captures the plan to migrate `lucidmusician.com` from a React SPA (React Router) to a static, multi-page site where each URL resolves to a real HTML file in `dist/`.

## Goals

- Make deep links like `/docs` work without special CloudFront SPA fallbacks.
- Improve SEO and sharing (per-page HTML, metadata, previews).
- Reduce client-side JavaScript where possible.
- Keep the ability to use React components for interactive sections.

## Recommended Approach

Use an SSG that outputs **real HTML per route**. The recommended tool is **Astro**:

- Generates `dist/docs/index.html`, `dist/blog/<slug>/index.html`, etc.
- Excellent Markdown support (blog/docs).
- Supports React components as islands when needed.
- Typically simpler than doing multi-page output manually with Vite + React.

(Alternative: Next.js in SSG mode. Heavier, but also viable.)

## Target Route / Output Structure

Example desired mappings:

- `/` -> `dist/index.html`
- `/docs` -> `dist/docs/index.html`
- `/blog` -> `dist/blog/index.html`
- `/blog/modeling-harmonies` -> `dist/blog/modeling-harmonies/index.html`

This ensures direct navigation works because the file exists.

## Migration Steps (Suggested Sequence)

### Phase 0: Prep / Decisions

- Decide whether `/docs` remains a single long page (`docs.md`) or becomes multiple pages.
- Decide whether to keep the current styling stack (Tailwind + HeroUI) in the new setup.
- Decide whether you want RSS/sitemap/tags for blog.

### Phase 1: Create the New Static Site Skeleton

- Add Astro project configuration next to the existing SPA.
- Keep the SPA intact during migration.

Outcome:
- `astro build` produces a `dist/` with real HTML routes.

### Phase 2: Migrate Markdown Content First (Highest ROI)

Source content today:

- `public/content/docs.md`
- `public/content/blog/*.md`

Plan:

- Configure Astro to treat these markdown files as content sources.
- Generate pages:
  - `/docs`
  - `/blog`
  - `/blog/<slug>`
- Ensure existing markdown features are supported:
  - KaTeX math
  - Code fences
  - GitHub-style admonitions (`> [!NOTE]`, `> [!TIP]`, etc.)
  - External links open in a new tab

Outcome:
- Blog/docs are static and SEO-friendly.

### Phase 3: Recreate Layout and Navigation

- Recreate the current site layout (navbar, footer, consistent spacing) using Astro layouts.
- Convert navbar links from React Router to normal anchors:
  - `<a href="/docs">Docs</a>`
  - `<a href="/blog">Blog</a>`

Outcome:
- Clicking links loads normal pages.

### Phase 4: Migrate Homepage + Interactive Pieces

- Migrate the homepage sections.
- Decide how to handle small interactive bits:
  - Lightbox: either lightweight vanilla JS or a React island
  - SoundCloud samples grid: can be static HTML iframe output or a React island

Recommendation:
- Prefer **static HTML** where possible; use islands only when interaction is required.

Outcome:
- Homepage matches design, minimal JS.

### Phase 5: Remove SPA-only Infrastructure

- Remove React Router and SPA-only routing.
- Remove SPA fallback assumptions.

Outcome:
- The app is now a static multi-page site.

## Deployment Changes (CloudFront + S3)

When routes are real HTML files:

- Keep CloudFront `defaultRootObject: "index.html"`.
- Remove/avoid SPA fallback rules (`403/404 -> /index.html`) unless you intentionally want that behavior.
- Provide a real `404.html` page (optional but recommended).

Notes:
- With S3 behind CloudFront as an S3 REST origin (OAI/OAC), S3 website error document settings do not act as a router. CloudFront must serve what exists.

## Redirect / Compatibility Plan

- Try to keep URLs identical during migration.
- If URLs must change, add redirects:
  - CloudFront Function / Lambda@Edge
  - or a static redirects file (depending on hosting approach)

## Verification Checklist

- Direct-load these URLs in a private window:
  - `/`
  - `/docs`
  - `/blog`
  - `/blog/<some-slug>`
- Confirm 404 behavior is correct:
  - `/this-should-not-exist` returns real 404 page
- Confirm external links:
  - open new tab
- Confirm markdown features:
  - KaTeX
  - code fences
  - admonitions

## Open Questions (fill in later)

- Should `/docs` become multi-page docs?
- Do we want RSS + sitemap generation?
- Should blog posts include per-page OpenGraph metadata?
- Do we want client-side search for docs/blog?
