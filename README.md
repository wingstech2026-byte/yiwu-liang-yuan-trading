# Yiwu Liang Yuan Trading Co., Ltd. — website

Corporate B2B website (Next.js App Router, TypeScript, plain CSS tokens). English only for now, with the routing and content structure ready for more languages.

## Run

```bash
npm install
npm run dev          # http://localhost:3000  (redirects to /en)
```

**Windows PowerShell:** if `npm` fails with "running scripts is disabled on this system", either use the `.cmd` shim (`npm.cmd install`, `npm.cmd run dev`) or run Command Prompt instead of PowerShell. To fix it permanently for your user account, run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once and reopen the terminal.

Production:

```bash
cp .env.example .env.local   # then edit values
npm run build
npm start                    # serves on port 3000 (set PORT to change)
```

Other scripts: `npm run typecheck`, `npm run inquiries` (list saved inquiries), `npm run images` (re-create optimised photos from `ALL IMAGES 1/`).

## Where things live

| Need to change… | Edit |
|---|---|
| Company facts, **email / phone / WhatsApp / WeChat**, business-licence image, certifications | `src/data/company.ts` |
| Product categories | `src/data/categories.ts` |
| Products (name, images, MOQ, specifications, featured, status) | `src/data/products.ts` |
| Page copy, FAQ, services, trade info | `src/content/en/index.ts` |
| Colours, type, spacing, radii | `src/styles/tokens.css` |
| Inquiry storage / delivery | `src/services/inquiry-store.ts` |

Contact details are `null` in `company.ts`; the Contact page shows marked `[ADD …]` placeholders and the footer hides them until you fill them in. Nothing is guessed.

Business licence image: put the file in `public/documents/` and set `documents.businessLicenseImage` (for example `"/documents/business-license.jpg"`).

### Product data
Products with `status: "placeholder"` show a "Placeholder listing" badge, are set to `noindex` and are left out of the sitemap. Replace them with real products (or set `status: "draft"` to hide). Specifications show "Provided on request" where the company has not supplied data; no prices are shown anywhere.

### Languages
Copy a content folder (`src/content/en` → `src/content/fr`), translate by hand, register it in `src/content/index.ts`, and add the code to `locales` in `src/lib/site.ts`. For Arabic, also set `dir="rtl"` in `src/app/[locale]/layout.tsx`. The language selector already lists the planned languages as "coming soon".

## Inquiries

`POST /api/inquiry` validates and sanitises input, enforces a same-origin check, a honeypot field, a per-IP rate limit (5 per 15 minutes), and an upload allow-list (JPG/PNG/PDF, 5 MB, checked by file signature, stored under a random name). Inquiries are appended to `data/inquiries/inquiries.jsonl` and uploads to `data/inquiries/uploads/`. **No email is sent.** The form only shows "received" after the write succeeds. View them with `npm run inquiries`.

To send email or use a database later, implement the `InquiryStore` interface in `src/services/inquiry-store.ts`.

Notes for deployment:
- File storage needs a Node host with a **persistent writable disk** (VPS, Render, Railway…). It will not persist on serverless platforms such as Vercel. Set `INQUIRY_DATA_DIR` to a persistent path and back it up.
- Run behind a reverse proxy that sets `X-Forwarded-For` and keeps the original `Host` header (used for the same-origin check and rate limiting). The rate limiter is in memory, so it is per process.
- Serve over HTTPS. Security headers (CSP, HSTS, X-Frame-Options, etc.) are set in `next.config.mjs` in production.

## SEO

Per-page titles, descriptions, canonical and language alternates, Open Graph/Twitter metadata, `sitemap.xml`, `robots.txt`, and JSON-LD (Organization with verified facts only, BreadcrumbList, Product without prices, FAQPage). Set `NEXT_PUBLIC_SITE_URL` to the real domain before building. Submit the sitemap in Google Search Console and put the verification token in `NEXT_PUBLIC_GSC_VERIFICATION`.

## Analytics

Disabled until you set `NEXT_PUBLIC_GA_ID` and/or `NEXT_PUBLIC_META_PIXEL_ID`. If you serve visitors in regions that require cookie consent, add a consent banner before enabling them.

## Images

`public/images/` holds web-optimised copies of the supplied photos (`npm run images` re-creates them from `ALL IMAGES 1/`). Gemstone, gold-bar and tantalum products use the supplied photos and are marked **"Illustrative image"** with an inquiry-only compliance notice (these are outside the licensed business scope listed on the About page, so confirm you may offer them and have the paperwork). The gold nugget photos are deliberately **not** used (clip-art style, stock-site watermark). Several supplied photos look like generic internet images (copper concentrate, tantalum, gold); replace them with your own product photos when you have them.

Perfume videos live in `public/videos/` as H.264 MP4 with poster frames. The originals were HEVC, which many browsers cannot play, so they were converted (ffmpeg, not a project dependency). Add a clip to a product with the `videos` field in `src/data/products.ts`.
