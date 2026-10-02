import { CategoryCard } from "@/components/products/CategoryCard";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories } from "@/data/categories";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/site";

export function CategoriesGrid({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const c = t.home.categories;
  return (
    <section className="section section--alt" aria-labelledby="cat-title">
      <div className="container">
        <SectionHeading id="cat-title" eyebrow={c.eyebrow} title={c.title} text={c.text} />
        <Reveal stagger className="grid grid--4 grid--cats">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} locale={locale} cta={t.common.viewProducts} />
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
