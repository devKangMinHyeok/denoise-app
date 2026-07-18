// Ported from source/components/marketing/PromoCard.jsx — wide gradient promo card.
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

const TONES: Record<string, string> = {
  blue: "linear-gradient(135deg, #1d4d7a 0%, #0d2136 100%)",
  violet: "linear-gradient(135deg, #4a2a5e 0%, #2a1230 100%)",
  slate: "linear-gradient(135deg, #1c2330 0%, #0c1017 100%)",
};

export interface PromoCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: "blue" | "violet" | "slate";
  icon?: React.ReactNode;
  title?: React.ReactNode;
}

export function PromoCard({
  tone = "blue",
  icon,
  title,
  children,
  style,
  ...rest
}: PromoCardProps) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--rc-radius-xl)",
        border: "1px solid var(--rc-hairline)",
        background: TONES[tone] || TONES.blue,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 132,
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <div
          style={{
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--rc-on-dark)",
          }}
        >
          {icon}
        </div>
      )}
      {title && (
        <div
          style={{
            font: "500 18px/1.4 var(--rc-font-sans)",
            letterSpacing: ".2px",
            fontFeatureSettings: FEAT,
            color: "var(--rc-on-dark)",
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
            color: "var(--rc-on-dark-mute)",
            maxWidth: 440,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
