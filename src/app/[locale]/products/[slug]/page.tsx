import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductGallery } from "@/components/products/ProductGallery";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBand } from "@/components/ui/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categoryBySlug } from "@/data/categories";
import { productBySlug, relatedProducts, visibleProducts } from "@/data/products";
import { getDictionary } from "@/content";
import { company } from "@/data/company";
import { isLocale, locales, localePath, absoluteUrl, siteUrl } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ locale: string; slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => visibleProducts.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = productBySlug(slug);
  if (!isLocale(locale) || !product) return {};
  const cat = categoryBySlug(product.category);
  return pageMetadata({
    locale,
    path: `/products/${product.slug}`,
    title: `${product.name} | ${cat?.name ?? "Products"} | ${company.name}`,
    description: product.description,
    image: product.image ?? undefined,
    // Placeholder listings should not be indexed until real data is added.
    noindex: product.status === "placeholder",
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const product = productBySlug(slug);
  if (!isLocale(locale) || !product) notFound();

  const t = getDictionary(locale);
  const d = t.products.detail;
  const cat = categoryBySlug(product.category);
  const related = relatedProducts(product);
  const cardLabels = {
    requestQuote: t.common.requestQuote,
    moq: t.common.moq,
    moqUnknown: t.common.moqUnknown,
    placeholderNotice: t.common.placeholderNotice,
    illustrative: t.common.illustrative,
    video: t.common.video,
  };
  const images = product.gallery.length ? product.gallery : product.image ? [product.image] : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: cat?.name,
    ...(images.length ? { image: images.map((i) => `${siteUrl}${i}`) } : {}),
    url: absoluteUrl(locale, `/products/${product.slug}`),
    // No "offers": we do not publish prices.
  };

  return (
    <>
      <section className="section section--tight">
        <div className="container">
          <Breadcrumbs
            light
            locale={locale}
            items={[
              { label: t.common.home, path: "/" },
              { label: t.products.heading, path: "/products" },
              { label: product.name },
            ]}
          />
          <div className="detail">
            <ProductGallery
              images={images}
              videos={product.videos}
              alt={product.alt}
              name={product.name}
              category={product.category}
              illustrativeLabel={product.illustrative ? t.common.illustrative : undefined}
            />
            <div>
              <span className="product-cat">{cat?.name}</span>
              <h1 style={{ fontSize: "var(--fs-h2)", marginTop: "0.5rem" }}>{product.name}</h1>
              {product.status === "placeholder" && <p className="notice" style={{ marginBottom: "1rem" }}>{t.common.placeholderNotice}</p>}
              {product.illustrative && <p className="notice" style={{ marginBottom: "1rem" }}>{t.products.detail.illustrativeNote}</p>}
              {product.note && <p className="notice" style={{ marginBottom: "1rem" }}>{product.note}</p>}
              <p className="lead">{product.description}</p>

              <h2 style={{ fontSize: "1.1rem", marginTop: "2rem" }}>{d.specs}</h2>
              <table className="spec-table">
                <tbody>
                  <tr>
                    <th scope="row">{t.common.moq}</th>
                    <td>{product.moq ?? t.common.moqUnknown}</td>
                  </tr>
                  {product.specifications.map((s) => (
                    <tr key={s.label}>
                      <th scope="row">{s.label}</th>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="hint" style={{ margin: "1rem 0 1.5rem" }}>{d.pricing}</p>

              {product.videos && product.videos.length > 0 && (
                <div className="video-block">
                  <h2 style={{ fontSize: "1.1rem" }}>{d.videosTitle}</h2>
                  <div className="video-block-grid">
                    {product.videos.map((video) => (
                      <figure className="video-card" key={video.src}>
                        <video controls playsInline preload="none" poster={video.poster} aria-label={`${product.name}: ${video.label}`}>
                          <source src={video.src} type="video/mp4" />
                        </video>
                        <figcaption>
                          <strong>{video.label}</strong>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              <div className="btn-row">
                <ButtonLink href={`${localePath(locale, "/contact")}?product=${encodeURIComponent(product.slug)}#inquiry`}>
                  {t.common.requestQuote}
                </ButtonLink>
                <ButtonLink href={localePath(locale, "/products")} variant="outline">
                  {d.back}
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--alt" aria-labelledby="related-title">
          <div className="container">
            <SectionHeading id="related-title" title={d.related} />
            <div className="grid grid--3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} labels={cardLabels} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand locale={locale} />
      <JsonLd data={schema} />
    </>
  );
}
