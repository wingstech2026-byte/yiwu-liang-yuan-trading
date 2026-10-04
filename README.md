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

## Deploying to Vercel (recommended)

1. Push this repository to GitHub (already done: https://github.com/wingstech2026-byte/yiwu-liang-yuan-trading).
2. In Vercel: **Add New... > Project > Import** the repository. Framework preset is detected as Next.js; leave build settings as they are.
3. Add **Environment Variables** before the first deploy (Settings > Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` = your public address, no trailing slash (e.g. `https://your-project.vercel.app` or your own domain)
   - `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, and `INQUIRY_FROM_EMAIL` so inquiries reach you (see below)
   - optional: `NEXT_PUBLIC_CRISP_WEBSITE_ID`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`
4. Click **Deploy**. Every push to `main` redeploys automatically. Add your own domain under Settings > Domains.

Node 22 is selected through `engines` in `package.json`. Environment variables that start with `NEXT_PUBLIC_` are read at build time, so redeploy after changing them.

## Inquiries and the quote list

Visitors can add products to a **quote list** (header icon, product cards, product pages) and send them together in one inquiry. The list is kept in the browser (localStorage) and is cleared after a successful submission.

`POST /api/inquiry` validates and sanitises input, enforces a same-origin check, a honeypot field, a per-IP rate limit (5 per 15 minutes), and an upload allow-list (JPG/PNG/PDF, **4 MB**, checked by file signature). The 4 MB cap keeps requests under Vercel's ~4.5 MB body limit.

**How inquiries are delivered** (`src/services/inquiry-store.ts`, `src/services/notify.ts`):
1. **Email (required on Vercel):** set `RESEND_API_KEY` and `INQUIRY_TO_EMAIL` (and `INQUIRY_FROM_EMAIL` on a domain verified in Resend, see https://resend.com). Each inquiry is emailed with the quote-list products and the attached reference file.
2. **Local files (normal Node host or local dev):** inquiries are also appended to `data/inquiries/inquiries.jsonl` (uploads in `data/inquiries/uploads/`). View them with `npm run inquiries`. Vercel's filesystem is read-only, so this step simply fails there and email carries the inquiry.

The form only shows "received" if the inquiry was really saved or really emailed; otherwise the visitor sees an error. **On Vercel, without the email variables every submission fails with an error.** Set them before going live. Nothing else is stored on Vercel, so keep the emails (or add a database by implementing the `InquiryStore` interface).

The rate limiter is in memory, so on serverless hosting it only limits within one server instance. Use Vercel's firewall/rate-limit settings for stronger protection.

Notes for a normal Node host (VPS, Render, Railway...): give it a persistent writable disk and set `INQUIRY_DATA_DIR`; run behind a reverse proxy that sets `X-Forwarded-For` and keeps the original `Host` header; serve over HTTPS. Security headers (CSP, HSTS, X-Frame-Options...) are set in `next.config.mjs` in production.

## Cookie banner

The banner only appears if Google Analytics, Meta Pixel or Crisp is configured. Those scripts load only after a visitor clicks Accept, and the footer "Cookie settings" link lets them change their mind. With nothing configured there is no banner and no third-party script.

## WhatsApp button

A floating WhatsApp button appears automatically once `contact.whatsapp` is set in `src/data/company.ts`.

## SEO

Per-page titles, descriptions, canonical and language alternates, Open Graph/Twitter metadata, `sitemap.xml`, `robots.txt`, and JSON-LD (Organization with verified facts only, BreadcrumbList, Product without prices, FAQPage). Set `NEXT_PUBLIC_SITE_URL` to the real domain before building. Submit the sitemap in Google Search Console and put the verification token in `NEXT_PUBLIC_GSC_VERIFICATION`.

## Analytics

Disabled until you set `NEXT_PUBLIC_GA_ID` and/or `NEXT_PUBLIC_META_PIXEL_ID`. If you serve visitors in regions that require cookie consent, add a consent banner before enabling them.

## Live chat (Crisp)

Disabled until you set `NEXT_PUBLIC_CRISP_WEBSITE_ID`. Steps:
1. Create a free account at https://crisp.chat and add your website.
2. Copy the **Website ID** (a UUID such as `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`) from Settings > Website Settings > Setup instructions.
3. Put it in `.env.local` (local), or in the Vercel environment variables (Settings > Environment Variables), then redeploy.
4. In Crisp, add your site domain under the website's trusted domains if asked.

The widget loads lazily after the page, and the security headers in `next.config.mjs` only allow Crisp when a valid ID is set. The Privacy and Cookie pages already mention it.

## Images

`public/images/` holds web-optimised copies of the supplied photos (`npm run images` re-creates them from `ALL IMAGES 1/`). Gemstone, gold-bar and tantalum products use the supplied photos and are marked **"Illustrative image"** with an inquiry-only compliance notice (these are outside the licensed business scope listed on the About page, so confirm you may offer them and have the paperwork). The gold nugget photos are deliberately **not** used (clip-art style, stock-site watermark). Several supplied photos look like generic internet images (copper concentrate, tantalum, gold); replace them with your own product photos when you have them.

Perfume videos live in `public/videos/` as H.264 MP4 with poster frames. The originals were HEVC, which many browsers cannot play, so they were converted (ffmpeg, not a project dependency). Add a clip to a product with the `videos` field in `src/data/products.ts`.
