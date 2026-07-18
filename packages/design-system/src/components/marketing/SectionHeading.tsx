// Ported from source/components/marketing/SectionHeading.jsx
import * as React from "react";
import { GradientText } from "../shared/GradientText";

const FEAT = '"calt","kern","liga","ss03"';

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  /** trailing word emphasized with the brand gradient */
  accent?: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  /** title font-size in px (default 40) */
  size?: number;
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  subtitle,
  align = "center",
  size = 40,
  style,
  ...rest
}: SectionHeadingProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align,
        maxWidth: align === "center" ? 640 : "none",
        margin: align === "center" ? "0 auto" : 0,
        ...style,
      }}
      {...rest}
    >
      {eyebrow && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            font: "500 14px/1.6 var(--rc-font-sans)",
            letterSpacing: ".4px",
            fontFeatureSettings: FEAT,
            color: "var(--rc-ray)",
          }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          margin: 0,
          font: `500 ${size}px/1.12 var(--rc-font-sans)`,
          letterSpacing: ".2px",
          fontFeatureSettings: FEAT,
          color: "var(--rc-ink)",
        }}
      >
        {title}
        {accent ? (
          <>
            {" "}
            <GradientText>{accent}</GradientText>
          </>
        ) : null}
      </h2>
      {subtitle && (
        <p
          style={{
            margin: 0,
            maxWidth: 560,
            font: "400 18px/1.6 var(--rc-font-sans)",
            fontFeatureSettings: FEAT,
            color: "var(--rc-mute)",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
