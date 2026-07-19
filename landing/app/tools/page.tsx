import type { Metadata } from "next";
import { Nav } from "../_sections/Nav";
import { Footer } from "../_sections/Footer";
import { JsonLd } from "../_seo/JsonLd";
import { abs } from "../../lib/site";
import { graph, toolListSchema, breadcrumbSchema } from "../../lib/schema";
import { ToolsHero, ToolsGrid, ToolsCtaBand } from "./_components";
import { liveTools } from "./_data";

const DESCRIPTION =
  "Free, private, in-browser audio tools from Vocast. Clean noise, record, convert, and plan audio. No signup, no upload, everything runs on your device.";

export const metadata: Metadata = {
  title: "Free audio tools",
  description: DESCRIPTION,
  alternates: { canonical: abs("/tools/") },
  keywords: ["free audio tools", "online audio tools", "in-browser audio", "no upload audio tools"],
  openGraph: { type: "website", url: abs("/tools/"), title: "Free audio tools, right in your browser", description: DESCRIPTION },
};

export default function ToolsIndex() {
  const live = liveTools();
  return (
    <main>
      <JsonLd
        data={graph(
          toolListSchema(live.map((t) => ({ slug: t.slug, name: t.name }))),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools/" },
          ]),
        )}
      />
      <Nav active="Tools" />
      <ToolsHero />
      <ToolsGrid />
      <ToolsCtaBand />
      <div style={{ height: "clamp(56px,8vw,96px)" }} />
      <Footer />
    </main>
  );
}
