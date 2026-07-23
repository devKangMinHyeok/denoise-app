import * as React from "react";
import { SectionHeading, GradientText, InlineLink } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";
import { Icon } from "../_ui/Icon";
import { getDict, type Lang } from "../../lib/i18n";
import { localePath } from "../../lib/site";

const FEAT = '"calt","kern","liga","ss03"';

// 큰 지표 값은 로케일 무관(고유명사/수치)라 여기 고정. 라벨/설명은 사전에서 온다.
const BIG: React.ReactNode[] = [<GradientText>PNS</GradientText>, "0.0%", "≥ 0.85", "78+"];

export function Quality({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).quality;
  const stats = t.stats.map((s, i) => ({ ...s, big: BIG[i] }));
  return (
    <Section id="quality">
      <Container>
        <SectionHeading title={t.headingTitle} accent={t.headingAccent} />
        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 16,
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: "var(--rc-surface-card)",
                border: "1px solid var(--rc-hairline)",
                borderRadius: "var(--rc-radius-lg)",
                padding: 24,
              }}
            >
              <div style={{ font: "600 40px/1 var(--rc-font-sans)", letterSpacing: "-1px", color: "var(--rc-ink)" }}>{s.big}</div>
              <div style={{ margin: "12px 0 6px", font: "500 14px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>
                {s.label}
              </div>
              <p style={{ margin: 0, font: "400 13px/1.55 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{s.note}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <InlineLink href={localePath(lang, "/blog/measuring-prosody-not-vibes/")}>
            {t.methodologyLink}
          </InlineLink>
          <Icon name="arrowRight" size={15} />
        </div>
      </Container>
    </Section>
  );
}
