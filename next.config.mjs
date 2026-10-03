const isProd = process.env.NODE_ENV === "production";

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
// Crisp live chat (only when a valid Website ID is configured, matching src/components/seo/Analytics.tsx).
const crispId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID || "") ? process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID : null;
const crispHttp = "https://client.crisp.chat https://settings.crisp.chat https://storage.crisp.chat https://image.crisp.chat";
const crispWs = "wss://client.relay.crisp.chat wss://stream.relay.crisp.chat";

// Only open CSP sources for analytics providers that are actually configured.
const scriptExtra = [gaId && "https://www.googletagmanager.com", pixelId && "https://connect.facebook.net", crispId && "https://client.crisp.chat https://settings.crisp.chat"].filter(Boolean).join(" ");
const connectExtra = [
  gaId && "https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  pixelId && "https://www.facebook.com https://connect.facebook.net",
  crispId && `${crispHttp} ${crispWs}`,
]
  .filter(Boolean)
  .join(" ");
const imgExtra = [gaId && "https://www.google-analytics.com https://www.googletagmanager.com", pixelId && "https://www.facebook.com", crispId && "https://client.crisp.chat https://image.crisp.chat https://storage.crisp.chat"].filter(Boolean).join(" ");
const styleExtra = crispId ? "https://client.crisp.chat" : "";
const fontExtra = crispId ? "https://client.crisp.chat" : "";
const mediaExtra = crispId ? "https://client.crisp.chat https://storage.crisp.chat" : "";

// Next.js injects small inline bootstrap scripts, so 'unsafe-inline' is required without a nonce setup.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${scriptExtra}`.trim(),
  `style-src 'self' 'unsafe-inline' ${styleExtra}`.trim(),
  `img-src 'self' data: blob: ${imgExtra}`.trim(),
  `font-src 'self' data: ${fontExtra}`.trim(),
  `media-src 'self' ${mediaExtra}`.trim(),
  `connect-src 'self' ${connectExtra}`.trim(),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isProd
    ? [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "Content-Security-Policy", value: csp },
      ]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 828, 1080, 1280, 1600],
  },
  async redirects() {
    return [{ source: "/", destination: "/en", permanent: false }];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
