import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { visibleProducts } from "@/data/products";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/site";

/** Homepage strip with every product video, playable in place. Built from `products[].videos`, so new clips appear automatically. */
export function ProductVideos({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const v = t.home.videos;
  const clips = visibleProducts.flatMap((p) => (p.videos ?? []).map((video) => ({ product: p, video })));
  if (clips.length === 0) return null;

  return (
    <section className="section section--alt" aria-labelledby="videos-title">
      <div className="container">
        <SectionHeading id="videos-title" eyebrow={v.eyebrow} title={v.title} text={v.text} />
        <Reveal stagger className="grid grid--4 video-grid">
          {clips.map(({ product, video }) => (
            <figure className="video-card" key={video.src}>
              <video controls playsInline preload="none" poster={video.poster} aria-label={`${product.name}: ${video.label}`}>
                <source src={video.src} type="video/mp4" />
              </video>
              <figcaption>
                <strong>{video.label}</strong>
                <Link className="link-arrow" href={localePath(locale, `/products/${product.slug}`)}>
                  {v.viewProduct} <Icon name="arrow-right" size={16} />
                </Link>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
