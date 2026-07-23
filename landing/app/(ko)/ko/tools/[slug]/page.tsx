import type { Metadata } from "next";
import { ToolSlugBody } from "../../../../tools/_slug-body";
import { TOOLS, getTool } from "../../../../tools/_data";
import { pageMetadata } from "../../../../../lib/metadata";

export function generateStaticParams() {
  return TOOLS.filter((t) => t.live).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return { title: "Free audio tools" };
  return pageMetadata("ko", {
    path: `/tools/${slug}/`,
    title: tool.metaTitle ?? tool.name,
    description: tool.metaDescription,
    keywords: tool.keywords,
  });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ToolSlugBody lang="ko" slug={slug} />;
}
