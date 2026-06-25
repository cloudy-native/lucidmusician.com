import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://lucidmusician.com",
  redirects: {
    "/blog/survey": "/blog/harmonic-generator-plugins-comparison",
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/beta"),
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
