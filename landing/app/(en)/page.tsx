import type { Metadata } from "next";
import { HomeBody } from "../_pages/HomeBody";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("en", { path: "/" });

export default function Page() {
  return <HomeBody lang="en" />;
}
