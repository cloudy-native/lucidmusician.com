export const GOOGLE_ADS_ID = import.meta.env.PUBLIC_GOOGLE_ADS_ID as
  | string
  | undefined;

/** Set PUBLIC_GA4_MEASUREMENT_ID in .env (e.g. G-XXXXXXXXXX) */
export const GA4_MEASUREMENT_ID = import.meta.env.PUBLIC_GA4_MEASUREMENT_ID as
  | string
  | undefined;

/** Set PUBLIC_GOOGLE_SITE_VERIFICATION in .env for Search Console HTML-tag verification */
export const GOOGLE_SITE_VERIFICATION = import.meta.env
  .PUBLIC_GOOGLE_SITE_VERIFICATION as string | undefined;

export const GTAG_IDS = [GA4_MEASUREMENT_ID, GOOGLE_ADS_ID].filter(
  (id): id is string => Boolean(id),
);

export const PRIMARY_GTAG_ID = GTAG_IDS[0];