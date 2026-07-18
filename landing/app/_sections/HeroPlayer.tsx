"use client";
import * as React from "react";
import { PillTab } from "@timbre/design-system";
import { Icon } from "../_ui/Icon";
import { Waveform } from "../_ui/Waveform";

const FEAT = '"calt","kern","liga","ss03"';
const TOTAL = 142; // seconds → "2:22"
const DUR_MS = 2800;

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Chip({ children, dot }: { children: React.ReactNode; dot?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "5px 10px",
        borderRadius: "var(--rc-radius-md)",
        border: "1px solid var(--rc-hairline)",
        background: "var(--rc-surface)",
        font: "400 12px/1 var(--rc-font-mono)",
        color: "var(--rc-mute)",
        whiteSpace: "nowrap",
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rc-accent-green)" }} />}
      {children}
    </span>
  );
}

export function HeroPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [pos, setPos] = React.useState(0);
  const [mode, setMode] = React.useState<"raw" | "smooth">("smooth");
  const raf = React.useRef<number>();
  const start = React.useRef<number>(0);

  React.useEffect(() => {
    if (!playing) return;
    start.current = performance.now() - pos * DUR_MS;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start.current) / DUR_MS);
      setPos(p);
      if (p >= 1) {
        setPlaying(false);
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const toggle = () => {
    if (pos >= 1) setPos(0);
    setPlaying((v) => !v);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        borderRadius: "var(--rc-radius-xl)",
        border: "1px solid var(--rc-hairline)",
        background: "var(--rc-surface)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: "var(--rc-ray)", display: "inline-flex" }}>
          <Icon name="zap" size={15} />
        </span>
        <span style={{ font: "400 13px/1 var(--rc-font-mono)", color: "var(--rc-mute)" }}>chapter-01.txt · MyVoice</span>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            gap: 2,
            padding: 3,
            borderRadius: "var(--rc-radius-full)",
            border: "1px solid var(--rc-hairline)",
            background: "var(--rc-surface-elevated)",
          }}
        >
          <PillTab active={mode === "raw"} onClick={() => setMode("raw")}>
            Your take
          </PillTab>
          <PillTab active={mode === "smooth"} onClick={() => setMode("smooth")}>
            AI voice
          </PillTab>
        </div>
      </div>

      {/* waveform (click-to-seek) */}
      <div
        style={{
          borderRadius: "var(--rc-radius-lg)",
          border: "1px solid var(--rc-hairline)",
          background: "var(--rc-canvas)",
          padding: "18px 16px",
        }}
      >
        <Waveform count={56} mode={mode} pos={pos} onSeek={setPos} height={64} />
      </div>

      {/* transport */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            flex: "none",
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: "var(--rc-primary)",
            color: "var(--rc-on-primary)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={playing ? "pause" : "play"} size={18} />
        </button>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: "var(--rc-surface-elevated)", overflow: "hidden" }}>
          <div style={{ width: `${pos * 100}%`, height: "100%", background: "var(--rc-ray)", transition: "width .1s linear" }} />
        </div>
        <span style={{ font: "400 12px/1 var(--rc-font-mono)", color: "var(--rc-mute)", whiteSpace: "nowrap" }}>
          {fmt(pos * TOTAL)} / 2:22
        </span>
      </div>

      {/* metric chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Chip dot>Speaker similarity 0.87</Chip>
        <Chip>Prosody 84.2</Chip>
        <Chip>~4× realtime</Chip>
      </div>
    </div>
  );
}
