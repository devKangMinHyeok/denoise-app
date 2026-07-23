import type { Metadata } from "next";
import { BlogIndexBody, BLOG_INDEX_META } from "../../../blog/_index-body";
import { pageMetadata } from "../../../../lib/metadata";

export const metadata: Metadata = pageMetadata("ko", { path: "/blog/", ...BLOG_INDEX_META });

export default function BlogIndex() {
  return <BlogIndexBody lang="ko" />;
}
