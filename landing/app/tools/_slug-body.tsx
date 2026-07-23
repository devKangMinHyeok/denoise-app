// 툴 상세 본문(로케일 공유). 툴 UI/카피는 영어 폴백, 네비/링크/스키마는 로케일 정확.
import * as React from "react";
import { notFound } from "next/navigation";
import { Nav } from "../_sections/Nav";
import { Footer } from "../_sections/Footer";
import { JsonLd } from "../_seo/JsonLd";
import { graph, toolWebAppSchema, howToSchema, faqPageSchema, breadcrumbSchema } from "../../lib/schema";
import { ToolPageLayout } from "./_components";
import { getTool } from "./_data";
import { ReadingTime } from "./panels/ReadingTime";
import { NoiseRemover } from "./panels/NoiseRemover";
import { MicTest } from "./panels/MicTest";
import { VoiceRecorder } from "./panels/VoiceRecorder";
import { SilenceRemover } from "./panels/SilenceRemover";
import { Loudness } from "./panels/Loudness";
import { Converter } from "./panels/Converter";
import type { Lang } from "../../lib/i18n";

const PANELS: Record<string, React.ComponentType> = {
  "script-reading-time-calculator": ReadingTime,
  "audio-noise-remover": NoiseRemover,
  "mic-test": MicTest,
  "voice-recorder": VoiceRecorder,
  "silence-remover": SilenceRemover,
  "loudness-normalizer": Loudness,
  "audio-format-converter": Converter,
};

export function ToolSlugBody({ lang, slug }: { lang: Lang; slug: string }) {
  const tool = getTool(slug);
  if (!tool) notFound();
  const Panel = PANELS[slug];

  return (
    <main>
      <JsonLd
        data={graph(
          toolWebAppSchema({ slug: tool.slug, name: tool.name, description: tool.metaDescription ?? "", howto: tool.howto }, lang),
          howToSchema({ slug: tool.slug, name: tool.name, description: tool.metaDescription ?? "", howto: tool.howto }),
          tool.faqs ? faqPageSchema(tool.faqs) : null,
          breadcrumbSchema(
            [
              { name: "Home", path: "/" },
              { name: "Tools", path: "/tools/" },
              { name: tool.name, path: `/tools/${slug}/` },
            ],
            lang,
          ),
        )}
      />
      <Nav lang={lang} active="Tools" />
      <ToolPageLayout tool={tool} panel={Panel ? <Panel /> : null} lang={lang} />
      <Footer lang={lang} />
    </main>
  );
}
