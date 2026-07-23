import * as React from "react";
import { Logo } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { getDict, type Lang } from "../../lib/i18n";
import { localePath } from "../../lib/site";

const FEAT = '"calt","kern","liga","ss03"';

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} style={{ font: "400 14px/2 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>
      {children}
    </a>
  );
}

export function Footer({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).footer;
  return (
    <footer style={{ borderTop: "1px solid var(--rc-hairline)", padding: "56px 0 40px" }}>
      <Container>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 48, justifyContent: "space-between" }}>
          <div style={{ flex: "1 1 260px", maxWidth: 320 }}>
            <Logo height={22} wordmark="Vocast" />
            <p style={{ margin: "16px 0 0", font: "400 14px/1.6 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>
              {t.tagline}
            </p>
          </div>
          {t.columns.map((c) => (
            <div key={c.title} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ font: "500 13px/1 var(--rc-font-sans)", letterSpacing: ".4px", textTransform: "uppercase", color: "var(--rc-ash)", marginBottom: 12 }}>
                {c.title}
              </div>
              {c.links.map((l) => (
                <FooterLink key={l.label} href={localePath(lang, l.href)}>{l.label}</FooterLink>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--rc-hairline)", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", font: "400 13px/1.5 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-ash)" }}>
          <span>{t.copyright}</span>
          <span>{t.legal}</span>
        </div>
      </Container>
    </footer>
  );
}
