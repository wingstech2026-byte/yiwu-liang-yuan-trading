"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { crispId, gaId, hasOptionalScripts, pixelId } from "@/lib/optional-scripts";
import { localePath, type Locale } from "@/lib/site";

// Optional third-party scripts (Google Analytics, Meta Pixel, Crisp chat). They load only when
//   1) a valid ID is configured via environment variables, AND
//   2) the visitor has accepted optional cookies in the banner.
// With no IDs configured nothing renders at all (no banner, no scripts).
const STORAGE_KEY = "yly-consent-v1";
export const CONSENT_RESET_EVENT = "yly:consent-reset";

const ga = gaId;
const pixel = pixelId;
const crisp = crispId;

interface Labels {
  title: string;
  text: string;
  accept: string;
  decline: string;
  policy: string;
}

type Consent = "granted" | "denied" | null | "unknown"; // null = not decided yet, "unknown" = not read yet (SSR)

export function Analytics({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [consent, setConsent] = useState<Consent>("unknown");

  useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      setConsent(v === "granted" || v === "denied" ? v : null);
    } catch {
      setConsent(null);
    }
    const reset = () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
      setConsent(null);
    };
    window.addEventListener(CONSENT_RESET_EVENT, reset);
    return () => window.removeEventListener(CONSENT_RESET_EVENT, reset);
  }, []);

  if (!hasOptionalScripts) return null;

  const choose = (value: "granted" | "denied") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore: choice applies for this visit only */
    }
    setConsent(value);
  };

  return (
    <>
      {consent === "granted" && (
        <>
          {ga && (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
              <Script id="ga-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
              </Script>
            </>
          )}
          {pixel && (
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixel}');fbq('track','PageView');`}
            </Script>
          )}
          {crisp && (
            <Script id="crisp-chat" strategy="lazyOnload">
              {`window.$crisp=[];window.CRISP_WEBSITE_ID="${crisp}";(function(){var d=document,s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();`}
            </Script>
          )}
        </>
      )}

      {consent === null && (
        <aside className="consent" role="dialog" aria-live="polite" aria-labelledby="consent-title">
          <strong id="consent-title">{labels.title}</strong>
          <p>
            {labels.text} <Link href={localePath(locale, "/cookies")}>{labels.policy}</Link>
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn--primary btn--sm" onClick={() => choose("granted")}>
              {labels.accept}
            </button>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => choose("denied")}>
              {labels.decline}
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
