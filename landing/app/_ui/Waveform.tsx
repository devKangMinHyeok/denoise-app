"use client";
import * as React from "react";

// Deterministic bar heights (0..1). raw = spiky (your take), smooth = even envelope (AI voice).
function makeBars(count: number, mode: "raw" | "smooth"): number[] {
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const envelope = 0.35 + 0.55 * Math.sin(Math.PI * t) * Math.sin(Math.PI * t * 1.4 + 0.6);
    if (mode === "smooth") {
      out.push(Math.max(0.14, 0.35 + 0.5 * Math.abs(Math.sin(t * Math.PI * 3.1))));
    } else {
      // spiky: pseudo-random but stable
      const n = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
      out.push(Math.max(0.1, Math.min(1, envelope * (0.55 + 0.7 * n))));
    }
  }
  return out;
}

export interface WaveformProps {
  count?: number;
  mode?: "raw" | "smooth";
  heights?: number[];
  /** 0..1 playhead — bars before it use activeColor, after use inactiveColor */
  pos?: number;
  onSeek?: (pos: number) => void;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
  radius?: number;
}

export function Waveform({
  count = 56,
  mode = "raw",
  heights,
  pos = 1,
  onSeek,
  height = 72,
  activeColor = "var(--rc-ray)",
  inactiveColor = "#33373a",
  radius = 2,
}: WaveformProps) {
  const bars = React.useMemo(() => heights ?? makeBars(count, mode), [heights, count, mode]);
  const ref = React.useRef<HTMLDivElement>(null);

  const seek = (e: React.MouseEvent) => {
    if (!onSeek || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    onSeek(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };

  return (
    <div
      ref={ref}
      onClick={onSeek ? seek : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        height,
        cursor: onSeek ? "pointer" : "default",
        width: "100%",
      }}
    >
      {bars.map((h, i) => {
        const filled = i / bars.length <= pos;
        return (
          <span
            key={i}
            style={{
              flex: 1,
              minWidth: 2,
              height: `${Math.round(h * 100)}%`,
              background: filled ? activeColor : inactiveColor,
              borderRadius: radius,
              transition: "background-color .12s linear",
            }}
          />
        );
      })}
    </div>
  );
}
