import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

const meta: Meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

const Wrap: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <section style={{ padding: 32 }}>
    <h3 style={{ font: "500 20px/1.3 var(--rc-font-sans)", color: "var(--rc-ink)", margin: "0 0 16px" }}>{title}</h3>
    {children}
  </section>
);

const Swatch: React.FC<{ name: string; v: string; border?: boolean }> = ({ name, v, border }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <div style={{ width: 96, height: 56, borderRadius: 8, background: v, border: border ? "1px solid var(--rc-hairline)" : "none" }} />
    <div style={{ font: "400 12px/1.4 var(--rc-font-mono)", color: "var(--rc-mute)" }}>{name}</div>
  </div>
);

export const Colors: Story = {
  render: () => (
    <Wrap title="Surface ladder · text ramp · accents">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        {[
          ["--rc-canvas", "canvas"],
          ["--rc-surface", "surface"],
          ["--rc-surface-elevated", "elevated"],
          ["--rc-surface-card", "card"],
          ["--rc-primary", "primary(white)"],
          ["--rc-ray", "brand orange"],
        ].map(([v, n]) => (
          <Swatch key={v} name={n} v={`var(${v})`} border />
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {[
          ["--rc-accent-yellow", "yellow"],
          ["--rc-accent-red", "red"],
          ["--rc-accent-green", "green"],
          ["--rc-accent-blue", "blue"],
        ].map(([v, n]) => (
          <Swatch key={v} name={n} v={`var(${v})`} />
        ))}
      </div>
    </Wrap>
  ),
};

export const TextRamp: Story = {
  render: () => (
    <Wrap title="Text ramp (ink → stone)">
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          ["--rc-ink", "ink"],
          ["--rc-body", "body"],
          ["--rc-mute", "mute"],
          ["--rc-ash", "ash"],
          ["--rc-stone", "stone"],
        ].map(([v, n]) => (
          <div key={v} style={{ color: `var(${v})`, font: "400 20px/1.4 var(--rc-font-sans)", fontFeatureSettings: '"calt","kern","liga","ss03"' }}>
            {n} — The struggling gopher juggles ({v})
          </div>
        ))}
      </div>
    </Wrap>
  ),
};

export const Typography: Story = {
  render: () => (
    <Wrap title="Type scale — Inter, ss03 alternate g on">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, color: "var(--rc-ink)", fontFeatureSettings: '"calt","kern","liga","ss03"' }}>
        <div style={{ font: "600 64px/1.05 var(--rc-font-sans)" }}>Display 64</div>
        <div style={{ font: "500 40px/1.12 var(--rc-font-sans)" }}>Heading 40</div>
        <div style={{ font: "500 20px/1.4 var(--rc-font-sans)" }}>Subtitle 20</div>
        <div style={{ font: "400 16px/1.6 var(--rc-font-sans)", color: "var(--rc-body)" }}>Body 16 — the signature ligature is the single-storey g.</div>
        <code style={{ font: "400 14px/1.5 var(--rc-font-mono)", color: "var(--rc-body)" }}>JetBrains Mono — brew install --cask timbre</code>
      </div>
    </Wrap>
  ),
};

export const Radii: Story = {
  render: () => (
    <Wrap title="Radius scale">
      <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
        {[
          ["--rc-radius-xs", "4 keycap"],
          ["--rc-radius-sm", "6 row"],
          ["--rc-radius-md", "8 button"],
          ["--rc-radius-lg", "10 card"],
          ["--rc-radius-xl", "16 hero"],
        ].map(([v, n]) => (
          <div key={v} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <div style={{ width: 72, height: 72, background: "var(--rc-surface-elevated)", border: "1px solid var(--rc-hairline)", borderRadius: `var(${v})` }} />
            <div style={{ font: "400 12px/1.4 var(--rc-font-mono)", color: "var(--rc-mute)" }}>{n}</div>
          </div>
        ))}
      </div>
    </Wrap>
  ),
};
