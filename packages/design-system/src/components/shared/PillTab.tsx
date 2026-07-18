// Ported from source/components/chips/PillTab.jsx — segmented filter chip.
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

export interface PillTabProps extends React.HTMLAttributes<HTMLElement> {
  active?: boolean;
  as?: React.ElementType;
}

export function PillTab({
  active = false,
  as: Tag = "button",
  children,
  style,
  ...rest
}: PillTabProps) {
  return (
    <Tag
      style={{
        display: "inline-flex",
        alignItems: "center",
        font: "400 14px/1.6 var(--rc-font-sans)",
        fontFeatureSettings: FEAT,
        padding: "4px 10px",
        borderRadius: "var(--rc-radius-full)",
        border: "1px solid transparent",
        background: active ? "var(--rc-surface-elevated)" : "transparent",
        color: active ? "var(--rc-on-dark)" : "var(--rc-body)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background-color .15s ease, color .15s ease",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
