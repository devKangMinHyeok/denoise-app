"use client";
// Ported from source/components/inline/InlineLink.jsx — body-prose anchor.
// Client component: uses hover handlers for the focus/hover underline.
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

export interface InlineLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

export function InlineLink({
  href = "#",
  children,
  style,
  ...rest
}: InlineLinkProps) {
  return (
    <a
      href={href}
      style={{
        color: "var(--rc-on-dark)",
        font: "500 16px/1.4 var(--rc-font-sans)",
        letterSpacing: ".3px",
        fontFeatureSettings: FEAT,
        textDecoration: "none",
        borderBottom: "1px solid transparent",
        transition: "border-color .15s ease",
        ...style,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderBottomColor = "var(--rc-hairline-strong)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderBottomColor = "transparent")
      }
      {...rest}
    >
      {children}
    </a>
  );
}
