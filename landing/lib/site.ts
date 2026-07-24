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
// tagline/description/keywords 는 언어별 확정본(디자인/카피 핸드오프)에서 온다.
// 한국어 keywords 는 영어 직역이 아니라 실제 한국어 검색어다.

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

const KO_META: LocaleMeta = {
  tagline: "내 목소리로 어떤 원고든 낭독하기",
  description:
    "Vocast는 크리에이터를 위한 로컬 온디바이스 맥 음성 스튜디오입니다. 약 90초 녹음으로 내 목소리를 복제하고, 최대 20,000자 원고를 나처럼 들리는 목소리로 낭독합니다. 완전 로컬, 계정 없음, 구독 없음. $49 한 번 결제.",
  keywords: [
    "보이스 클로닝",
    "AI 목소리",
    "내 목소리 TTS",
    "텍스트 음성 변환",
    "온디바이스 음성",
    "로컬 음성 스튜디오",
    "맥 음성 앱",
    "오디오북 내레이션",
    "성우 대체",
    "MCP",
    "Apple Silicon",
    "목소리 생성기",
    "노이즈 제거",
  ],
  ogLocale: "ko_KR",
  htmlLang: "ko",
};

const LOCALE_META: Record<Lang, LocaleMeta> = {
  en: EN_META,
  ko: KO_META,
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

/** 카피의 {price} 토큰을 실제 가격 표기($49)로 치환한다. hero/pricing/finalCta 의 CTA용. */
export function withPrice(s: string): string {
  return s.replace(/\{price\}/g, `$${SITE.price.amount}`);
}
