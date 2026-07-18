// Ported from source/components/cards/FeatureCard.jsx, presentational card.
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

export interface FeatureCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** flips the fill one surface notch to break rhythm in alternating rows */
  elevated?: boolean;
  title?: React.ReactNode;
  media?: React.ReactNode;
  footer?: React.ReactNode;
}

export function FeatureCard({
  elevated = false,
  title,
  children,
  media,
  footer,
  style,
  ...rest
}: FeatureCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 24,
        background: elevated ? "var(--rc-surface-elevated)" : "var(--rc-surface)",
        border: "1px solid var(--rc-hairline)",
        borderRadius: "var(--rc-radius-lg)",
        color: "var(--rc-body)",
        ...style,
      }}
      {...rest}
    >
      {media}
      {title && (
        <div
          style={{
            font: "500 20px/1.4 var(--rc-font-sans)",
            letterSpacing: ".2px",
            fontFeatureSettings: FEAT,
            color: "var(--rc-ink)",
          }}
        >
          {title}
        </div>
      )}
      {children && (
        <div
          style={{
            font: "400 14px/1.6 var(--rc-font-sans)",
            fontFeatureSettings: FEAT,
            color: "var(--rc-body)",
          }}
        >
          {children}
        </div>
      )}
      {footer && <div style={{ marginTop: 4 }}>{footer}</div>}
    </div>
  );
}
