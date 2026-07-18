import * as React from "react";
import { SectionHeading } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";
import { Icon, IconProps } from "../_ui/Icon";

const FEAT = '"calt","kern","liga","ss03"';

const CARDS: { icon: IconProps["name"]; tint: string; title: string; body: string }[] = [
  {
    icon: "clock",
    tint: "var(--rc-accent-yellow)",
    title: "Re-recording one line costs an hour",
    body: "Fix a single awkward take and you re-record, re-level and re-export the whole thing. Again.",
  },
  {
    icon: "lock",
    tint: "var(--rc-accent-blue)",
    title: "Subscriptions pile up — and your voice lives on someone's server",
    body: "Cloud voice tools bill monthly and keep your voiceprint. You never really own either one.",
  },
  {
    icon: "scissors",
    tint: "var(--rc-accent-red)",
    title: "Noise removal that erases your word endings",
    body: "Aggressive denoisers swallow the tail of every sentence, and the result sounds processed.",
  },
];

export function Problem() {
  return (
    <Section>
      <Container>
        <SectionHeading title="Great narration shouldn't cost you your" accent="time or your voice." />
        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {CARDS.map((c) => (
            <div
              key={c.title}
              style={{
                background: "var(--rc-surface-card)",
                border: "1px solid var(--rc-hairline)",
                borderRadius: "var(--rc-radius-xl)",
                padding: 22,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--rc-radius-md)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: c.tint,
                  background: "color-mix(in srgb, currentColor 14%, transparent)",
                }}
              >
                <Icon name={c.icon} size={20} />
              </div>
              <h3
                style={{
                  margin: "16px 0 8px",
                  font: "500 18px/1.35 var(--rc-font-sans)",
                  letterSpacing: ".1px",
                  fontFeatureSettings: FEAT,
                  color: "var(--rc-ink)",
                }}
              >
                {c.title}
              </h3>
              <p style={{ margin: 0, font: "400 14px/1.6 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
