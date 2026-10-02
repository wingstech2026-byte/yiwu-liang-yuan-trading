import { en, type Dictionary } from "./en";
import type { Locale } from "@/lib/site";

const dictionaries: Record<Locale, Dictionary> = { en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
