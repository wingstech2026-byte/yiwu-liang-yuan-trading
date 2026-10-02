import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/lib/site";

// Only English is published. Other languages are listed as "coming soon" so the selector is ready,
// but no machine-translated pages are served. Add a locale in src/lib/site.ts to enable one.
const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "pt", label: "Português" },
  { code: "zh", label: "中文" },
];

export function LanguageSelector({ locale, label, comingSoon }: { locale: Locale; label: string; comingSoon: string }) {
  return (
    <details className="lang">
      <summary aria-label={label}>
        <Icon name="globe2" size={16} />
        {locale.toUpperCase()}
      </summary>
      <ul className="lang-menu">
        {languages.map((l) => {
          const active = l.code === locale;
          return (
            <li key={l.code} aria-disabled={!active} lang={l.code}>
              <span>{l.label}</span>
              {active ? <Icon name="check" size={16} /> : <small>{comingSoon}</small>}
            </li>
          );
        })}
      </ul>
    </details>
  );
}
