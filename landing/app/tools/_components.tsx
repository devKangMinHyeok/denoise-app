import * as React from "react";
import Link from "next/link";
import { Button, SectionHeading, GradientText } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { WindowMock } from "../_ui/WindowMock";
import { Waveform } from "../_ui/Waveform";
import { RayBurst } from "../_ui/Glow";
import { Icon } from "../_ui/Icon";
import { TOOLS, liveTools, type ToolDef, type VizKind } from "./_data";
import { FaqAccordion } from "./_ui";
import { localePath } from "../../lib/site";
import type { Lang } from "../../lib/i18n";

const FEAT = '"calt","kern","liga","ss03"';
const sans = "var(--rc-font-sans)";
const mono = "var(--rc-font-mono)";
const well = "#0a0b0c";
const softLine = "#1a1c1d";

function ShieldPill({ text }: { text: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: "var(--rc-radius-full)", border: "1px solid var(--rc-hairline)", background: "rgba(245,115,43,.06)", font: `400 13px/1 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>
      <span style={{ color: "var(--rc-ray)", display: "inline-flex" }}><Icon name="shield" size={14} /></span>
      {text}
    </span>
  );
}

// ---- index hero ----
export function ToolsHero() {
  return (
    <div style={{ position: "relative" }}>
      <RayBurst />
      <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20, padding: "clamp(64px,9vw,120px) 24px clamp(40px,6vw,72px)" }}>
        <span style={{ padding: "6px 14px", borderRadius: "var(--rc-radius-full)", border: "1px solid var(--rc-hairline)", font: `500 12.5px/1 ${mono}`, letterSpacing: ".6px", textTransform: "uppercase", color: "var(--rc-mute)" }}>Free tools</span>
        <h1 style={{ margin: 0, font: `600 clamp(38px,6.5vw,60px)/1.08 ${sans}`, letterSpacing: "-.5px", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>
          Free <span style={{ color: "var(--rc-ray)" }}>audio tools</span>, right in your browser
        </h1>
        <p style={{ margin: 0, maxWidth: 560, font: `400 clamp(16px,2.2vw,19px)/1.6 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>
          Instant, private utilities for cleaning, recording, converting and planning audio. No signup, no upload. Everything runs on your device.
        </p>
        <ShieldPill text="Runs in your browser. Nothing is uploaded." />
      </div>
    </div>
  );
}

// ---- per-tool card mini-viz (static) ----
function Pill({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <span style={{ font: `400 11.5px/1 ${mono}`, padding: "4px 9px", borderRadius: 6, background: active ? "rgba(245,115,43,.14)" : "transparent", border: active ? "none" : "1px solid var(--rc-hairline)", color: active ? "var(--rc-ray)" : "var(--rc-mute)" }}>{children}</span>
  );
}
function MonoLine({ children, tone }: { children: React.ReactNode; tone?: "ok" | "accent" }) {
  const c = tone === "ok" ? "var(--rc-accent-green)" : tone === "accent" ? "var(--rc-ray)" : "var(--rc-mute)";
  return <div style={{ font: `400 11.5px/1.5 ${mono}`, color: c }}>{children}</div>;
}

