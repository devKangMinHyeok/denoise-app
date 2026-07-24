import * as React from "react";
import { Button, GradientText } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { Icon } from "../_ui/Icon";
import { RayBurst } from "../_ui/Glow";
import { HeroPlayer } from "./HeroPlayer";
import { getDict, type Lang } from "../../lib/i18n";
import { withPrice } from "../../lib/site";

const FEAT = '"calt","kern","liga","ss03"';

export function Hero({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).hero;
  return (
    <section id="top" style={{ position: "relative", overflow: "hidden", padding: "clamp(56px,7vw,96px) 0 clamp(64px,8vw,104px)" }}>
      <RayBurst />
      <Container style={{ position: "relative" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, alignItems: "center", justifyContent: "space-between" }}>
          {/* left copy */}
          <div style={{ flex: "1 1 460px", minWidth: 300, maxWidth: 620 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                borderRadius: "var(--rc-radius-full)",
                border: "1px solid var(--rc-hairline)",
                background: "rgba(255,255,255,.03)",
                font: "500 13px/1 var(--rc-font-sans)",
                letterSpacing: ".2px",
                fontFeatureSettings: FEAT,
                color: "var(--rc-body)",
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--rc-accent-green)" }} />
              {t.badge}
            </span>

            <h1
              style={{
                margin: "24px 0 0",
                font: "600 clamp(38px,5.6vw,62px)/1.06 var(--rc-font-sans)",
                letterSpacing: "-1px",
                fontFeatureSettings: FEAT,
                color: "var(--rc-ink)",
              }}
            >
              {t.titleA}
              <br />
              <GradientText>{t.titleB}</GradientText>
            </h1>

            <p
              style={{
                margin: "22px 0 0",
                maxWidth: 540,
                font: "400 clamp(16px,1.6vw,18px)/1.6 var(--rc-font-sans)",
                fontFeatureSettings: FEAT,
                color: "var(--rc-body)",
              }}
            >
              {t.body}
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 18, marginTop: 32 }}>
              <Button variant="primary" as="a" href="#pricing">
                {withPrice(t.ctaPrimary)}
              </Button>
              <a
                href="#top"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  font: "500 15px/1 var(--rc-font-sans)",
                  letterSpacing: ".2px",
                  fontFeatureSettings: FEAT,
                  color: "var(--rc-body)",
                }}
              >
                {t.ctaSecondary} <Icon name="arrowRight" size={15} />
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, color: "var(--rc-ash)" }}>
              <Icon name="check" size={14} />
              <span style={{ font: "400 13px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT }}>
                {t.note}
              </span>
            </div>
          </div>

          {/* right player */}
          <div style={{ flex: "1 1 440px", minWidth: 300, display: "flex", justifyContent: "center" }}>
            <HeroPlayer />
          </div>
        </div>
      </Container>
    </section>
  );
}
