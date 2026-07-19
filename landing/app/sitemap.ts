import type { MetadataRoute } from "next";
import { abs } from "../lib/site";
import { POSTS } from "./blog/_data";
import { liveTools } from "./tools/_data";

// output:"export" 에서 정적 /sitemap.xml (→ /vocast/sitemap.xml)로 생성된다.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: abs("/blog/"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: abs("/tools/"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: abs("/demo/"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const tools: MetadataRoute.Sitemap = liveTools().map((t) => ({
    url: abs(`/tools/${t.slug}/`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const posts: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: abs(`/blog/${p.slug}/`),
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: p.featured ? 0.8 : 0.6,
  }));

  return [...staticPages, ...tools, ...posts];
}
