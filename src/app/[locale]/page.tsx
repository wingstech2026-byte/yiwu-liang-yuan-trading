import type { Metadata } from "next";
import { CtaBand } from "@/components/ui/CtaBand";
import { Marquee } from "@/components/ui/Marquee";
import { businessScope } from "@/data/company";
import { getDictionary } from "@/content";
import { resolveLocale, type LocaleParams } from "@/lib/locale";
import { pageMetadata } from "@/lib/seo";
import { CategoriesGrid } from "@/sections/CategoriesGrid";
import { FeaturedProducts } from "@/sections/FeaturedProducts";
import { ProductVideos } from "@/sections/ProductVideos";
import { ProcessTimeline } from "@/sections/ProcessTimeline";
import { Hero } from "@/sections/Hero";
import { WhoWeAre } from "@/sections/WhoWeAre";
import { WhyUs } from "@/sections/WhyUs";

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale);
  return pageMetadata({ locale, path: "", title: t.meta.defaultTitle, description: t.home.description, image: "/images/copper-cathode-2.jpg" });
}

export default async function HomePage({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  return (
    <>
      <Hero locale={locale} />
      <Marquee items={businessScope} />
      <WhoWeAre locale={locale} />
      <CategoriesGrid locale={locale} />
      <FeaturedProducts locale={locale} />
      <ProductVideos locale={locale} />
      <WhyUs locale={locale} />
      <ProcessTimeline locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
