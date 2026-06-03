# LucidMusician.com

Marketing site for [LucidHarmony](https://lucidmusician.com) — an AI-powered chord progression generator for ambient music and film scoring.

## Stack

- [Astro](https://astro.build) — Static site generator
- [Tailwind CSS 4](https://tailwindcss.com) — Styling
- [Content Collections](https://docs.astro.build/en/guides/content-collections/) — Blog & docs from Markdown

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview   # serve the dist/ folder locally
```

## Deployment

Static output in `dist/` is deployed to AWS S3 + CloudFront via the CDK stack in `cdk/`.
