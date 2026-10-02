// Server-side input validation & sanitisation for inquiries. The client only mirrors the limits for UX.

export const LIMITS = {
  name: { min: 2, max: 100 },
  company: { max: 150 },
  country: { min: 2, max: 80 },
  email: { max: 254 },
  whatsapp: { max: 30 },
  product: { min: 2, max: 150 },
  quantity: { max: 100 },
  targetPrice: { max: 60 },
  message: { min: 10, max: 4000 },
  fileBytes: 5 * 1024 * 1024,
} as const;

export interface InquiryInput {
  name: string;
  company: string;
  country: string;
  email: string;
  whatsapp: string;
  product: string;
  quantity: string;
  targetPrice: string;
  message: string;
}

export type FieldErrors = Partial<Record<keyof InquiryInput | "file", string>>;

// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const BIDI = /[‎‏‪-‮⁦-⁩]/g;

/** Single-line text: strip control/bidi characters, collapse whitespace, trim. */
export function cleanLine(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.replace(CONTROL, " ").replace(BIDI, "").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Multi-line text: keep newlines, strip control/bidi characters, limit consecutive blank lines. */
export function cleanText(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL, "")
    .replace(BIDI, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

const EMAIL = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
const PHONE = /^\+?[\d\s().-]{6,30}$/;

export function validateInquiry(raw: Record<string, unknown>): { data?: InquiryInput; errors?: FieldErrors } {
  const data: InquiryInput = {
    name: cleanLine(raw.name, LIMITS.name.max),
    company: cleanLine(raw.company, LIMITS.company.max),
    country: cleanLine(raw.country, LIMITS.country.max),
    email: cleanLine(raw.email, LIMITS.email.max).toLowerCase(),
    whatsapp: cleanLine(raw.whatsapp, LIMITS.whatsapp.max),
    product: cleanLine(raw.product, LIMITS.product.max),
    quantity: cleanLine(raw.quantity, LIMITS.quantity.max),
    targetPrice: cleanLine(raw.targetPrice, LIMITS.targetPrice.max),
    message: cleanText(raw.message, LIMITS.message.max),
  };

  const errors: FieldErrors = {};
  if (data.name.length < LIMITS.name.min) errors.name = "Please enter your name.";
  if (data.country.length < LIMITS.country.min) errors.country = "Please enter your country.";
  if (!EMAIL.test(data.email)) errors.email = "Please enter a valid email address.";
  if (data.whatsapp && !PHONE.test(data.whatsapp)) errors.whatsapp = "Please enter a valid WhatsApp number, e.g. +233 20 123 4567.";
  if (data.product.length < LIMITS.product.min) errors.product = "Please select or enter a product / category.";
  if (data.message.length < LIMITS.message.min) errors.message = "Please describe what you need (at least 10 characters).";

  return Object.keys(errors).length ? { errors } : { data };
}

export type DetectedFile = { ext: "jpg" | "png" | "pdf"; mime: string };

/** Identify an upload by magic bytes — the client-supplied MIME type and filename are never trusted. */
export function detectFileType(buf: Uint8Array): DetectedFile | null {
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { ext: "jpg", mime: "image/jpeg" };
  if (buf.length > 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 && buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a)
    return { ext: "png", mime: "image/png" };
  if (buf.length > 5 && buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46 && buf[4] === 0x2d) return { ext: "pdf", mime: "application/pdf" };
  return null;
}
