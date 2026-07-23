// 로케일 인지형 Next Metadata 빌더 단일 소스.
// - rootMetadata(lang): (en)/(ko) 루트 레이아웃 기본 메타(타이틀 템플릿/robots/OG 기반).
// - pageMetadata(lang, opts): 페이지별 canonical + hreflang(en/ko/x-default) + OG.
// hreflang 은 언어 무관 경로(예: "/blog/")를 받아 en/ko 절대 URL로 자동 조립한다.
import type { Metadata } from "next";
import {
  SITE,
  SITE_URL,
  absLocale,
  hreflangMap,
  localeMeta,
  alternateOgLocales,
} from "./site";
import type { Lang } from "./i18n";

/** 루트 레이아웃 메타. 로케일별 타이틀/설명/OG locale 을 심는다(경로별 canonical 은 페이지에서). */
export function rootMetadata(lang: Lang): Metadata {
  const m = localeMeta(lang);
  const title = `${SITE.name}, ${m.tagline}`;
  return {
    metadataBase: new URL(`${SITE_URL}/`),
    title: { default: title, template: `%s · ${SITE.name}` },
    description: m.description,
    applicationName: SITE.name,
    keywords: [...m.keywords],
    authors: [{ name: SITE.author.name }],
    creator: SITE.author.name,
    publisher: SITE.name,
    category: "technology",
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description: m.description,
      url: absLocale(lang, "/"),
      locale: m.ogLocale,
      alternateLocale: alternateOgLocales(lang),
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${SITE.name}, on-device voice studio` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: m.description,
      images: ["/og.png"],
      ...(SITE.twitter ? { site: SITE.twitter, creator: SITE.twitter } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    icons: { icon: "/blog/vocast-mark.svg" },
    ...(SITE.googleSiteVerification ? { verification: { google: SITE.googleSiteVerification } } : {}),
  };
}

export interface PageMetaOpts {
  path: string; // 로케일 무관 경로 (예: "/", "/blog/", "/blog/slug/")
  title?: string;
  description?: string;
  keywords?: readonly string[];
  ogType?: "website" | "article";
  image?: { url: string; width?: number; height?: number; alt?: string };
  article?: { publishedTime?: string; authors?: string[] };
}

/** 페이지별 메타: self canonical + hreflang languages + OG url/locale. */
export function pageMetadata(lang: Lang, opts: PageMetaOpts): Metadata {
  const m = localeMeta(lang);
  const url = absLocale(lang, opts.path);
  const description = opts.description ?? m.description;
  const images = opts.image ? [opts.image] : undefined;

  return {
    ...(opts.title ? { title: opts.title } : {}),
    description,
    ...(opts.keywords ? { keywords: [...opts.keywords] } : {}),
    alternates: { canonical: url, languages: hreflangMap(opts.path) },
    openGraph: {
      type: opts.ogType ?? "website",
      url,
      ...(opts.title ? { title: opts.title } : {}),
      description,
      locale: m.ogLocale,
      alternateLocale: alternateOgLocales(lang),
      ...(images ? { images } : {}),
      ...(opts.article ? opts.article : {}),
    },
    ...(opts.image
      ? { twitter: { card: "summary_large_image", ...(opts.title ? { title: opts.title } : {}), description, images: [opts.image.url] } }
      : {}),
  };
}
