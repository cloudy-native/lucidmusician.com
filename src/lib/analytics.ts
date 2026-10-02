function publicEnv(name: string, fallback?: string): string | undefined {
  const value = import.meta.env[name] as string | undefined;
  if (!value) return fallback;
  if (/^your-/i.test(value) || /X{4,}/.test(value)) return fallback;
  return value;
}

export const GA4_MEASUREMENT_ID = publicEnv(
  "PUBLIC_GA4_MEASUREMENT_ID",
  "G-4PFNTEFC7S",
);

export const GOOGLE_ADS_ID = publicEnv("PUBLIC_GOOGLE_ADS_ID", "AW-951228427");

export const GOOGLE_ADS_CONVERSION_ID = publicEnv(
  "PUBLIC_GOOGLE_ADS_CONVERSION_ID",
  "AW-951228427/rn08CMKM5PECEIuwysUD",
);

/** Real Search Console HTML-tag token only. Placeholders are omitted. */
export const GOOGLE_SITE_VERIFICATION = publicEnv(
  "PUBLIC_GOOGLE_SITE_VERIFICATION",
);

export const GTAG_IDS = [GA4_MEASUREMENT_ID, GOOGLE_ADS_ID].filter(
  (id): id is string => Boolean(id),
);

export const PRIMARY_GTAG_ID = GTAG_IDS[0];

/** Raw snippet. Do not put this in a define:vars script — Astro wraps those in an IIFE and strips `arguments`, which breaks gtag. */
export const gtagInlineScript = PRIMARY_GTAG_ID
  ? [
      "window.dataLayer=window.dataLayer||[];",
      "function gtag(){dataLayer.push(arguments);}",
      "window.gtag=gtag;",
      "gtag('js',new Date());",
      ...GTAG_IDS.map((id) => `gtag('config','${id}');`),
    ].join("")
  : "";

export const conversionInlineScript = GOOGLE_ADS_CONVERSION_ID
  ? [
      "document.querySelectorAll('.gumroad-button').forEach(function(btn){",
      "btn.addEventListener('click',function(){",
      "if(typeof window.gtag==='function'){",
      `window.gtag('event','conversion',{send_to:'${GOOGLE_ADS_CONVERSION_ID}'});`,
      "}});});",
    ].join("")
  : "";
