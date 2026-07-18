// Ported from source/components/chips/Badge.jsx
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** pro = neutral tier tag; info = translucent blue New/Beta */
  variant?: "pro" | "info";
}

export function Badge({ variant = "pro", children, style, ...rest }: BadgeProps) {
  const variants: Record<string, React.CSSProperties> = {
    pro: { background: "var(--rc-surface-elevated)", color: "var(--rc-on-dark-mute)" },
    info: { background: "var(--rc-accent-blue-soft)", color: "var(--rc-accent-blue)" },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        font: "400 12px/1.5 var(--rc-font-sans)",
        letterSpacing: ".4px",
        fontFeatureSettings: FEAT,
        padding: variant === "info" ? "2px 8px" : "2px 6px",
        borderRadius: "var(--rc-radius-xs)",
        ...(variants[variant] || variants.pro),
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
