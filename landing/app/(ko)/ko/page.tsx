import type { Metadata } from "next";
import { HomeBody } from "../../_pages/HomeBody";
import { pageMetadata } from "../../../lib/metadata";

export const metadata: Metadata = pageMetadata("ko", { path: "/" });

export default function Page() {
  return <HomeBody lang="ko" />;
}
