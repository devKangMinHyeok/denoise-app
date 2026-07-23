import * as React from "react";
import { SectionHeading, Button } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";
import { AuroraGlow } from "../_ui/Glow";
import { Icon } from "../_ui/Icon";
import { getDict, type Lang } from "../../lib/i18n";

const FEAT = '"calt","kern","liga","ss03"';

export function Pricing({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).pricing;
  return (
    <Section id="pricing" style={{ overflow: "hidden" }}>
      <Container style={{ position: "relative" }}>
        <SectionHeading title={t.headingTitle} accent={t.headingAccent} />
        <div style={{ position: "relative", marginTop: 48, display: "flex", justifyContent: "center" }}>
          <AuroraGlow style={{ transform: "scale(1.3)" }} />
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 460,
              borderRadius: "var(--rc-radius-xl)",
              border: "1px solid rgba(245,115,43,.4)",
              background: "var(--rc-surface-card)",
              padding: 32,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <span style={{ font: "600 56px/1 var(--rc-font-sans)", letterSpacing: "-1.5px", color: "var(--rc-ink)" }}>$49</span>
              <span style={{ marginBottom: 8, font: "400 15px/1 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{t.oneTime}</span>
            </div>
            <div style={{ height: 1, background: "var(--rc-hairline)", margin: "24px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {t.includes.map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ flex: "none", color: "var(--rc-accent-green)", marginTop: 1 }}><Icon name="check" size={17} /></span>
                  <span style={{ font: "400 14px/1.5 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <Button variant="primary" as="a" href="#pricing" style={{ width: "100%", height: 44 }}>
                {t.cta}
              </Button>
            </div>
            <div style={{ marginTop: 14, textAlign: "center", font: "400 12.5px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-ash)" }}>
              {t.fineprint}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
