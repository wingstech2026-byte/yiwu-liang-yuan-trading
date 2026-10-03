"use client";

import { CONSENT_RESET_EVENT } from "@/components/seo/Analytics";
import { hasOptionalScripts } from "@/lib/optional-scripts";

/** Footer link that re-opens the cookie choice. Renders nothing when no optional scripts are configured. */
export function CookieSettingsButton({ label }: { label: string }) {
  if (!hasOptionalScripts) return null;
  return (
    <button type="button" className="link-button footer-link-button" onClick={() => window.dispatchEvent(new Event(CONSENT_RESET_EVENT))}>
      {label}
    </button>
  );
}
