// 툴 인덱스 본문(로케일 공유). 본문 카피는 영어 폴백, 네비/링크/스키마는 로케일 정확.
import * as React from "react";
import { Nav } from "../_sections/Nav";
import { Footer } from "../_sections/Footer";
import { JsonLd } from "../_seo/JsonLd";
import { graph, toolListSchema, breadcrumbSchema } from "../../lib/schema";
import { ToolsHero, ToolsGrid, ToolsCtaBand } from "./_components";
import { liveTools } from "./_data";
import type { Lang } from "../../lib/i18n";

// 인덱스 SEO 카피(영어 폴백). 한국어 번역은 핸드오프로 채운다.
export const TOOLS_INDEX_META = {
  title: "Free audio tools",
  description:
    "Free, private, in-browser audio tools from Vocast. Clean noise, record, convert, and plan audio. No signup, no upload, everything runs on your device.",
  keywords: ["free audio tools", "online audio tools", "in-browser audio", "no upload audio tools"],
};

export function ToolsIndexBody({ lang }: { lang: Lang }) {
  const live = liveTools();
  return (
    <main>
      <JsonLd
        data={graph(
          toolListSchema(live.map((t) => ({ slug: t.slug, name: t.name })), lang),
          breadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Tools", path: "/tools/" },
            ],
            lang,
          ),
        )}
      />
      <Nav lang={lang} active="Tools" />
      <ToolsHero />
      <ToolsGrid lang={lang} />
      <ToolsCtaBand lang={lang} />
      <div style={{ height: "clamp(56px,8vw,96px)" }} />
      <Footer lang={lang} />
    </main>
  );
}
