import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose } from "@timbre/design-system";
import { Nav } from "../../_sections/Nav";
import { Footer } from "../../_sections/Footer";
import { ArticleHeader, HeroCover, AuthorCard } from "../_components";
import { POSTS, getPost, postCards } from "../_data";

// Static export needs every slug up front.
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "The Vocast blog" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const Body = post.Body;
  const card = postCards().find((p) => p.slug === slug)!;

  return (
    <main>
      <Nav active="Blog" />

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 40px" }}>
        <ArticleHeader post={card} />
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

      <Footer />
    </main>
  );
}
