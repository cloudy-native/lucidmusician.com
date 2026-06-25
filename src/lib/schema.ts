export const SITE_URL = "https://lucidmusician.com";
export const HERO_IMAGE = `${SITE_URL}/lucid-harmony-hero.com.png`;
export const LOGO_IMAGE = `${SITE_URL}/images/LH-logo.jpg`;

export const publisher = {
  "@type": "Organization" as const,
  name: "Lucid Musician",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject" as const,
    url: LOGO_IMAGE,
  },
};

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization" as const,
  name: "Lucid Musician",
  url: SITE_URL,
  logo: LOGO_IMAGE,
};

export function toIsoDate(date: string): string {
  return date.includes("T") ? date : `${date}T00:00:00.000Z`;
}