export function ToolCardViz({ viz }: { viz: VizKind }) {
  if (viz === "noise")
    return (<><div style={{ display: "flex", gap: 6 }}><Pill active>Cleaned</Pill><Pill>Original</Pill></div><Waveform count={40} mode="smooth" pos={1} activeColor="var(--rc-ray)" height={28} /><MonoLine>speech loss 0.0% · noise -18 dB</MonoLine></>);
  if (viz === "reading") {
    const line = { font: `400 12px/1.4 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } as const;
    return (<><div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%" }}>
      <div style={line}>The story begins on a quiet street…</div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "6px 9px", borderRadius: 6, border: "1px solid var(--rc-hairline)", background: "var(--rc-surface-elevated)", font: `400 12px/1.4 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>By the second act the pace…</span><span style={{ color: "var(--rc-ray)", flex: "none" }}>editing</span></div>
      <div style={line}>Everything changes when…</div>
    </div><MonoLine>1,240 words · 8:15</MonoLine></>);
  }
  if (viz === "mic")
    return (<><Waveform count={40} mode="raw" pos={1} activeColor="var(--rc-ray)" height={28} /><div style={{ height: 6, width: "100%", borderRadius: 3, background: "var(--rc-surface-elevated)", overflow: "hidden" }}><div style={{ width: "58%", height: "100%", background: "var(--rc-accent-green)" }} /></div><MonoLine tone="ok">level -12 dB · safe</MonoLine></>);
  if (viz === "recorder")
    return (<><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff6161" }} /><span style={{ font: `500 22px/1 ${mono}`, color: "var(--rc-ink)" }}>00:12</span></div><Waveform count={40} mode="raw" pos={1} activeColor="var(--rc-ray)" height={28} /></>);
  if (viz === "silence")
    return (<><div style={{ position: "relative", width: "100%" }}><Waveform count={44} mode="raw" pos={1} activeColor="var(--rc-ray)" height={30} />{[18, 54, 82].map((l) => (<span key={l} style={{ position: "absolute", top: 0, bottom: 0, left: `${l}%`, width: 10, background: "rgba(255,97,97,.22)", borderLeft: "1px solid rgba(255,97,97,.5)", borderRight: "1px solid rgba(255,97,97,.5)" }} />))}</div><MonoLine>removed 0:42 · 9 regions</MonoLine></>);
  if (viz === "loudness") {
    const row = (label: string, val: string, accent: boolean) => (
      <div style={{ display: "flex", justifyContent: "space-between", font: `400 11px/1 ${mono}`, color: accent ? "var(--rc-ray)" : "var(--rc-mute)", marginBottom: 4 }}><span>{label}</span><span>{val}</span></div>
    );
    return (<div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
      <div>{row("before", "-19.4 LUFS", false)}<div style={{ height: 7, borderRadius: 4, background: "var(--rc-surface-elevated)", overflow: "hidden" }}><div style={{ width: "52%", height: "100%", background: "#434345" }} /></div></div>
      <div>{row("after", "-14.0 LUFS", true)}<div style={{ height: 7, borderRadius: 4, background: "var(--rc-surface-elevated)", overflow: "hidden" }}><div style={{ width: "74%", height: "100%", background: "linear-gradient(90deg,#ff9448,#e0561c)" }} /></div></div>
      <MonoLine>target -14 · true peak -1.2 dBTP</MonoLine>
    </div>);
  }
  // convert
  return (<><div style={{ font: `400 12.5px/1.4 ${mono}` }}><span style={{ color: "var(--rc-body)" }}>track.wav</span> <span style={{ color: "var(--rc-stone)" }}>→</span> <span style={{ color: "var(--rc-ray)" }}>track.mp3</span></div><div style={{ height: 6, width: "100%", borderRadius: 3, background: "var(--rc-surface-elevated)", overflow: "hidden" }}><div style={{ width: "70%", height: "100%", background: "var(--rc-ray)" }} /></div><MonoLine>mp3 · 320 kbps · on your device</MonoLine></>);
}

export function ToolCard({ tool, lang = "en" }: { tool: ToolDef; lang?: Lang }) {
  const inner = (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <WindowMock title={tool.windowTitle} style={{ background: "var(--rc-surface)" }} bodyStyle={{ minHeight: 154, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 12 }}>
        <ToolCardViz viz={tool.viz} />
      </WindowMock>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0, font: `600 clamp(19px,1.9vw,22px)/1.25 ${sans}`, letterSpacing: "-.2px", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>{tool.cardTitle}</h3>
          {!tool.live && <span style={{ font: `400 10.5px/1 ${mono}`, textTransform: "uppercase", letterSpacing: ".5px", padding: "3px 7px", borderRadius: 5, border: "1px solid var(--rc-hairline)", color: "var(--rc-ash)" }}>soon</span>}
        </div>
        <p style={{ margin: "8px 0 0", font: `400 14.5px/1.55 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{tool.cardDesc}</p>
      </div>
    </div>
  );
  const base: React.CSSProperties = { display: "block", padding: "clamp(20px,2.2vw,26px)", background: well, border: `1px solid ${softLine}`, borderRadius: 16, textDecoration: "none" };
  if (!tool.live) return <div style={{ ...base, opacity: 0.72 }}>{inner}</div>;
  return (
    <Link href={localePath(lang, `/tools/${tool.slug}/`)} className="vt-card" style={base}>{inner}</Link>
  );
}

// ---- index closing CTA band ----
export function ToolsCtaBand({ lang = "en" }: { lang?: Lang }) {
  return (
    <div style={{ maxWidth: 1200, margin: "clamp(48px,7vw,88px) auto 0", padding: "0 24px" }}>
      <div style={{ background: well, border: `1px solid ${softLine}`, borderRadius: 20, padding: "clamp(28px,4vw,52px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
          <span style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--rc-ink)", color: "var(--rc-canvas)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Icon name="play" size={18} /></span>
          <span style={{ font: `500 15px/1.3 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>Hear it in your own voice</span>
          <span style={{ display: "inline-flex", flex: "none" }}><Waveform count={16} mode="smooth" pos={1} activeColor="var(--rc-ray)" height={20} /></span>
          <span style={{ marginLeft: "auto", font: `400 12.5px/1 ${mono}`, color: "var(--rc-mute)" }}>Vocast for Mac</span>
        </div>
        <h2 style={{ margin: 0, font: `600 clamp(30px,5.4vw,60px)/1.1 ${sans}`, letterSpacing: "-1px", fontFeatureSettings: FEAT }}>
          <span style={{ color: "var(--rc-ray)" }}>Free</span> <span style={{ color: "#5a5c5e" }}>to try right here in your browser. To do it in a voice cloned from your own, on scripts up to 20,000 characters, fully local,</span> <span style={{ color: "var(--rc-ink)" }}>get Vocast for $49 one time.</span>
        </h2>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}>
          <Button as={Link} href={localePath(lang, "/#pricing")} variant="primary">Get Vocast for $49</Button>
          <Button as={Link} href={localePath(lang, "/#features")} variant="tertiary">See how it works</Button>
        </div>
      </div>
    </div>
  );
}

// ---- tool page pieces ----
export function Breadcrumb({ name, lang = "en" }: { name: string; lang?: Lang }) {
  const sep = <span style={{ color: "var(--rc-stone)", margin: "0 8px" }}>/</span>;
  const link = { font: `500 13px/1 ${sans}`, letterSpacing: ".2px", fontFeatureSettings: FEAT, color: "var(--rc-mute)", textDecoration: "none" } as const;
  return (
    <nav style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
      <Link href={localePath(lang, "/")} style={link}>Home</Link>{sep}
      <Link href={localePath(lang, "/tools/")} style={link}>Tools</Link>{sep}
      <span style={{ font: `500 13px/1 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>{name}</span>
    </nav>
  );
}

export function HowItWorks({ steps }: { steps: { name: string; text: string }[] }) {
  return (
    <section style={{ marginTop: "clamp(40px,6vw,64px)" }}>
      <h2 style={{ margin: "0 0 20px", font: `600 22px/1.3 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>How it works</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ padding: 18, borderRadius: 12, border: "1px solid var(--rc-hairline)", background: "var(--rc-surface)" }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(245,115,43,.12)", color: "var(--rc-ray)", font: `500 13px/1 ${mono}`, marginBottom: 12 }}>{i + 1}</span>
            <div style={{ font: `500 14.5px/1.4 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)", marginBottom: 5 }}>{s.name}</div>
            <p style={{ margin: 0, font: `400 13.5px/1.55 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RelatedTools({ slugs, lang = "en" }: { slugs: string[]; lang?: Lang }) {
  const items = slugs.map((s) => TOOLS.find((t) => t.slug === s)).filter(Boolean) as ToolDef[];
  if (items.length === 0) return null;
  return (
    <section style={{ marginTop: "clamp(40px,6vw,64px)" }}>
      <h2 style={{ margin: "0 0 20px", font: `600 22px/1.3 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>Related tools</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
        {items.map((t) => {
          const card = (
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, borderRadius: 12, border: "1px solid var(--rc-hairline)", background: "var(--rc-surface)", textDecoration: "none" }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(245,115,43,.12)", color: "var(--rc-ray)" }}><Icon name={t.icon} size={18} /></span>
              <div>
                <div style={{ font: `500 14.5px/1.3 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>{t.shortName}</div>
                <div style={{ font: `400 12.5px/1.4 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{t.cardDesc}</div>
              </div>
            </div>
          );
          return t.live ? <Link key={t.slug} href={localePath(lang, `/tools/${t.slug}/`)} style={{ textDecoration: "none" }}>{card}</Link> : <div key={t.slug} style={{ opacity: 0.7 }}>{card}</div>;
        })}
      </div>
    </section>
  );
}

export function ConversionCta({ cta, lang = "en" }: { cta: { title: string; body: string }; lang?: Lang }) {
  return (
    <section style={{ marginTop: "clamp(48px,7vw,80px)" }}>
      <div style={{ position: "relative", border: "1px solid var(--rc-hairline)", borderRadius: 16, background: "var(--rc-surface)", padding: "clamp(28px,4vw,44px)", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg,#ff9448,#e0561c)" }} />
        <h2 style={{ margin: 0, font: `600 clamp(22px,3vw,28px)/1.25 ${sans}`, letterSpacing: "-.3px", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>{cta.title}</h2>
        <p style={{ margin: "12px 0 0", maxWidth: 620, font: `400 15px/1.6 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>{cta.body}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          <Button as={Link} href={localePath(lang, "/#pricing")} variant="primary">Get Vocast for $49</Button>
          <Button as={Link} href={localePath(lang, "/#features")} variant="tertiary">See features</Button>
        </div>
      </div>
    </section>
  );
}

export function ToolPageLayout({ tool, panel, lang = "en" }: { tool: ToolDef; panel: React.ReactNode; lang?: Lang }) {
  return (
    <Container style={{ maxWidth: 920, padding: "28px 24px 96px" }}>
      <div style={{ marginBottom: 22 }}><Breadcrumb name={tool.name} lang={lang} /></div>
      <header style={{ marginBottom: "clamp(24px,4vw,36px)" }}>
        <h1 style={{ margin: 0, font: `600 clamp(30px,5vw,44px)/1.12 ${sans}`, letterSpacing: "-.5px", fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>{tool.name}</h1>
        <p style={{ margin: "16px 0 0", maxWidth: 680, font: `400 clamp(15px,2.1vw,17px)/1.65 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>{tool.quickAnswer}</p>
      </header>
      {panel}
      {tool.howto && <HowItWorks steps={tool.howto} />}
      {tool.faqs && (
        <section style={{ marginTop: "clamp(40px,6vw,64px)" }}>
          <h2 style={{ margin: "0 0 8px", font: `600 22px/1.3 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>Frequently asked</h2>
          <FaqAccordion items={tool.faqs} />
        </section>
      )}
      {tool.related && <RelatedTools slugs={tool.related} lang={lang} />}
      {tool.cta && <ConversionCta cta={tool.cta} lang={lang} />}
    </Container>
  );
}

// ---- index grid ----
export function ToolsGrid({ lang = "en" }: { lang?: Lang }) {
  // 라이브 먼저, 그다음 soon
  const ordered = [...liveTools(), ...TOOLS.filter((t) => !t.live)];
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(338px,1fr))", gap: 20 }}>
        {ordered.map((t) => <ToolCard key={t.slug} tool={t} lang={lang} />)}
      </div>
    </div>
  );
}
