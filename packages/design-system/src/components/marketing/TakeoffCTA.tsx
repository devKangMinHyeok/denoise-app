// Ported from source/components/marketing/TakeoffCTA.jsx — closing CTA band.
import * as React from "react";
import { Button } from "../shared/Button";
import { InstallCommand } from "../shared/InstallCommand";

const FEAT = '"calt","kern","liga","ss03"';

export interface TakeoffCTAProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  cta?: React.ReactNode;
  command?: string;
  note?: React.ReactNode;
}

export function TakeoffCTA({
  title = "Ready for take-off?",
  subtitle = "Download the Timbre app and start taking your productivity to new heights.",
  cta = "Download for Mac",
  command = "brew install --cask timbre",
  note = "macOS 12+",
  style,
  ...rest
}: TakeoffCTAProps) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "96px 24px",
        textAlign: "center",
        ...style,
      }}
      {...rest}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "10%",
          width: 620,
          height: 320,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(245,115,43,.18) 0%, rgba(7,8,10,0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        <h2
          style={{
            margin: 0,
            font: "500 40px/1.15 var(--rc-font-sans)",
            letterSpacing: ".2px",
            fontFeatureSettings: FEAT,
            color: "var(--rc-ink)",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: 0,
            maxWidth: 460,
            font: "400 16px/1.6 var(--rc-font-sans)",
            fontFeatureSettings: FEAT,
            color: "var(--rc-mute)",
          }}
        >
          {subtitle}
        </p>
        <div style={{ marginTop: 6 }}>
          <Button variant="primary">{cta}</Button>
        </div>
        <span style={{ font: "400 13px/1 var(--rc-font-sans)", color: "var(--rc-ash)" }}>
          or
        </span>
        <InstallCommand command={command} />
        {note && (
          <span
            style={{
              font: "400 13px/1.4 var(--rc-font-sans)",
              color: "var(--rc-stone)",
            }}
          >
            {note}
          </span>
        )}
      </div>
    </section>
  );
}
