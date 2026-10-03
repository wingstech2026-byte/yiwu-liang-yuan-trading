// Which optional third-party scripts are configured. Plain module (no "use client") so it can be imported by
// both server components (layout) and client components (consent banner) and always yields real values.
// NEXT_PUBLIC_* variables are inlined at build time.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CRISP_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID; // Crisp live chat Website ID (a UUID)

// IDs are validated so a malformed env value can never inject script text.
export const gaId = GA_ID && /^[A-Za-z0-9-]{4,30}$/.test(GA_ID) ? GA_ID : null;
export const pixelId = PIXEL_ID && /^\d{5,20}$/.test(PIXEL_ID) ? PIXEL_ID : null;
export const crispId =
  CRISP_ID && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(CRISP_ID) ? CRISP_ID : null;

export const hasOptionalScripts = Boolean(gaId || pixelId || crispId);
export const hasChat = Boolean(crispId);
