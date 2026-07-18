// Ported from source/components/brand/Logo.jsx, Timbre voice-waveform mark + wordmark.
// Bars use currentColor; `animated` pulses them like a live waveform (rc-eq keyframe).
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

const BARS = [
  { x: 2, y: 30, h: 12 },
  { x: 15, y: 21, h: 30 },
  { x: 28, y: 11, h: 50 },
  { x: 41, y: 21, h: 30 },
  { x: 54, y: 30, h: 12 },
];
const DELAYS = ["-.9s", "-.3s", "-.6s", "-.15s", "-.75s"];

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** full = waveform mark + wordmark; mark = waveform glyph only */
  variant?: "full" | "mark";
  /** pulse the bars like a live waveform (voice playback) */
  animated?: boolean;
  /** rendered height in px (width scales to aspect) */
  height?: number;
  /** wordmark text (shared mark, per-product name). Defaults to "Timbre". */
  wordmark?: string;
  title?: string;
}

export function Logo({
  variant = "full",
  height = 24,
  animated = false,
  wordmark = "Timbre",
  title = wordmark,
  style,
  ...rest
}: LogoProps) {
  const markW = (64 / 72) * height;
  const mark = (
    <svg
      viewBox="0 0 64 72"
      height={height}
      width={markW}
      fill="currentColor"
      style={{ display: "block", flex: "none" }}
      aria-hidden="true"
    >
      {BARS.map((b, i) => {
        const cy = b.y + b.h / 2;
        return (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width="8"
            height={b.h}
            rx="4"
            style={
              animated
                ? {
                    transformBox: "fill-box",
                    transformOrigin: `center ${cy}px`,
                    animation: `rc-eq 1.1s var(--rc-ease-in-out) infinite`,
                    animationDelay: DELAYS[i],
                  }
                : undefined
            }
          />
        );
      })}
    </svg>
  );

  if (variant === "mark") {
    return (
      <span
        role="img"
        aria-label={title}
        style={{ display: "inline-flex", color: "var(--rc-ray)", ...style }}
        {...rest}
      >
        {mark}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={title}
      style={{ display: "inline-flex", alignItems: "center", gap: height * 0.34, ...style }}
      {...rest}
    >
      <span style={{ display: "inline-flex", color: "var(--rc-ray)" }}>{mark}</span>
      <span
        style={{
          font: `600 ${height * 0.92}px/1 var(--rc-font-sans)`,
          letterSpacing: "-.02em",
          fontFeatureSettings: FEAT,
          color: "var(--rc-ink)",
        }}
      >
        {wordmark}<span style={{ color: "var(--rc-ray)" }}>.</span>
      </span>
    </span>
  );
}
