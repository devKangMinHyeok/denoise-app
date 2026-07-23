import type { Metadata } from "next";
import { ToolsIndexBody, TOOLS_INDEX_META } from "../../tools/_index-body";
import { pageMetadata } from "../../../lib/metadata";

export const metadata: Metadata = pageMetadata("en", { path: "/tools/", ...TOOLS_INDEX_META });

export default function ToolsIndex() {
  return <ToolsIndexBody lang="en" />;
}
