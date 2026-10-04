import { createHash, randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { isLocale } from "@/lib/site";
import { detectFileType, LIMITS, validateInquiry } from "@/lib/validation";
import { inquiryStore, type InquiryRecord } from "@/services/inquiry-store";
import { sendInquiryEmail } from "@/services/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = LIMITS.fileBytes + 256 * 1024; // file + form fields
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const json = (body: unknown, status = 200, headers?: Record<string, string>) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

function clientIp(req: NextRequest): string {
  // Only trustworthy when the app runs behind a proxy that sets/overwrites x-forwarded-for.
  const xff = req.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim().slice(0, 64);
}

export async function POST(req: NextRequest) {
  // 1. Same-origin check (CSRF defence for a cookie-less public endpoint).
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get("host")) return json({ ok: false, error: "forbidden" }, 403);
    } catch {
      return json({ ok: false, error: "forbidden" }, 403);
    }
  }

  // 2. Size limit (declared) and content type.
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY) return json({ ok: false, errors: { file: "File is too large (max 4 MB)." } }, 413);
  if (!(req.headers.get("content-type") ?? "").includes("multipart/form-data")) return json({ ok: false, error: "bad_request" }, 415);

  // 3. Rate limit per IP.
  const ip = clientIp(req);
  const rl = rateLimit(`inquiry:${ip}`, MAX_PER_WINDOW, WINDOW_MS);
  if (!rl.ok) {
    return json({ ok: false, error: "rate_limited", message: "Too many submissions. Please try again later." }, 429, {
      "Retry-After": String(rl.retryAfterSec),
    });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  // 4. Honeypot: bots fill hidden fields. Pretend success, store nothing.
  const trap = form.get("website");
  if (typeof trap === "string" && trap.trim() !== "") return json({ ok: true });

  // 5. Validate & sanitise fields.
  const fields: Record<string, unknown> = {};
  for (const key of ["name", "company", "country", "email", "whatsapp", "product", "quantity", "targetPrice", "message", "items"]) {
    fields[key] = form.get(key);
  }
  const { data, errors } = validateInquiry(fields);

  // 6. Validate optional upload by size and magic bytes.
  const id = randomUUID();
  let upload: { ext: string; mime: string; bytes: Uint8Array; originalName: string } | null = null;
  const file = form.get("file");
  const fileErrors: { file?: string } = {};
  if (file instanceof File && file.size > 0) {
    if (file.size > LIMITS.fileBytes) {
      fileErrors.file = "File is too large (max 4 MB).";
    } else {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const type = detectFileType(bytes);
      if (!type) fileErrors.file = "Unsupported file. Please upload a JPG, PNG or PDF.";
      else upload = { ext: type.ext, mime: type.mime, bytes, originalName: String(file.name).replace(/[^\w.\- ]/g, "_").slice(0, 120) };
    }
  }

  if (errors || fileErrors.file || !data) return json({ ok: false, errors: { ...errors, ...fileErrors } }, 422);

  // 7. Save, and email a copy if email is configured. Success is only reported when the inquiry was really
  //    saved or really emailed: never a silent loss.
  const localeRaw = form.get("locale");
  const record: InquiryRecord = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    locale: typeof localeRaw === "string" && isLocale(localeRaw) ? localeRaw : "en",
    ipHash: ip === "unknown" ? null : createHash("sha256").update(ip).digest("hex").slice(0, 16),
    file: null,
  };

  let stored = false;
  try {
    if (upload) {
      const storedAs = await inquiryStore.saveUpload(id, upload.ext, upload.bytes);
      record.file = { storedAs, originalName: upload.originalName, mime: upload.mime, bytes: upload.bytes.byteLength };
    }
    await inquiryStore.saveInquiry(record);
    stored = true;
  } catch (err) {
    console.error("[inquiry] failed to store inquiry", err instanceof Error ? err.message : err);
  }

  const emailed = await sendInquiryEmail(
    record,
    upload ? { filename: `reference.${upload.ext}`, data: upload.bytes } : null,
  );

  if (!stored && emailed !== "sent") return json({ ok: false, error: "server_error" }, 500);
  return json({ ok: true });
}

// Everything else is not allowed.
export function GET() {
  return json({ ok: false, error: "method_not_allowed" }, 405, { Allow: "POST" });
}
