import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

/** macOS window frame — title bar with 3 dots + centered title, then body. Used for feature/chat mockups. */
export function WindowMock({
  title,
  children,
  bodyStyle,
  style,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & { title?: React.ReactNode; bodyStyle?: React.CSSProperties }) {
  return (
    <div
      style={{
        borderRadius: "var(--rc-radius-lg)",
        border: "1px solid var(--rc-hairline)",
        background: "var(--rc-surface)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          height: 34,
          padding: "0 12px",
          borderBottom: "1px solid var(--rc-hairline)",
          background: "var(--rc-surface-elevated)",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff6161", "#ffc533", "#59d499"].map((c) => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.9 }} />
          ))}
        </div>
        <div style={{ font: "400 12px/1 var(--rc-font-mono)", color: "var(--rc-mute)", whiteSpace: "nowrap" }}>
          {title}
        </div>
        <div />
      </div>
      <div style={{ padding: 16, fontFeatureSettings: FEAT, ...bodyStyle }}>{children}</div>
    </div>
  );
}
