// i18n entry point. Locale list, types, and the dictionary lookup.
import { en, type Dict } from "./en";
import { ko } from "./ko";

export type Lang = "en" | "ko";
export type { Dict } from "./en";

export const LANGS: Lang[] = ["en", "ko"];
export const DEFAULT_LANG: Lang = "en";

const DICTS: Record<Lang, Dict> = { en, ko };

/** Copy dictionary for a locale (falls back to English for unknown input). */
export function getDict(lang: Lang): Dict {
  return DICTS[lang] ?? en;
}

/** Type guard: is this string one of our supported locales? */
export function isLang(value: string): value is Lang {
  return (LANGS as string[]).includes(value);
}
