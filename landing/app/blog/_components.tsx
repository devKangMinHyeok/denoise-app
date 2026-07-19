import * as React from "react";
import Link from "next/link";
import { Avatar, CategoryTag } from "@timbre/design-system";
import type { PostCard, Author } from "./_data";

const FEAT = '"calt","kern","liga","ss03"';

function names(authors: Author[]) {
  return authors.map((a) => a.name).join(" & ");
}

/** Blog index header: eyebrow pill + title + subhead. */
export function BlogHeader() {
  return (
    <header style={{ marginBottom: 48 }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 14px",
          borderRadius: "var(--rc-radius-full)",
          border: "1px solid var(--rc-hairline)",
          background: "rgba(255,255,255,.03)",
          font: "500 13px/1 var(--rc-font-sans)",
          letterSpacing: ".2px",
          fontFeatureSettings: FEAT,
          color: "var(--rc-body)",
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--rc-ray)" }} />
        Field notes from the studio
      </span>
      <h1
        style={{
          margin: "22px 0 0",
          font: "600 clamp(40px,6vw,56px)/1.08 var(--rc-font-sans)",
          letterSpacing: "-.5px",
          fontFeatureSettings: FEAT,
          color: "var(--rc-ink)",
        }}
      >
        The Vocast blog<span style={{ color: "var(--rc-ray)" }}>.</span>
      </h1>
      <p style={{ margin: "18px 0 0", maxWidth: 620, font: "400 18px/1.6 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>
        How we build voice cloning and narration that you can measure. Methodology, metrics,
        local-first engineering, and product notes.
      </p>
    </header>
  );
}

/** Full-width featured lead card: cover left, body right (stacks under ~760px). */
export function FeaturedPost({ post }: { post: PostCard }) {
  return (
    <Link
      href={`/blog/${post.slug}/`}
      style={{
        display: "flex",
        flexWrap: "wrap",
        border: "1px solid var(--rc-hairline)",
        borderRadius: 14,
        overflow: "hidden",
        background: "var(--rc-surface)",
        textDecoration: "none",
      }}
    >
      <div
        style={{
          flex: "1 1 420px",
          minWidth: 280,
          minHeight: 300,
          background: `center/cover no-repeat url(${post.cover})`,
        }}
      />
      <div style={{ flex: "1 1 380px", minWidth: 280, padding: 36, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <CategoryTag accent style={{ textTransform: "uppercase", letterSpacing: ".6px" }}>{post.category}</CategoryTag>
          <span style={{ font: "400 13px/1 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>
            Featured · {post.readTime}
          </span>
        </div>
        <h2 style={{ margin: 0, font: "600 clamp(24px,3vw,32px)/1.18 var(--rc-font-sans)", letterSpacing: "-.2px", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>
          {post.title}
        </h2>
        <p style={{ margin: 0, font: "400 16px/1.6 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{post.excerpt}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
          <Avatar src={post.authors[0]?.avatar} initials={post.authors[0]?.name?.[0]} size={28} />
          <span style={{ font: "400 13px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>{names(post.authors)}</span>
          <span style={{ font: "400 13px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-stone)" }}>· {post.date}</span>
        </div>
      </div>
    </Link>
  );
}

/** Post detail header: back link, meta, title, deck, author row bounded by hairlines. */
export function ArticleHeader({ post }: { post: PostCard }) {
  const a = post.authors[0];
  return (
    <header style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <Link href="/blog" style={{ font: "500 14px/1.4 var(--rc-font-sans)", letterSpacing: ".2px", fontFeatureSettings: FEAT, color: "var(--rc-mute)", textDecoration: "none" }}>
        ← Back to blog
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <CategoryTag accent style={{ textTransform: "uppercase", letterSpacing: ".6px" }}>{post.category}</CategoryTag>
        <span style={{ font: "400 13px/1 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>
          {post.readTime} · {post.date}
        </span>
      </div>
      <h1 style={{ margin: 0, font: "600 clamp(30px,4.4vw,44px)/1.14 var(--rc-font-sans)", letterSpacing: "-.5px", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>
        {post.title}
      </h1>
      <p style={{ margin: 0, font: "400 19px/1.6 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{post.excerpt}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "20px 0", borderTop: "1px solid var(--rc-hairline)", borderBottom: "1px solid var(--rc-hairline)" }}>
        <Avatar src={a?.avatar} initials={a?.name?.[0]} size={40} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ font: "500 15px/1.3 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>{names(post.authors)}</span>
          {a?.role && <span style={{ font: "400 13px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{a.role}</span>}
        </div>
      </div>
    </header>
  );
}

/** Full-bleed-in-column cover, 16:7. */
export function HeroCover({ src }: { src: string }) {
  return (
    <figure style={{ margin: "0 auto", maxWidth: 960 }}>
      <div
        style={{
          border: "1px solid var(--rc-hairline)",
          borderRadius: "var(--rc-radius-xl)",
          overflow: "hidden",
          aspectRatio: "16 / 7",
          background: `center/cover no-repeat url(${src})`,
        }}
      />
    </figure>
  );
}

/** End-of-article author card. */
export function AuthorCard({ author }: { author: Author }) {
  return (
    <div style={{ background: "var(--rc-surface)", border: "1px solid var(--rc-hairline)", borderRadius: 14, padding: 24, display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar src={author.avatar} initials={author.name?.[0]} size={52} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ font: "500 16px/1.3 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>{author.name}</span>
        {author.bio && <span style={{ font: "400 14px/1.6 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)", maxWidth: 520 }}>{author.bio}</span>}
      </div>
    </div>
  );
}
