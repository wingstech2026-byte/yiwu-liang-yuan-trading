"use client";

import { Icon } from "@/components/ui/Icon";
import { useQuote } from "@/components/quote/QuoteProvider";

interface Props {
  slug: string;
  name: string;
  category: string; // category display name
  small?: boolean;
}

/** Toggle a product in/out of the visitor's quote list. */
export function AddToQuoteButton({ slug, name, category, small }: Props) {
  const { has, toggle, labels } = useQuote();
  const inList = has(slug);
  return (
    <button
      type="button"
      className={`btn btn--outline${small ? " btn--sm" : ""} quote-toggle${inList ? " is-added" : ""}`}
      aria-pressed={inList}
      onClick={() => toggle({ slug, name, category })}
    >
      <Icon name={inList ? "check" : "plus"} size={18} />
      {inList ? labels.added : labels.add}
      <span className="sr-only">: {name}</span>
    </button>
  );
}
