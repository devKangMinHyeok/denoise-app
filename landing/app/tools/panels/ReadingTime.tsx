"use client";
import * as React from "react";
import { ToolPanel, ReadoutTile } from "../_ui";

const FEAT = '"calt","kern","liga","ss03"';
const sans = "var(--rc-font-sans)";
const mono = "var(--rc-font-mono)";

const PRESETS = [
  { label: "Slow", wpm: 130 },
  { label: "Normal", wpm: 150 },
  { label: "Fast", wpm: 170 },
];

function mmss(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function ReadingTime() {
  const [text, setText] = React.useState("");
  const [wpm, setWpm] = React.useState(150);
  const [custom, setCustom] = React.useState(false);

  const stats = React.useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const sentences = (text.match(/[.!?]+/g) || []).length;
    const paras = text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const w = p.split(/\s+/).filter(Boolean).length;
        return { w, seconds: (w / (wpm || 1)) * 60, preview: p.length > 48 ? p.slice(0, 48) + "…" : p };
      });
    const seconds = (words / (wpm || 1)) * 60;
    return { words, chars, sentences, paras, seconds };
  }, [text, wpm]);

  const chip = (active: boolean): React.CSSProperties => ({
    padding: "8px 14px",
    borderRadius: 8,
    border: active ? "1px solid var(--rc-ray)" : "1px solid var(--rc-hairline)",
    background: active ? "rgba(245,115,43,.1)" : "transparent",
    color: active ? "var(--rc-ray)" : "var(--rc-body)",
    font: `500 13px/1 ${sans}`,
    fontFeatureSettings: FEAT,
    cursor: "pointer",
  });

  return (
    <ToolPanel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, alignItems: "start" }}>
        {/* input */}
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type your script here."
            spellCheck={false}
            style={{
              width: "100%",
              minHeight: 240,
              resize: "vertical",
              padding: 16,
              borderRadius: 12,
              border: "1px solid var(--rc-hairline)",
              background: "#0b0c0e",
              color: "var(--rc-ink)",
              font: `400 15px/1.65 ${sans}`,
              fontFeatureSettings: FEAT,
              outline: "none",
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            <span style={{ font: `400 12px/1 ${mono}`, color: "var(--rc-mute)", marginRight: 4 }}>Pace</span>
            {PRESETS.map((p) => (
              <button key={p.wpm} type="button" onClick={() => { setWpm(p.wpm); setCustom(false); }} style={chip(!custom && wpm === p.wpm)}>
                {p.label} · {p.wpm}
              </button>
            ))}
            <button type="button" onClick={() => setCustom(true)} style={chip(custom)}>Custom</button>
            {custom && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <input
                  type="number"
                  min={40}
                  max={400}
                  value={wpm}
                  onChange={(e) => setWpm(Math.max(40, Math.min(400, Number(e.target.value) || 0)))}
                  style={{ width: 72, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--rc-hairline)", background: "#0b0c0e", color: "var(--rc-ink)", font: `500 13px/1 ${mono}`, outline: "none" }}
                />
                <span style={{ font: `400 12px/1 ${mono}`, color: "var(--rc-mute)" }}>wpm</span>
              </span>
            )}
          </div>
        </div>

        {/* result */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ padding: "20px 22px", borderRadius: 14, border: "1px solid var(--rc-hairline)", background: "var(--rc-surface)" }}>
            <div style={{ font: `400 11px/1 ${mono}`, color: "var(--rc-ash)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 10 }}>Estimated narration time</div>
            <div style={{ font: `500 clamp(40px,7vw,56px)/1 ${mono}`, color: "var(--rc-ray)", letterSpacing: "-1px" }}>{mmss(stats.seconds)}</div>
            <div style={{ font: `400 12.5px/1 ${mono}`, color: "var(--rc-mute)", marginTop: 8 }}>at {wpm} words per minute</div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ReadoutTile label="Words" value={stats.words.toLocaleString()} />
            <ReadoutTile label="Characters" value={stats.chars.toLocaleString()} />
            <ReadoutTile label="Sentences" value={String(stats.sentences)} />
          </div>
          {stats.paras.length > 0 && (
            <div style={{ borderRadius: 12, border: "1px solid var(--rc-hairline)", overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--rc-hairline)", font: `400 11px/1 ${mono}`, color: "var(--rc-ash)", textTransform: "uppercase", letterSpacing: ".5px" }}>Per paragraph</div>
              <div style={{ maxHeight: 200, overflowY: "auto" }}>
                {stats.paras.map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 14px", borderTop: i ? "1px solid var(--rc-hairline)" : "none", font: `400 13px/1.4 ${sans}`, fontFeatureSettings: FEAT }}>
                    <span style={{ color: "var(--rc-mute)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.preview}</span>
                    <span style={{ color: "var(--rc-body)", flex: "none", fontFamily: "var(--rc-font-mono)" }}>{mmss(p.seconds)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolPanel>
  );
}
