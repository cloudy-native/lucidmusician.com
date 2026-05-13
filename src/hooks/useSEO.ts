import { useEffect } from "react";

const BASE_URL = "https://lucidmusician.com";

interface SEOOptions {
  title: string;
  description?: string;
  path?: string;
}

/**
 * Sets document title, meta description, canonical URL, and Open Graph tags for the current page.
 */
export function useSEO({ title, description, path }: SEOOptions) {
  useEffect(() => {
    document.title = title;

    // Canonical link
    const canonicalPath = path ?? window.location.pathname;
    let link = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${BASE_URL}${canonicalPath}`;

    // og:url
    let ogUrl = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]',
    );
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = `${BASE_URL}${canonicalPath}`;

    // og:title
    let ogTitle = document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]',
    );
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = title;

    // Meta description + og:description
    if (description) {
      let meta = document.querySelector<HTMLMetaElement>(
        'meta[name="description"]',
      );
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "description";
        document.head.appendChild(meta);
      }
      meta.content = description;

      let ogDesc = document.querySelector<HTMLMetaElement>(
        'meta[property="og:description"]',
      );
      if (!ogDesc) {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        document.head.appendChild(ogDesc);
      }
      ogDesc.content = description;
    }
  }, [title, description, path]);
}
