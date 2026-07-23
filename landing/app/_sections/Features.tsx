import * as React from "react";
import { SectionHeading, FeatureCard, Badge } from "@timbre/design-system";
import { Container } from "../_ui/Container";
import { Section } from "../_ui/Section";
import { WindowMock } from "../_ui/WindowMock";
import { Waveform } from "../_ui/Waveform";
import { Icon } from "../_ui/Icon";
import { KaraokeDemo } from "./KaraokeDemo";
import { getDict, type Lang } from "../../lib/i18n";

const FEAT = '"calt","kern","liga","ss03"';
const mono = { font: "400 12px/1.5 var(--rc-font-mono)", color: "var(--rc-mute)" } as const;

// 6개 목업의 높이를 210px로 고정하고 본문을 세로 중앙 정렬 → 카드마다 아래 제목/설명이
// 같은 위치에서 시작하도록 정렬.
const MOCK_STYLE = { height: 210, display: "flex", flexDirection: "column" } as const;
const MOCK_BODY = { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" } as const;

function Bar({ v, color = "var(--rc-ray)" }: { v: number; color?: string }) {
  return (
    <div style={{ height: 5, borderRadius: 3, background: "var(--rc-surface-elevated)", overflow: "hidden" }}>
      <div style={{ width: `${v * 100}%`, height: "100%", background: color }} />
    </div>
  );
}

// --- 1. Voice profile ---
function MockProfile() {
  return (
    <WindowMock title="MyVoice" style={MOCK_STYLE} bodyStyle={MOCK_BODY}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ color: "var(--rc-ray)", display: "inline-flex" }}><Icon name="mic" size={16} /></span>
        <span style={{ font: "500 13px/1 var(--rc-font-sans)", color: "var(--rc-ink)", fontFeatureSettings: FEAT }}>MyVoice</span>
        <Badge variant="pro">v3 · rollback</Badge>
      </div>
      <div style={{ ...mono, display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span>Guided line</span>
        <span style={{ color: "var(--rc-accent-green)" }}>10 / 10</span>
      </div>
      <Bar v={1} color="var(--rc-accent-green)" />
    </WindowMock>
  );
}

// --- 2. Long-form ---
function MockLongform() {
  const rows = ["The story begins on a quiet…", "By the second act the pace…", "Everything changes when…"];
  return (
    <WindowMock title="script.md · 3 paragraphs" style={MOCK_STYLE} bodyStyle={MOCK_BODY}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              padding: "7px 10px",
              borderRadius: "var(--rc-radius-sm)",
              background: i === 1 ? "var(--rc-surface-elevated)" : "transparent",
              border: i === 1 ? "1px solid var(--rc-hairline)" : "1px solid transparent",
              font: "400 12px/1.4 var(--rc-font-sans)",
              fontFeatureSettings: FEAT,
              color: i === 1 ? "var(--rc-ink)" : "var(--rc-mute)",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r}</span>
            {i === 1 && <span style={{ color: "var(--rc-ray)", flex: "none" }}>(editing)</span>}
          </div>
        ))}
      </div>
      <div style={{ ...mono, textAlign: "right", marginTop: 10 }}>18,240 / 20,000 chars</div>
    </WindowMock>
  );
}

// --- 3. Performance transfer ---
function MockTransfer() {
  return (
    <WindowMock title="performance transfer" style={MOCK_STYLE} bodyStyle={MOCK_BODY}>
      <div style={{ marginBottom: 8, ...mono }}>reference take</div>
      <Waveform count={40} mode="raw" pos={1} activeColor="var(--rc-accent-blue)" height={30} />
      <div style={{ textAlign: "center", margin: "8px 0", ...mono, color: "var(--rc-accent-green)" }}>↓ delivery followed</div>
      <Waveform count={40} mode="raw" pos={1} activeColor="var(--rc-ray)" height={30} />
    </WindowMock>
  );
}

// --- 4. Karaoke view ---
function MockKaraoke() {
  const words = ["Read", "it", "back", "in", "your", "own", "voice."];
  return (
    <WindowMock title="karaoke view" style={MOCK_STYLE} bodyStyle={MOCK_BODY}>
      <div style={{ font: "500 18px/1.5 var(--rc-font-sans)", letterSpacing: ".1px", fontFeatureSettings: FEAT }}>
        {words.map((w, i) => (
          <span key={i} style={{ color: i === 3 ? "var(--rc-ray)" : i < 3 ? "var(--rc-body)" : "#33373a" }}>
            {w}{" "}
          </span>
        ))}
      </div>
    </WindowMock>
  );
}

// --- 5. Noise removal ---
function MockNoise() {
  return (
    <WindowMock title="noise removal" style={MOCK_STYLE} bodyStyle={MOCK_BODY}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <span style={{ ...mono, padding: "3px 8px", borderRadius: 6, background: "rgba(245,115,43,.14)", color: "var(--rc-ray)" }}>Standard</span>
        <span style={{ ...mono, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--rc-hairline)" }}>Resynth</span>
      </div>
      <Waveform count={44} mode="smooth" pos={1} activeColor="var(--rc-ray)" height={30} />
      <div style={{ ...mono, marginTop: 10 }}>speech loss 0.0% · silence −38 dB</div>
    </WindowMock>
  );
}

// --- 6. Task center ---
function MockTasks() {
  return (
    <WindowMock title="task center" style={MOCK_STYLE} bodyStyle={MOCK_BODY}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={{ ...mono, display: "flex", justifyContent: "space-between", marginBottom: 6, color: "var(--rc-body)" }}>
            <span>Narrate chapter-02</span><span style={{ color: "var(--rc-ray)" }}>ETA 40s</span>
          </div>
          <Bar v={0.62} />
        </div>
        <div>
          <div style={{ ...mono, display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span>Denoise interview.mov</span><span style={{ color: "var(--rc-accent-green)" }}>done ✓</span>
          </div>
          <Bar v={1} color="var(--rc-accent-green)" />
        </div>
      </div>
    </WindowMock>
  );
}

// 목업 미디어는 로케일 무관 데코. 제목/본문은 사전에서 온다(순서 일치).
const MEDIA = [<MockProfile />, <MockLongform />, <MockTransfer />, <MockKaraoke />, <MockNoise />, <MockTasks />];

export function Features({ lang = "en" }: { lang?: Lang }) {
  const t = getDict(lang).features;
  const features = t.items.map((f, i) => ({ ...f, media: MEDIA[i] }));
  return (
    <Section id="features">
      <Container>
        <SectionHeading title={t.headingTitle} accent={t.headingAccent} />
        <div
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 16,
          }}
        >
          {features.map((f) => (
            <FeatureCard key={f.title} media={f.media} title={f.title} style={{ background: "var(--rc-surface-card)" }}>
              {f.body}
            </FeatureCard>
          ))}
        </div>
        <KaraokeDemo />
      </Container>
    </Section>
  );
}
