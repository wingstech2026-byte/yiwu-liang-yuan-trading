"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

interface Props {
  whatsappHref: string | null; // null until the company WhatsApp number is set in src/data/company.ts
  labels: { whatsapp: string; backToTop: string };
  /** true when the live chat bubble is shown, so the back-to-top button sits above it */
  chatEnabled: boolean;
}

/** WhatsApp button (only with a real number) and a back-to-top button that appears after scrolling. */
export function FloatingActions({ whatsappHref, labels, chatEnabled }: Props) {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {whatsappHref && (
        <a className="fab fab--whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={labels.whatsapp}>
          <Icon name="chat" size={26} />
          <span className="fab-label">{labels.whatsapp}</span>
        </a>
      )}
      <button
        type="button"
        className={`fab fab--top${showTop ? " is-visible" : ""}${chatEnabled ? " fab--above-chat" : ""}`}
        aria-label={labels.backToTop}
        tabIndex={showTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      >
        <Icon name="arrow-up" size={22} />
      </button>
    </>
  );
}
