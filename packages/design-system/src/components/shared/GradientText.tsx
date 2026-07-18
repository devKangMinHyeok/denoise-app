// Ported from source/components/inline/GradientText.jsx
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

export interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** gradient = brand-gradient text fill; pill = small gradient tag; plain = ink emphasis */
  variant?: "gradient" | "pill" | "plain";
}

export function GradientText({
  variant = "gradient",
  children,
  style,
  ...rest
}: GradientTextProps) {
  if (variant === "pill") {
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "1px 8px",
          borderRadius: "var(--rc-radius-full)",
          background: "var(--rc-hero-stripe)",
          color: "#fff",
          font: "500 10px/1.3 var(--rc-font-sans)",
          letterSpacing: ".2px",
          fontFeatureSettings: FEAT,
          ...style,
        }}
        {...rest}
      >
        {children}
      </span>
    );
  }
  const grad: React.CSSProperties =
    variant === "gradient"
      ? {
          backgroundImage: "var(--rc-hero-stripe)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
        }
      : { color: "var(--rc-ink)" };
  return (
    <span style={{ fontFeatureSettings: FEAT, ...grad, ...style }} {...rest}>
      {children}
    </span>
  );
}
