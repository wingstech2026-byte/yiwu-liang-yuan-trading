"use client";

import Image from "next/image";
import { useState } from "react";
import { PlaceholderTile } from "@/components/products/ProductCard";
import { Icon } from "@/components/ui/Icon";
import type { ProductVideo } from "@/data/products";

interface Props {
  images: string[];
  videos?: ProductVideo[];
  alt: string;
  name: string;
  category: string;
  illustrativeLabel?: string; // shown over the media when the photos are illustrative
}

type Item = { kind: "image"; src: string } | { kind: "video"; video: ProductVideo };

export function ProductGallery({ images, videos = [], alt, name, category, illustrativeLabel }: Props) {
  const [active, setActive] = useState(0);
  const items: Item[] = [...images.map((src): Item => ({ kind: "image", src })), ...videos.map((video): Item => ({ kind: "video", video }))];

  if (items.length === 0) {
    return (
      <div className="gallery-main">
        <PlaceholderTile category={category} />
      </div>
    );
  }

  const current = items[active];

  return (
    <div>
      <div className="gallery-main">
        {current.kind === "image" ? (
          <Image
            key={current.src}
            src={current.src}
            alt={`${alt || name}${items.length > 1 ? ` — view ${active + 1} of ${items.length}` : ""}`}
            fill
            priority={active === 0}
            sizes="(min-width: 900px) 600px, 100vw"
          />
        ) : (
          // Remounted per video (key) so switching clips resets playback. Muted-by-default is not forced: user starts it.
          <video
            key={current.video.src}
            className="gallery-video"
            controls
            playsInline
            preload="metadata"
            poster={current.video.poster}
            aria-label={`${name} video: ${current.video.label}`}
          >
            <source src={current.video.src} type="video/mp4" />
          </video>
        )}
        {illustrativeLabel && current.kind === "image" && <span className="badge badge--warn gallery-badge">{illustrativeLabel}</span>}
      </div>
      {items.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label={`${name} images and videos`}>
          {items.map((item, i) => (
            <button
              key={item.kind === "image" ? item.src : item.video.src}
              type="button"
              className="thumb"
              aria-current={i === active}
              aria-label={item.kind === "image" ? `Show image ${i + 1}` : `Play video: ${item.video.label}`}
              onClick={() => setActive(i)}
            >
              {item.kind === "image" ? (
                <Image src={item.src} alt="" width={84} height={64} />
              ) : (
                <span className="thumb-video">
                  <Image src={item.video.poster} alt="" width={84} height={64} />
                  <span className="thumb-play">
                    <Icon name="play" size={18} />
                  </span>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
