/**
 * Post-build script: generates per-route HTML files with correct SEO meta tags.
 * 
 * Since this is a client-side SPA, search engines see only index.html by default.
 * This script copies index.html into each route directory with route-specific
 * title, description, and canonical URL so crawlers get proper metadata even
 * before JavaScript executes.
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";

const DIST = resolve(import.meta.dirname, "../dist");
const BASE_URL = "https://lucidmusician.com";

const routes = [
  {
    path: "/docs",
    title: "Documentation - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "Complete documentation for LucidHarmony, the AI-powered chord progression generator for ambient music and film scoring.",
  },
  {
    path: "/support",
    title: "Support - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "Get help with LucidHarmony. FAQs, troubleshooting, and contact information for the AI chord progression generator.",
  },
  {
    path: "/release-notes",
    title: "Release Notes - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "Latest updates and changelog for LucidHarmony, the AI-powered MIDI chord progression plugin.",
  },
  {
    path: "/roadmap",
    title: "Roadmap - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "See what's coming next for LucidHarmony. Planned features and improvements for the AI chord progression generator.",
  },
  {
    path: "/blog",
    title: "Blog - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "Articles about AI-powered music generation, chord progression theory, audio plugin development, and the technology behind LucidHarmony.",
  },
  {
    path: "/blog/but-is-it-ai",
    title: "How is this AI? - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "A deep dive into autoregressive sequence modeling: Markov chains, n-grams, LSTM, and GPT-style Transformers for music generation.",
  },
  {
    path: "/blog/github-actions-macos-linux-build",
    title: "Building an Audio Plugin with GitHub Actions - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "The nitty-gritty details of building an audio plugin with GitHub Actions for macOS and Linux, multi-architecture.",
  },
  {
    path: "/blog/modeling-harmonies",
    title: "Modeling Harmonies: From Scores to Real-Time AI - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "Explore the pipeline behind LucidHarmony's AI harmonic generation, from historical scores to a lightweight neural network inside an audio plugin.",
  },
  {
    path: "/blog/precomputed-metadata-formats",
    title: "Precomputed Music-Theory Metadata - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "Learn how to precompute music theory offline to make realtime harmony generation fast and repeatable.",
  },
  {
    path: "/blog/survey",
    title: "Harmonic Generators for DAWs: State of the Union - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "A survey of currently available DAW applications and plugins for generating harmonies.",
  },
  {
    path: "/blog/technology-stack",
    title: "The LucidHarmony Tech Stack - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "A categorized inventory of the core technologies behind LucidHarmony, from Python modeling to JUCE plugin development.",
  },
  {
    path: "/about",
    title: "About - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "Meet the team behind LucidHarmony, the AI-powered chord progression generator for ambient music and film scoring.",
  },
  {
    path: "/beta",
    title: "Beta Downloads - LucidHarmony | Gorgeous Infinite Harmony for Ambient and Scoring",
    description: "Download beta versions of LucidHarmony to try the latest features before release.",
  },
];

const template = readFileSync(resolve(DIST, "index.html"), "utf-8");

for (const route of routes) {
  let html = template;

  // Replace title
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${route.title}</title>`,
  );

  // Replace meta description
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${route.description}" />`,
  );

  // Replace canonical URL
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${BASE_URL}${route.path}" />`,
  );

  // Replace og:title
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${route.title}" />`,
  );

  // Replace og:description
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?\/?>/,
    `<meta property="og:description" content="${route.description}" />`,
  );

  // Replace og:url
  html = html.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${BASE_URL}${route.path}" />`,
  );

  // Replace twitter:title
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${route.title}" />`,
  );

  // Replace twitter:description
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${route.description}" />`,
  );

  // Write to route directory
  const outDir = resolve(DIST, route.path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, "index.html"), html);
}

console.log(`✅ Generated ${routes.length} static HTML pages for SEO`);
