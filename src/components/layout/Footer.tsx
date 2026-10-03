import Image from "next/image";
import Link from "next/link";
import { company, developer, fullAddress, getChannels } from "@/data/company";
import { getDictionary } from "@/content";
import { CookieSettingsButton } from "@/components/seo/CookieSettingsButton";
import { localePath, type Locale } from "@/lib/site";

export function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  // Only verified contact details are shown in the footer. Placeholders live on the Contact page.
  const channels = getChannels().filter((c) => c.value);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-brand">
            <Image src="/images/logo-emblem.png" alt="" width={44} height={44} />
            <span>{company.name}</span>
          </div>
          <p>{t.footer.tagline}</p>
          <div className="footer-meta">
            <span>
              {t.common.legalRep}: <strong>{company.legalRepresentative}</strong>
            </span>
          </div>
        </div>

        <nav aria-label="Footer">
          <h2>{t.footer.navTitle}</h2>
          <ul className="footer-list">
            {t.nav.map((n) => (
              <li key={n.key}>
                <Link href={localePath(locale, n.path)}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2>{t.footer.businessTitle}</h2>
          <ul className="footer-list">
            {t.footer.business.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2>{t.footer.contactTitle}</h2>
          <address style={{ fontStyle: "normal" }}>
            <p>{fullAddress}</p>
            {channels.length > 0 && (
              <ul className="footer-list" style={{ marginTop: "0.75rem" }}>
                {channels.map((c) => (
                  <li key={c.key}>
                    {c.label}: {c.href ? <a href={c.href}>{c.value}</a> : c.value}
                  </li>
                ))}
              </ul>
            )}
            <p style={{ marginTop: "0.75rem" }}>
              <Link href={localePath(locale, "/contact")}>{t.common.sendInquiry} →</Link>
            </p>
          </address>
        </div>

        <div>
          <h2>{t.footer.legalTitle}</h2>
          <ul className="footer-list">
            {t.footer.legal.map((l) => (
              <li key={l.path}>
                <Link href={localePath(locale, l.path)}>{l.label}</Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton label={t.consent.settings} />
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>{t.footer.copyright}</span>
        <span className="dev-credit">
          <Image src="/images/developer.jpg" alt={`Photo of ${developer.name}`} width={36} height={36} className="dev-avatar" />
          <span>
            Developed by {developer.name}
            {developer.whatsapp && (
              <>
                {" · "}
                <a href={`https://wa.me/${developer.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  WhatsApp {developer.whatsapp}
                </a>
              </>
            )}
          </span>
        </span>
        <span lang="zh">{company.nameZh}</span>
      </div>
    </footer>
  );
}
