// Ported from source/components/buttons/Button.jsx — plain function component,
// inline styles + CSS variables, no runtime deps. Presentational (no state).
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = white pill (universal CTA), secondary = transparent text, tertiary = soft surface fill */
  variant?: "primary" | "secondary" | "tertiary";
  /** pressed state for the primary pill (dims one notch) */
  pressed?: boolean;
  size?: "sm" | "md";
  /** render as a different element, e.g. "a" — then href/target/rel apply */
  as?: React.ElementType;
  /** anchor attributes, valid when `as="a"` */
  href?: string;
  target?: string;
  rel?: string;
}

export function Button({
  variant = "primary",
  pressed = false,
  disabled = false,
  size = "md",
  as: Tag = "button",
  children,
  style,
  ...rest
}: ButtonProps) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    font: "500 14px/1.6 var(--rc-font-sans)",
    letterSpacing: ".2px",
    fontFeatureSettings: FEAT,
    height: size === "sm" ? 32 : 36,
    padding: size === "sm" ? "6px 14px" : "8px 16px",
    borderRadius: "var(--rc-radius-md)",
    border: "1px solid transparent",
    cursor: disabled ? "default" : "pointer",
    whiteSpace: "nowrap",
    transition:
      "background-color .15s ease, color .15s ease, border-color .15s ease",
    userSelect: "none",
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: pressed ? "var(--rc-primary-pressed)" : "var(--rc-primary)",
      color: "var(--rc-on-primary)",
    },
    secondary: { background: "transparent", color: "var(--rc-on-dark)" },
    tertiary: { background: "var(--rc-surface-elevated)", color: "var(--rc-on-dark)" },
    disabled: { background: "var(--rc-surface-elevated)", color: "var(--rc-ash)" },
  };

  const v = disabled ? variants.disabled : variants[variant] ?? variants.primary;

  return (
    <Tag
      style={{ ...base, ...v, ...style }}
      disabled={Tag === "button" ? disabled : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
