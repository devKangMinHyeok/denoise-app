// 사이트 전역 SEO/메타 단일 소스.
// layout(메타태그), sitemap, robots, JSON-LD가 모두 이 상수를 참조한다.
// 영어 우선 + 한국어 지원(이중언어). 영어는 루트(/), 한국어는 /ko/ 로 서빙한다.

import type { Lang } from "./i18n";

export const SITE = {
  name: "Vocast",

  // 정식 사이트는 Vercel + 커스텀 도메인(vocast.me). 루트 서빙(basePath 없음).
  origin: "https://vocast.me",

  ogImage: "/og.png", // public/og.png (1200x630)
  twitter: "", // @핸들 생기면 채우기 (예: "@vocast")

  price: { amount: "49", currency: "USD" },
  author: { name: "Minhyeok Kang" },

  // 기본 로케일. abs()/schema 등 로케일 미지정 경로가 이 값을 쓴다.
  defaultLang: "en" as Lang,

  // Google Search Console 소유확인(메타태그 방식). 발급 토큰을 넣으면 자동으로 <meta> 출력.
  googleSiteVerification: "",
} as const;

// --- 로케일별 메타 ---------------------------------------------------------
// 한국어 tagline/description/keywords는 임의 번역하지 않는다(표준 지침). 디자인
// 핸드오프로 채우기 전까지 영어로 폴백한다. ogLocale/htmlLang 은 번역이 아니라
// 언어 코드이므로 지금부터 정확히 지정한다.

interface LocaleMeta {
  tagline: string; // 검색결과 타이틀/OG에 쓰는 짧은 태그라인
  description: string;
  keywords: string[];
  ogLocale: string; // og:locale (예: en_US, ko_KR)
  htmlLang: string; // <html lang> 및 JSON-LD inLanguage
}

const EN_META: LocaleMeta = {
  tagline: "read any script in your own voice",
  description:
    "Vocast is a local, on-device Mac voice studio for creators. Clone your voice from about ninety seconds of audio, then narrate scripts up to 20,000 characters in a voice that sounds like you. Fully local, no account, no subscription. $49 one-time.",
  keywords: [
    "voice cloning",
    "AI voice",
    "text to speech",
    "on-device voice",
    "local voice studio",
    "Mac voice app",
    "narration",
    "voiceover",
    "audiobook narration",
    "MCP",
    "Apple Silicon",
    "voice generator",
    "noise removal",
  ],
  ogLocale: "en_US",
  htmlLang: "en",
};

const LOCALE_META: Record<Lang, LocaleMeta> = {
  en: EN_META,
  // 한국어: 카피는 영어 폴백(핸드오프 대기), 언어 코드만 ko 로.
  ko: { ...EN_META, ogLocale: "ko_KR", htmlLang: "ko" },
};

export function localeMeta(lang: Lang): LocaleMeta {
  return LOCALE_META[lang] ?? EN_META;
}

/** 로케일별 og:locale 상호 명시용: 대상 로케일을 뺀 나머지 로케일들의 og:locale. */
export function alternateOgLocales(lang: Lang): string[] {
  return (Object.keys(LOCALE_META) as Lang[])
    .filter((l) => l !== lang)
    .map((l) => LOCALE_META[l].ogLocale);
}

// --- URL 헬퍼 --------------------------------------------------------------

/** 사이트 정식 루트 URL (끝 슬래시 없음): https://vocast.me */
export const SITE_URL = SITE.origin;

/** 로케일 접두 경로. en → 그대로, ko → /ko 접두. 끝 슬래시 규약 유지. */
export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === SITE.defaultLang) return clean;
  // ko: "/" → "/ko/", "/blog/" → "/ko/blog/"
  return clean === "/" ? "/ko/" : `/ko${clean}`;
}

/** basePath 없는 경로 → 기본 로케일 절대 URL. 예: abs("/blog/") */
export function abs(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** 로케일 접두를 붙인 절대 URL. 예: absLocale("ko", "/blog/") → https://vocast.me/ko/blog/ */
export function absLocale(lang: Lang, path: string): string {
  return `${SITE_URL}${localePath(lang, path)}`;
}

/**
 * Next Metadata의 alternates.languages 용 hreflang 맵.
 * 언어 무관 경로(예: "/blog/")를 받아 { en, ko, "x-default" } 절대 URL을 만든다.
 */
export function hreflangMap(path: string): Record<string, string> {
  return {
    en: absLocale("en", path),
    ko: absLocale("ko", path),
    "x-default": absLocale("en", path),
  };
}

/** 이미 절대경로인 asset() 결과 → 절대 URL. (basePath 제거 후에도 하위호환) */
export function absFromAsset(assetPath: string): string {
  return `${SITE.origin}${assetPath.startsWith("/") ? assetPath : `/${assetPath}`}`;
}
