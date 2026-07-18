"use client";
import * as React from "react";
import { SectionHeading } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";

const FEAT = '"calt","kern","liga","ss03"';

const ITEMS: { q: string; a: string }[] = [
  { q: "Is it really not a subscription?", a: "Yes. $49 once. You get a year of free updates and can keep the app plus your last version forever, renewal after that is optional, not required." },
  { q: "Where is my voice data stored?", a: "On your Mac, in your user folder. There is no account and no server: your voiceprint, scripts and renders never leave the device." },
  { q: "Which Mac do I need?", a: "An Apple Silicon Mac (M1 or newer) on macOS 12+. Voice cloning uses on-device Metal acceleration; noise removal works everywhere." },
  { q: "How do I connect an AI agent?", a: "Vocast exposes a local MCP server over stdio. Point Claude, or any MCP-capable agent, at it and it can call denoise, clone_voice and the rest directly." },
  { q: "Can I clone any voice?", a: "Only your own voice, or a voice you have explicit consent to use. Cloning is built for creators narrating their own work, not for impersonation." },
  { q: "Is the source public?", a: "The engine, quality methodology and MCP server are open on GitHub. You can read exactly how cloning, scoring and denoising work." },
  { q: "What's the refund policy?", a: "14 days, no questions asked. If it doesn't fit your workflow, email us within two weeks for a full refund." },
];

function Row({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid var(--rc-hairline)" }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: "20px 4px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          font: "500 17px/1.4 var(--rc-font-sans)",
          letterSpacing: ".1px",
          fontFeatureSettings: FEAT,
          color: "var(--rc-ink)",
        }}
      >
        {q}
        <span style={{ flex: "none", color: "var(--rc-ray)", fontSize: 22, lineHeight: 1, transform: open ? "rotate(45deg)" : "none", transition: "transform .18s ease" }}>+</span>
      </button>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height .24s ease" }}>
        <p style={{ margin: 0, padding: "0 4px 20px", maxWidth: 640, font: "400 15px/1.6 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{a}</p>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <Section>
      <Container style={{ maxWidth: 820 }}>
        <SectionHeading title="Questions," accent="answered." />
        <div style={{ marginTop: 40 }}>
          {ITEMS.map((it, i) => (
            <Row key={i} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
