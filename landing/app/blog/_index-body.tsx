// 블로그 인덱스 본문(로케일 공유). 본문 카피는 영어 폴백, 네비/링크는 로케일 정확.
import * as React from "react";
import { Nav } from "../_sections/Nav";
import { Footer } from "../_sections/Footer";
import { BlogHeader, FeaturedPost } from "./_components";
import { BlogList } from "./BlogList";
import { postCards } from "./_data";
import { JsonLd } from "../_seo/JsonLd";
import { graph, breadcrumbSchema } from "../../lib/schema";
import type { Lang } from "../../lib/i18n";

// 인덱스 SEO 카피(영어 폴백). 한국어 번역은 핸드오프로 채운다.
export const BLOG_INDEX_META = {
  title: "The Vocast blog",
  description:
    "How we build voice cloning and narration that you can measure. Methodology, metrics, local-first engineering, and product notes.",
};

export function BlogIndexBody({ lang }: { lang: Lang }) {
  const cards = postCards();
  const featured = cards.find((p) => p.featured) ?? cards[0];
  const rest = cards.filter((p) => !p.featured);

  return (
    <main>
      <JsonLd
        data={graph(
          breadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog/" },
            ],
            lang,
          ),
        )}
      />
      <Nav lang={lang} active="Blog" />
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 24px 96px" }}>
        <BlogHeader />
        <div style={{ marginBottom: 56 }}>
          <FeaturedPost post={featured} lang={lang} />
        </div>
        <BlogList posts={rest} lang={lang} />
      </div>
      <Footer lang={lang} />
    </main>
  );
}
