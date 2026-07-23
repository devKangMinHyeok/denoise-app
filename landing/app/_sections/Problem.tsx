import * as React from "react";
import { SectionHeading } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";
import { Icon, IconProps } from "../_ui/Icon";
import { getDict, type Lang } from "../../lib/i18n";

const FEAT = '"calt","kern","liga","ss03"';

// 아이콘/색은 로케일 무관 데코라 여기 고정. 문구는 사전에서 온다.
const DECOR: { icon: IconProps["name"]; tint: string }[] = [
  { icon: "clock", tint: "var(--rc-accent-yellow)" },
  { icon: "lock", tint: "var(--rc-accent-blue)" },
  { icon: "scissors", tint: "var(--rc-accent-red)" },
];

export function Problem({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).problem;
  const cards = t.cards.map((c, i) => ({ ...c, ...DECOR[i] }));
  return (
    <Section>
      <Container>
        <SectionHeading title={t.headingTitle} accent={t.headingAccent} />
        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {cards.map((c) => (
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
