"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Entry direction of the element itself. */
  variant?: "up" | "left" | "right" | "zoom";
  /** Animate direct children one after another instead of the element as a whole. */
  stagger?: boolean;
  as?: "div" | "ul" | "ol";
}

/**
 * Scroll-triggered entrance animation. Content is fully visible without JS (server-rendered without the hidden
 * class); the hidden state is only applied on the client to elements that start below the fold, so nothing flashes.
 * Only opacity/transform are animated. Reduced-motion users get no movement (see base.css / components.css).
 */
export function Reveal({ children, delay = 0, className = "", variant = "up", stagger = false, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // already in view
    el.classList.add("is-hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.remove("is-hidden");
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal${stagger ? " reveal--stagger" : ""} ${className}`.trim()}
      data-variant={variant}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
