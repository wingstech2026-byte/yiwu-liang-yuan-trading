"use client";

import Image from "next/image";
import { useState } from "react";
import { PlaceholderTile } from "@/components/products/ProductCard";

interface Props {
  images: string[];
  alt: string;
  name: string;
  category: string;
}

export function ProductGallery({ images, alt, name, category }: Props) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="gallery-main">
        <PlaceholderTile category={category} />
      </div>
    );
  }

  return (
    <div>
      <div className="gallery-main">
        <Image
          key={images[active]}
          src={images[active]}
          alt={`${alt || name}${images.length > 1 ? ` — view ${active + 1} of ${images.length}` : ""}`}
          fill
          priority
          sizes="(min-width: 900px) 600px, 100vw"
        />
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs" role="group" aria-label={`${name} images`}>
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className="thumb"
              aria-current={i === active}
              aria-label={`Show image ${i + 1}`}
              onClick={() => setActive(i)}
            >
              <Image src={src} alt="" width={84} height={64} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
