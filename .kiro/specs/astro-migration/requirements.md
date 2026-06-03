# Astro Migration Requirements

## Overview
Migrate lucidmusician.com from a Vite + React SPA to Astro static site generator. All content, styling, and functionality must be preserved. No legacy Vite/React artifacts should remain.

## Requirements

### 1. Framework & Build
- Use Astro with static output (SSG)
- Tailwind CSS 4 for styling (matching existing design)
- React integration for interactive islands only (lightbox, conversion tracking)
- Markdown/MDX content collection for blog, docs, release notes, roadmap, support
- Built-in sitemap generation via @astrojs/sitemap
- Deploy target: AWS S3 + CloudFront (existing CDK stack)

### 2. Pages to Recreate
- `/` — Homepage (hero, video embeds, features, how-it-works, audio samples, CTA)
- `/docs` — Documentation (from markdown)
- `/support` — Support page (from markdown)
- `/release-notes` — Release notes (from markdown)
- `/roadmap` — Roadmap (from markdown)
- `/blog` — Blog index listing all posts
- `/blog/[slug]` — Individual blog articles (from markdown)
- `/about` — Team page
- `/beta` — Beta downloads page (from JSON data)
- `404` — Custom not-found page

### 3. SEO (Built-in, no hacks)
- Per-page title, description, canonical URL via Astro frontmatter/layouts
- Open Graph + Twitter Card meta tags on every page
- JSON-LD structured data (SoftwareApplication) on homepage
- Auto-generated sitemap.xml
- robots.txt
- Proper favicon + apple-touch-icon

### 4. Components to Preserve
- Navbar with navigation links + theme switch (dark/light)
- Footer with copyright
- SoundCloud embed (track + album)
- YouTube embed (lite-youtube-embed for performance)
- Image lightbox (interactive island)
- Google Ads conversion tracking on CTA clicks
- Zoho SalesIQ chat widget

### 5. Content to Preserve
- All markdown files in public/content/ → Astro content collections
- All images in public/images/ → public/images/
- Beta downloads JSON → src/data/
- Team data → src/data/
- Features data → src/data/

### 6. What to Remove
- All React SPA infrastructure (react-router, SPA index.html, etc.)
- generate-static-pages.mjs script
- useSEO hook
- TrailingSlashRedirect component
- HeroUI component library (replace with plain Tailwind)
- vite.config.ts (replaced by astro.config.mjs)
- All files in src/ from old SPA

### 7. Design Preservation
- Montserrat font
- Violet/cyan gradient branding
- Dark mode support
- Responsive layout (mobile-first)
- Same visual hierarchy and spacing
