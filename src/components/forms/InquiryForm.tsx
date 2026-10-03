"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { useQuote } from "@/components/quote/QuoteProvider";
import { LIMITS, validateInquiry, type FieldErrors } from "@/lib/validation";
import { localePath, type Locale } from "@/lib/site";

interface Labels {
  name: string;
  company: string;
  country: string;
  email: string;
  whatsapp: string;
  product: string;
  productPlaceholder: string;
  quantity: string;
  quantityPlaceholder: string;
  targetPrice: string;
  targetPricePlaceholder: string;
  message: string;
  messagePlaceholder: string;
  file: string;
  fileHint: string;
  submit: string;
  submitting: string;
  success: string;
  genericError: string;
  networkError: string;
  privacy: string;
  privacyLink: string;
  sendAnother: string;
}

interface Props {
  locale: Locale;
  labels: Labels;
  categories: string[]; // category names for the select
  products: { slug: string; name: string; categoryName: string }[]; // used to prefill from ?product=
  otherLabel: string;
}

type Status = "idle" | "sending" | "success" | "error";

const ALLOWED_EXT = /\.(jpe?g|png|pdf)$/i;

export function InquiryForm({ locale, labels, categories, products, otherLabel }: Props) {
  const params = useSearchParams();
  const quote = useQuote();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [prefill, setPrefill] = useState<{ product: string; message: string }>({ product: "", message: "" });

  // Prefill from ?product=<slug> or ?category=<slug> (set by "Request a Quote" buttons).
  useEffect(() => {
    const slug = params.get("product");
    const match = slug ? products.find((p) => p.slug === slug) : undefined;
    if (match) {
      setPrefill({ product: match.categoryName, message: `I would like a quotation for: ${match.name}.\n\nQuantity / destination: ` });
    }
  }, [params, products]);

  useEffect(() => {
    if (!quote.ready || quote.items.length === 0) return;
    setPrefill((p) => (p.product ? p : { ...p, product: quote.items[0].category }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote.ready]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setFormError("");

    // Client-side check (mirrors the server rules; the server remains authoritative).
    const raw = Object.fromEntries(fd.entries());
    const { errors: clientErrors } = validateInquiry(raw);
    const next: FieldErrors = { ...clientErrors };
    const file = fd.get("file");
    if (file instanceof File && file.size > 0) {
      if (file.size > LIMITS.fileBytes) next.file = "File is too large (max 5 MB).";
      else if (!ALLOWED_EXT.test(file.name)) next.file = "Unsupported file. Please upload a JPG, PNG or PDF.";
    }
    if (Object.keys(next).length) {
      setErrors(next);
      const first = Object.keys(next)[0];
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    if (!(file instanceof File && file.size > 0)) fd.delete("file");
    fd.set("locale", locale);
    fd.set("items", quote.items.map((i) => i.name).join(" | "));

    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", { method: "POST", body: fd });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setStatus("success");
        form.reset();
        quote.clear();
        return;
      }
      setStatus("error");
      if (body.errors) {
        setErrors(body.errors);
        const first = Object.keys(body.errors)[0];
        form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      } else {
        setFormError(body.message || labels.genericError);
      }
    } catch {
      setStatus("error");
      setFormError(labels.networkError);
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status">
        <Icon name="check-circle" size={56} />
        <p>{labels.success}</p>
        <button type="button" className="btn btn--outline" onClick={() => { setStatus("idle"); setPrefill({ product: "", message: "" }); }}>
          {labels.sendAnother}
        </button>
      </div>
    );
  }

  const field = (name: keyof FieldErrors) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });
  const err = (name: keyof FieldErrors) =>
    errors[name] ? (
      <span id={`${name}-error`} className="field-error" role="alert">
        {errors[name]}
      </span>
    ) : null;
  const req = <span className="req" aria-hidden="true"> *</span>;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate encType="multipart/form-data" aria-busy={status === "sending"}>
      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div className="hp" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {quote.items.length > 0 && (
        <div className="quote-summary" role="region" aria-label={quote.labels.summaryTitle}>
          <div className="quote-summary-head">
            <strong>{quote.labels.summaryTitle}</strong>
            <button type="button" className="link-button" onClick={quote.clear}>
              {quote.labels.clear}
            </button>
          </div>
          <ul>
            {quote.items.map((item) => (
              <li key={item.slug}>
                <span>{item.name}</span>
                <button type="button" className="quote-remove" onClick={() => quote.remove(item.slug)} aria-label={`${quote.labels.removeItem}: ${item.name}`}>
                  <Icon name="close" size={16} />
                </button>
              </li>
            ))}
          </ul>
          <p className="hint">{quote.labels.summaryHint}</p>
        </div>
      )}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="f-name">{labels.name}{req}</label>
          <input id="f-name" name="name" className="input" autoComplete="name" required maxLength={LIMITS.name.max} {...field("name")} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="f-company">{labels.company}</label>
          <input id="f-company" name="company" className="input" autoComplete="organization" maxLength={LIMITS.company.max} />
        </div>
        <div className="field">
          <label htmlFor="f-country">{labels.country}{req}</label>
          <input id="f-country" name="country" className="input" autoComplete="country-name" required maxLength={LIMITS.country.max} {...field("country")} />
          {err("country")}
        </div>
        <div className="field">
          <label htmlFor="f-email">{labels.email}{req}</label>
          <input id="f-email" name="email" type="email" className="input" autoComplete="email" inputMode="email" required maxLength={LIMITS.email.max} {...field("email")} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="f-whatsapp">{labels.whatsapp}</label>
          <input id="f-whatsapp" name="whatsapp" type="tel" className="input" autoComplete="tel" inputMode="tel" placeholder="+233 20 123 4567" maxLength={LIMITS.whatsapp.max} {...field("whatsapp")} />
          {err("whatsapp")}
        </div>
        <div className="field">
          <label htmlFor="f-product">{labels.product}{req}</label>
          <select id="f-product" name="product" className="select" required key={prefill.product} defaultValue={prefill.product} {...field("product")}>
            <option value="" disabled>
              {labels.productPlaceholder}
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value={otherLabel}>{otherLabel}</option>
          </select>
          {err("product")}
        </div>
        <div className="field">
          <label htmlFor="f-quantity">{labels.quantity}</label>
          <input id="f-quantity" name="quantity" className="input" placeholder={labels.quantityPlaceholder} maxLength={LIMITS.quantity.max} />
        </div>
        <div className="field">
          <label htmlFor="f-price">{labels.targetPrice}</label>
          <input id="f-price" name="targetPrice" className="input" placeholder={labels.targetPricePlaceholder} maxLength={LIMITS.targetPrice.max} />
        </div>
        <div className="field field--full">
          <label htmlFor="f-message">{labels.message}{req}</label>
          <textarea
            id="f-message"
            name="message"
            className="textarea"
            required
            minLength={LIMITS.message.min}
            maxLength={LIMITS.message.max}
            placeholder={labels.messagePlaceholder}
            key={prefill.message}
            defaultValue={prefill.message}
            {...field("message")}
          />
          {err("message")}
        </div>
        <div className="field field--full">
          <label htmlFor="f-file">{labels.file}</label>
          <input id="f-file" name="file" type="file" className="input" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" aria-describedby={errors.file ? "file-error" : "file-hint"} {...(errors.file ? { "aria-invalid": true } : {})} />
          <span id="file-hint" className="hint">{labels.fileHint}</span>
          {err("file")}
        </div>
      </div>

      <div className="form-footer">
        {formError && (
          <div className="form-alert form-alert--error" role="alert">
            {formError}
          </div>
        )}
        <button type="submit" className="btn btn--primary btn--block" disabled={status === "sending"}>
          {status === "sending" ? labels.submitting : labels.submit}
        </button>
        <p className="hint">
          {labels.privacy} <Link href={localePath(locale, "/privacy")}>{labels.privacyLink}</Link>.
        </p>
      </div>
    </form>
  );
}
