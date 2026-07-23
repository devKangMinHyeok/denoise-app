// schema.org JSON-LD 빌더. 홈/블로그/툴 페이지가 이 객체를 <JsonLd>로 심는다.
// 수치/사실만 사용하고, 리뷰 평점 등 없는 데이터는 만들지 않는다.
// 로케일 인지형: url/inLanguage 는 로케일(en 루트, ko /ko/)에 맞춰 조립한다.
import { SITE, SITE_URL, abs, absLocale, absFromAsset, localeMeta } from "./site";
import type { Lang } from "./i18n";
import type { FaqItem } from "../app/_sections/faq-data";

const ORG_ID = `${SITE_URL}/#organization`;
const APP_ID = `${SITE_URL}/#app`;

/** "Jul 19, 2026" → "2026-07-19" (ISO date, 스키마 date 필드용) */
function isoDate(human: string): string {
  const d = new Date(human);
  return Number.isNaN(d.getTime()) ? human : d.toISOString().slice(0, 10);
}

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.name,
    url: abs("/"),
    logo: abs("/blog/vocast-mark.svg"),
  };
}

export function websiteSchema(lang: Lang = SITE.defaultLang) {
  const url = absLocale(lang, "/");
  return {
    "@type": "WebSite",
    "@id": `${url}#website`,
    name: SITE.name,
    url,
    inLanguage: localeMeta(lang).htmlLang,
    publisher: { "@id": ORG_ID },
  };
}

/** 제품 자체(맥 앱) 스키마. 가격/OS/카테고리 등 factual 정보만. */
export function softwareApplicationSchema(lang: Lang = SITE.defaultLang) {
  return {
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: SITE.name,
    description: localeMeta(lang).description,
    url: absLocale(lang, "/"),
    applicationCategory: "MultimediaApplication",
    operatingSystem: "macOS 12+ (Apple Silicon)",
    offers: {
      "@type": "Offer",
      price: SITE.price.amount,
      priceCurrency: SITE.price.currency,
      category: "one-time purchase",
    },
    publisher: { "@id": ORG_ID },
    inLanguage: localeMeta(lang).htmlLang,
  };
}

export function faqPageSchema(items: readonly FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export interface ArticleInput {
  slug: string;
  title: string;
  excerpt: string;
  cover: string; // asset()로 접두된 절대 경로
  date: string;
  authors: { name: string; url?: string; avatar?: string; role?: string }[];
}

export function articleSchema(post: ArticleInput, lang: Lang = SITE.defaultLang) {
  const url = absLocale(lang, `/blog/${post.slug}/`);
  return {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: absFromAsset(post.cover),
    datePublished: isoDate(post.date),
    dateModified: isoDate(post.date),
    inLanguage: localeMeta(lang).htmlLang,
    url,
    mainEntityOfPage: url,
    author: post.authors.map((a) => ({
      "@type": "Person",
      name: a.name,
      ...(a.role ? { jobTitle: a.role } : {}),
      ...(a.url ? { url: a.url } : {}),
      ...(a.avatar ? { image: absFromAsset(a.avatar) } : {}),
    })),
    publisher: { "@id": ORG_ID },
  };
}

/** items: [{ name, path(로케일 무관 경로) }] 순서대로 위치 부여 */
export function breadcrumbSchema(items: { name: string; path: string }[], lang: Lang = SITE.defaultLang) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absLocale(lang, it.path),
    })),
  };
}

// --- Free tools ---

export interface ToolSchemaInput {
  slug: string;
  name: string;
  description: string;
  howto?: { name: string; text: string }[];
}

/** 무료 도구 = 무료(price 0) WebApplication */
export function toolWebAppSchema(tool: ToolSchemaInput, lang: Lang = SITE.defaultLang) {
  const url = absLocale(lang, `/tools/${tool.slug}/`);
  return {
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (runs in a web browser)",
    browserRequirements: "Requires a modern browser. Runs entirely on the client, nothing is uploaded.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    isAccessibleForFree: true,
    inLanguage: localeMeta(lang).htmlLang,
    publisher: { "@id": ORG_ID },
  };
}

export function howToSchema(tool: ToolSchemaInput) {
  if (!tool.howto || tool.howto.length === 0) return null;
  return {
    "@type": "HowTo",
    name: `How to use the ${tool.name.toLowerCase()}`,
    description: tool.description,
    step: tool.howto.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

/** /tools 인덱스: 라이브 도구들의 ItemList */
export function toolListSchema(tools: { slug: string; name: string }[], lang: Lang = SITE.defaultLang) {
  return {
    "@type": "ItemList",
    name: "Free audio tools",
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      url: absLocale(lang, `/tools/${t.slug}/`),
    })),
  };
}

/** 여러 스키마를 하나의 @graph 로 묶어 반환 */
export function graph(...nodes: (object | null)[]) {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
