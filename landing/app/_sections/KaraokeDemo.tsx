"use client";
import * as React from "react";
import { Icon } from "../_ui/Icon";
import { Waveform } from "../_ui/Waveform";

const FEAT = '"calt","kern","liga","ss03"';
const DUR_MS = 5200;
const SENTENCE =
  "Paste your script, pick your voice, and hear it read back in a take that actually sounds like you.".split(" ");

export function KaraokeDemo() {
  const [playing, setPlaying] = React.useState(false);
  const [pos, setPos] = React.useState(0);
  const raf = React.useRef<number>();
  const start = React.useRef(0);

  React.useEffect(() => {
    if (!playing) return;
    start.current = performance.now() - pos * DUR_MS;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start.current) / DUR_MS);
      setPos(p);
      if (p >= 1) return setPlaying(false);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const current = Math.floor(pos * SENTENCE.length);
  const toggle = () => {
    if (pos >= 1) setPos(0);
    setPlaying((v) => !v);
  };

  return (
    <div
      style={{
        marginTop: 24,
        borderRadius: "var(--rc-radius-xl)",
        border: "1px solid var(--rc-hairline)",
        background: "var(--rc-surface)",
        padding: "28px 28px 32px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          style={{
            flex: "none",
            width: 40,
            height: 40,
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
          <Icon name={playing ? "pause" : "play"} size={16} />
        </button>
        <span style={{ font: "500 14px/1 var(--rc-font-sans)", letterSpacing: ".2px", fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>
          Live karaoke demo
        </span>
        <div style={{ width: 120, opacity: 0.9 }}>
          <Waveform count={22} mode="smooth" pos={playing ? pos : 0} height={22} radius={1} />
        </div>
        <div style={{ flex: 1 }} />
        <span style={{ font: "400 12px/1 var(--rc-font-mono)", color: "var(--rc-mute)" }}>MyVoice</span>
      </div>

      <p style={{ margin: 0, font: "500 clamp(22px,3.2vw,34px)/1.4 var(--rc-font-sans)", letterSpacing: "-.2px", fontFeatureSettings: FEAT }}>
        {SENTENCE.map((w, i) => (
          <span
            key={i}
            onClick={() => setPos((i + 0.5) / SENTENCE.length)}
            style={{
              cursor: "pointer",
              color: i === current ? "var(--rc-ray)" : i < current ? "var(--rc-body)" : "#33373a",
              transition: "color .12s linear",
            }}
          >
            {w}{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
