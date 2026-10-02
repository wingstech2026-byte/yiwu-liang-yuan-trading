import Link from "next/link";
import { getDictionary } from "@/content";
import { defaultLocale, localePath } from "@/lib/site";

export default function NotFound() {
  const t = getDictionary(defaultLocale);
  return (
    <section className="section">
      <div className="container container--narrow text-center">
        <span className="eyebrow">404</span>
        <h1>{t.notFound.title}</h1>
        <p className="lead">{t.notFound.text}</p>
        <div className="mt-6">
          <Link href={localePath(defaultLocale)} className="btn btn--primary">
            {t.notFound.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
