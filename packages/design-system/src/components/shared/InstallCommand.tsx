"use client";
// Ported from source/components/feedback/InstallCommand.jsx, copyable command chip.
import * as React from "react";

const FEAT = '"calt","kern","liga","ss03"';

export interface InstallCommandProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, "onClick"> {
  command?: string;
}

export function InstallCommand({
  command = "brew install --cask timbre",
  style,
  ...rest
}: InstallCommandProps) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: "var(--rc-surface-elevated)",
        border: "1px solid var(--rc-hairline)",
        borderRadius: "var(--rc-radius-md)",
        cursor: "pointer",
        font: "400 13px/1 var(--rc-font-mono)",
        color: "var(--rc-body)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ color: "var(--rc-stone)" }}>$</span>
      <span>{command}</span>
      <span
        style={{
          font: "500 12px/1 var(--rc-font-sans)",
          letterSpacing: ".2px",
          fontFeatureSettings: FEAT,
          color: copied ? "var(--rc-accent-green)" : "var(--rc-mute)",
        }}
      >
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
