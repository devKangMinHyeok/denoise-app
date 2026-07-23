// 홈 페이지 본문(로케일 공유). (en)/page.tsx 와 (ko)/ko/page.tsx 가 lang 만 바꿔 재사용.
import * as React from "react";
import { Nav } from "../_sections/Nav";
import { Hero } from "../_sections/Hero";
import { Problem } from "../_sections/Problem";
import { Features } from "../_sections/Features";
import { Quality } from "../_sections/Quality";
import { LocalFirst } from "../_sections/LocalFirst";
import { Mcp } from "../_sections/Mcp";
import { Pricing } from "../_sections/Pricing";
import { Faq } from "../_sections/Faq";
import { FinalCta } from "../_sections/FinalCta";
import { Footer } from "../_sections/Footer";
import { JsonLd } from "../_seo/JsonLd";
import { graph, organizationSchema, websiteSchema, softwareApplicationSchema, faqPageSchema } from "../../lib/schema";
import { getDict, type Lang } from "../../lib/i18n";

export function HomeBody({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <main>
      <JsonLd
        data={graph(
          organizationSchema(),
          websiteSchema(lang),
          softwareApplicationSchema(lang),
          faqPageSchema(t.faq.items),
        )}
      />
      <Nav lang={lang} />
      <Hero lang={lang} />
      <Problem lang={lang} />
      <Features lang={lang} />
      <Quality lang={lang} />
      <LocalFirst lang={lang} />
      <Mcp lang={lang} />
      <Pricing lang={lang} />
      <Faq lang={lang} />
      <FinalCta lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
