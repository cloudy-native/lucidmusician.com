import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import icon from "astro-icon";

export default defineConfig({
  site: "https://lucidmusician.com",
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
