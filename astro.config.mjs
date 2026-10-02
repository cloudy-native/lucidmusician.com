import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";
import { unified } from "@astrojs/markdown-remark";
import remarkDirective from "remark-directive";
import remarkAdmonitions from "./src/lib/remark-admonitions.js";
import remarkImageCaptions from "./src/lib/remark-image-captions.js";

export default defineConfig({
  site: "https://lucidmusician.com",
  markdown: {
    shikiConfig: {
      theme: "github-light",
    },
    processor: unified({
      remarkPlugins: [remarkDirective, remarkAdmonitions, remarkImageCaptions],
    }),
  },
  redirects: {
    "/blog/survey": "/blog/harmonic-generator-plugins-comparison",
  },
  integrations: [
    sitemap({
      filter: (page) => {
        try {
          const path = new URL(page).pathname.replace(/\/+$/, "") || "/";
          return path !== "/beta";
        } catch {
          return !page.includes("/beta");
        }
      },
    }),
    mdx(),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
