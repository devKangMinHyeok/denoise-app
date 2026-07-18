import * as React from "react";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";
import { WindowMock } from "../_ui/WindowMock";
import { AuroraGlow } from "../_ui/Glow";
import { Icon } from "../_ui/Icon";

const FEAT = '"calt","kern","liga","ss03"';
const mono = { font: "400 12.5px/1.6 var(--rc-font-mono)" } as const;

function ToolCall({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ ...mono, color: "var(--rc-body)", padding: "6px 0" }}>
      <span style={{ color: "var(--rc-ray)" }}>▸ </span>
      {children}
    </div>
  );
}

const TOOLS = [
  { name: "denoise", desc: "clean a file, keep endings" },
  { name: "clone_voice", desc: "narrate text in a profile" },
  { name: "list_voice_profiles", desc: "your saved voices" },
  { name: "list_history", desc: "recent renders" },
  { name: "health", desc: "engine status" },
];

export function Mcp() {
  return (
    <Section id="mcp" style={{ overflow: "hidden" }}>
      <AuroraGlow />
      <Container style={{ position: "relative" }}>
        <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 48px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: "var(--rc-radius-full)",
              border: "1px solid var(--rc-hairline)",
              background: "rgba(255,255,255,.03)",
              font: "500 13px/1 var(--rc-font-sans)",
              letterSpacing: ".2px",
              fontFeatureSettings: FEAT,
              color: "var(--rc-body)",
            }}
          >
            <span style={{ color: "var(--rc-ray)", display: "inline-flex" }}><Icon name="terminal" size={14} /></span>
            AI-native · Model Context Protocol
          </span>
          <h2 style={{ margin: "20px 0 14px", font: "600 clamp(30px,4vw,46px)/1.12 var(--rc-font-sans)", letterSpacing: "-.6px", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>
            Claude operates this app directly.
          </h2>
          <p style={{ margin: 0, font: "400 clamp(15px,1.6vw,18px)/1.6 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>
            Vocast ships a local MCP server, so an AI agent can clone, narrate and denoise for you —
            entirely on your machine, no network in the loop.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16, alignItems: "start" }}>
          {/* chat mockup */}
          <WindowMock title="Claude · vocast (local)">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ alignSelf: "flex-end", maxWidth: "85%", padding: "10px 14px", borderRadius: 12, background: "var(--rc-surface-elevated)", border: "1px solid var(--rc-hairline)", font: "400 13px/1.5 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>
                Clean this interview and read the intro in my voice.
              </div>
              <div style={{ maxWidth: "92%", padding: "12px 14px", borderRadius: 12, background: "var(--rc-canvas)", border: "1px solid var(--rc-hairline)" }}>
                <ToolCall>denoise(&quot;interview.mov&quot;, mode=standard) → speech loss 0.0% ✓</ToolCall>
                <ToolCall>list_voice_profiles() → picked &quot;MyVoice&quot;</ToolCall>
                <ToolCall>clone_voice(text=…, profile_id=&quot;MyVoice&quot;) → PNS 84.2</ToolCall>
                <div style={{ marginTop: 8, font: "400 13px/1.5 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>
                  Done — clean cut plus a narrated intro in MyVoice, saved locally.
                </div>
              </div>
            </div>
          </WindowMock>

          {/* tool grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
            {TOOLS.map((t) => (
              <div key={t.name} style={{ background: "var(--rc-surface-card)", border: "1px solid var(--rc-hairline)", borderRadius: "var(--rc-radius-md)", padding: "14px 16px" }}>
                <div style={{ font: "500 13px/1.2 var(--rc-font-mono)", color: "var(--rc-ink)" }}>{t.name}</div>
                <div style={{ marginTop: 6, font: "400 12px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{t.desc}</div>
              </div>
            ))}
            <div style={{ borderRadius: "var(--rc-radius-md)", border: "1px solid rgba(245,115,43,.4)", background: "rgba(245,115,43,.08)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "var(--rc-ray)", display: "inline-flex" }}><Icon name="shield" size={18} /></span>
              <div style={{ font: "500 12.5px/1.4 var(--rc-font-sans)", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>
                All local stdio — no network, no cloud.
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
