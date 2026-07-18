import * as React from "react";
import { SectionHeading, Button } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";
import { AuroraGlow } from "../_ui/Glow";
import { Icon } from "../_ui/Icon";

const FEAT = '"calt","kern","liga","ss03"';
const INCLUDES = [
  "1 year of free updates, optional renewal after",
  "Keep the app and last version forever",
  "Local MCP server included",
  "Use on up to 3 Macs",
  "14-day, no-questions refund",
];

export function Pricing() {
  return (
    <Section id="pricing" style={{ overflow: "hidden" }}>
      <Container style={{ position: "relative" }}>
        <SectionHeading title="Not a subscription." accent="Buy once, it's yours." />
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
              <span style={{ marginBottom: 8, font: "400 15px/1 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>one-time</span>
            </div>
            <div style={{ height: 1, background: "var(--rc-hairline)", margin: "24px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {INCLUDES.map((f) => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ flex: "none", color: "var(--rc-accent-green)", marginTop: 1 }}><Icon name="check" size={17} /></span>
                  <span style={{ font: "400 14px/1.5 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 28 }}>
              <Button variant="primary" as="a" href="#pricing" style={{ width: "100%", height: 44 }}>
                Own it for $49, one-time
              </Button>
            </div>
            <div style={{ marginTop: 14, textAlign: "center", font: "400 12.5px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-ash)" }}>
              14-day refund · macOS (Apple Silicon)
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
