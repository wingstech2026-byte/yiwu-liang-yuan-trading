import { ProductCard } from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredProducts } from "@/data/products";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/site";

export function FeaturedProducts({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const f = t.home.featured;
  const labels = {
    requestQuote: t.common.requestQuote,
    moq: t.common.moq,
    moqUnknown: t.common.moqUnknown,
    placeholderNotice: t.common.placeholderNotice,
    illustrative: t.common.illustrative,
  };
  return (
    <section className="section" aria-labelledby="featured-title">
      <div className="container">
        <SectionHeading id="featured-title" eyebrow={f.eyebrow} title={f.title} text={f.text} />
        <Reveal stagger className="grid grid--4">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} labels={labels} />
          ))}
        </Reveal>
        <div className="text-center mt-7">
          <ButtonLink href={localePath(locale, "/products")} variant="outline">
            {t.common.viewAllProducts}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
