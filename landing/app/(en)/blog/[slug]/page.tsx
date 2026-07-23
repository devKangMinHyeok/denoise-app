import type { Metadata } from "next";
import { BlogPostBody } from "../../../blog/_post-body";
import { POSTS, getPost } from "../../../blog/_data";
import { pageMetadata } from "../../../../lib/metadata";
import { absFromAsset } from "../../../../lib/site";

// 정적 export/SSG 를 위해 슬러그를 미리 뽑는다.
export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "The Vocast blog" };
  return pageMetadata("en", {
    path: `/blog/${slug}/`,
    title: post.title,
    description: post.excerpt,
    ogType: "article",
    image: { url: absFromAsset(post.cover), width: 1924, height: 1084, alt: post.title },
    article: { publishedTime: new Date(post.date).toISOString(), authors: post.authors.map((a) => a.name) },
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostBody lang="en" slug={slug} />;
}
