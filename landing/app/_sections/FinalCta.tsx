import * as React from "react";
import { Button, InstallCommand, GradientText } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { RayBurst } from "../_ui/Glow";
import { getDict, type Lang } from "../../lib/i18n";
import { withPrice } from "../../lib/site";

const FEAT = '"calt","kern","liga","ss03"';

export function FinalCta({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).finalCta;
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "clamp(80px,10vw,120px) 0" }}>
      <RayBurst style={{ opacity: 0.7 }} />
      <Container style={{ position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 22 }}>
          <h2 style={{ margin: 0, font: "600 clamp(32px,4.4vw,52px)/1.1 var(--rc-font-sans)", letterSpacing: "-.8px", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>
            {t.titleA}<br />
            <GradientText>{t.titleB}</GradientText>
          </h2>
          <div style={{ marginTop: 4 }}>
            <Button variant="primary" as="a" href="#pricing" style={{ height: 44 }}>
              {withPrice(t.cta)}
            </Button>
          </div>
          <span style={{ font: "400 13px/1 var(--rc-font-sans)", color: "var(--rc-ash)" }}>{t.or}</span>
          <InstallCommand command="brew install --cask vocast" />
          <span style={{ font: "400 13px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-stone)" }}>
            {t.note}
          </span>
        </div>
      </Container>
    </section>
  );
}
