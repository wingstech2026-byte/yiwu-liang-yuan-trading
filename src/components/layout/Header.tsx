"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { useQuote } from "@/components/quote/QuoteProvider";
import { localePath, type Locale } from "@/lib/site";

interface Props {
  locale: Locale;
  nav: { key: string; label: string; path: string }[];
  labels: { getQuote: string; openMenu: string; closeMenu: string; language: string; comingSoon: string; quote: string };
  companyName: string;
  tagline: string;
}

export function Header({ locale, nav, labels, companyName, tagline }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const { items: quoteItems } = useQuote();

  // Close the mobile menu on navigation and with Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (path: string) => {
    const full = localePath(locale, path);
    return path === "/" ? pathname === full : pathname === full || pathname.startsWith(full + "/");
  };

  const links = nav.map((item) => (
    <li key={item.key}>
      <Link className="nav-link" href={localePath(locale, item.path)} aria-current={isCurrent(item.path) ? "page" : undefined}>
        {item.label}
      </Link>
    </li>
  ));

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={localePath(locale)} className="brand" aria-label={`${companyName} — home`}>
          <Image src="/images/logo-emblem.png" alt="" width={48} height={48} priority />
          <span className="brand-text">
            <span className="brand-name">Yiwu Liang Yuan Trading</span>
            <span className="brand-sub">{tagline}</span>
          </span>
        </Link>

        <nav className="nav" aria-label="Main">
          <ul className="nav-list">{links}</ul>
        </nav>

        <div className="header-actions">
          <LanguageSelector locale={locale} label={labels.language} comingSoon={labels.comingSoon} />
          <Link href={`${localePath(locale, "/contact")}#inquiry`} className="quote-link" aria-label={`${labels.quote}${quoteItems.length ? ` (${quoteItems.length})` : ""}`}>
            <Icon name="list" size={22} />
            {quoteItems.length > 0 && <span className="quote-count" aria-hidden="true">{quoteItems.length}</span>}
          </Link>
          <Link href={localePath(locale, "/contact")} className="btn btn--primary btn--sm">
            {labels.getQuote}
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? labels.closeMenu : labels.openMenu}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>

      <nav id={menuId} className="mobile-nav" aria-label="Mobile" hidden={!open}>
        <div className="container">
          <ul>{links}</ul>
          <Link href={localePath(locale, "/contact")} className="btn btn--primary btn--block">
            {labels.getQuote}
          </Link>
        </div>
      </nav>
    </header>
  );
}
