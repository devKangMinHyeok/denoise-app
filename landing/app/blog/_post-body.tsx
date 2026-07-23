// 블로그 글 상세 본문(로케일 공유). 글 본문은 영어 폴백, 네비/링크/스키마는 로케일 정확.
import * as React from "react";
import { notFound } from "next/navigation";
import { Prose } from "@timbre/design-system";
import { Nav } from "../_sections/Nav";
import { Footer } from "../_sections/Footer";
import { ArticleHeader, HeroCover, AuthorCard } from "./_components";
import { getPost, postCards } from "./_data";
import { JsonLd } from "../_seo/JsonLd";
import { graph, articleSchema, breadcrumbSchema } from "../../lib/schema";
import type { Lang } from "../../lib/i18n";

export function BlogPostBody({ lang, slug }: { lang: Lang; slug: string }) {
  const post = getPost(slug);
  if (!post) notFound();
  const Body = post.Body;
  const card = postCards().find((p) => p.slug === slug)!;

  return (
    <main>
      <JsonLd
        data={graph(
          articleSchema(
            {
              slug,
              title: post.title,
              excerpt: post.excerpt,
              cover: post.cover,
              date: post.date,
              authors: post.authors,
            },
            lang,
          ),
          breadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog/" },
              { name: post.title, path: `/blog/${slug}/` },
            ],
            lang,
          ),
        )}
      />
      <Nav lang={lang} active="Blog" />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 40px" }}>
        <ArticleHeader post={card} lang={lang} />
      </div>

      <div style={{ padding: "0 24px" }}>
        <HeroCover src={post.cover} />
      </div>

      <div style={{ maxWidth: 760, margin: "48px auto 0", padding: "0 24px 96px" }}>
        <Prose measure={760}>
          <Body />
        </Prose>
        <div style={{ marginTop: 56 }}>
          <AuthorCard author={post.authors[0]} />
        </div>
      </div>

      <Footer lang={lang} />
    </main>
  );
}
