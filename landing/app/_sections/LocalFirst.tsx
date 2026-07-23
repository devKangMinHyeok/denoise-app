import * as React from "react";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";
import { Icon } from "../_ui/Icon";
import { getDict, type Lang } from "../../lib/i18n";

const FEAT = '"calt","kern","liga","ss03"';

export function LocalFirst({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).localFirst;
  return (
    <Section id="privacy">
      <Container>
        <div
          style={{
            background: "var(--rc-surface)",
            border: "1px solid var(--rc-hairline)",
            borderRadius: "var(--rc-radius-xl)",
            padding: "clamp(28px,4vw,48px)",
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ flex: "1 1 360px", minWidth: 280, maxWidth: 480 }}>
            <span style={{ display: "inline-flex", color: "var(--rc-ray)", marginBottom: 16 }}>
              <Icon name="shield" size={26} />
            </span>
            <h2 style={{ margin: 0, font: "600 clamp(28px,3.4vw,38px)/1.15 var(--rc-font-sans)", letterSpacing: "-.4px", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>
              {t.heading}
            </h2>
          </div>
          <div style={{ flex: "1 1 320px", minWidth: 260, display: "flex", flexDirection: "column", gap: 16 }}>
            {t.points.map((p) => (
              <div key={p.title} style={{ display: "flex", gap: 12 }}>
                <span style={{ flex: "none", color: "var(--rc-accent-green)", marginTop: 2 }}>
                  <Icon name="check" size={18} />
                </span>
                <div>
                  <div style={{ font: "500 15px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>{p.title}</div>
                  <div style={{ font: "400 14px/1.55 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{p.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
