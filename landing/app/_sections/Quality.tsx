import * as React from "react";
import { SectionHeading, GradientText, InlineLink } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";
import { Icon } from "../_ui/Icon";
import { asset } from "../../lib/asset";

const FEAT = '"calt","kern","liga","ss03"';

const STATS = [
  { big: <GradientText>PNS</GradientText>, label: "Prosody north-star", note: "Naturalness scored against a human baseline on every render." },
  { big: "0.0%", label: "Word-ending loss gate", note: "Denoise is rejected if it shaves the tail of a sentence." },
  { big: "≥ 0.85", label: "Speaker similarity", note: "Every clone is measured against your real voiceprint." },
  { big: "78+", label: "Automated tests", note: "The whole evaluation stack is guarded in CI, not vibes." },
];

export function Quality() {
  return (
    <Section id="quality">
      <Container>
        <SectionHeading title="We didn't build this on" accent="vibes." />
        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: 16,
          }}
        >
          {STATS.map((s, i) => (
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
          <InlineLink href={asset("/blog/measuring-prosody-not-vibes/")}>
            Read the methodology
          </InlineLink>
          <Icon name="arrowRight" size={15} />
        </div>
      </Container>
    </Section>
  );
}
