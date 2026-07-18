import * as React from "react";

/** Brand ray-burst glow — behind the hero. Radial-masked + blurred so there is no hard edge. */
export function RayBurst({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        maskImage: "radial-gradient(70% 60% at 50% 35%, #000 0%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(70% 60% at 50% 35%, #000 0%, transparent 75%)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          width: 1100,
          height: 620,
          transform: "translateX(-50%)",
          filter: "blur(28px)",
          opacity: 0.65,
          background:
            "conic-gradient(from 210deg at 50% 40%, rgba(245,115,43,0) 0deg, rgba(245,115,43,.28) 40deg, rgba(224,86,28,.10) 120deg, rgba(245,115,43,0) 200deg, rgba(255,148,72,.22) 300deg, rgba(245,115,43,0) 360deg)",
        }}
      />
      {/* bottom fade into canvas so the glow never shows a hard edge */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, transparent 55%, var(--rc-canvas) 100%)",
        }}
      />
    </div>
  );
}

/** Soft ember aurora glow — behind the MCP + Pricing sections. */
export function AuroraGlow({ style }: { style?: React.CSSProperties }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        maskImage: "radial-gradient(60% 60% at 50% 45%, #000 0%, transparent 72%)",
        WebkitMaskImage: "radial-gradient(60% 60% at 50% 45%, #000 0%, transparent 72%)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 760,
          height: 420,
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
          opacity: 0.5,
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(245,115,43,.30) 0%, rgba(224,86,28,.10) 45%, rgba(7,8,10,0) 72%)",
        }}
      />
    </div>
  );
}
