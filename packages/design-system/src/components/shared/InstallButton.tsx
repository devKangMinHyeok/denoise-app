// Ported from source/components/buttons/InstallButton.jsx
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

export interface InstallButtonProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
}

export function InstallButton({
  as: Tag = "button",
  children = "Install Extension",
  style,
  ...rest
}: InstallButtonProps) {
  return (
    <Tag
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        font: "500 14px/1.6 var(--rc-font-sans)",
        letterSpacing: ".2px",
        fontFeatureSettings: FEAT,
        padding: "6px 14px",
        borderRadius: "var(--rc-radius-md)",
        background: "transparent",
        color: "var(--rc-on-dark)",
        border: "1px solid var(--rc-hairline-strong)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "background-color .15s ease, border-color .15s ease",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
