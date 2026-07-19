"use client";
import * as React from "react";
import { Icon } from "../_ui/Icon";

const FEAT = '"calt","kern","liga","ss03"';
const mono = "var(--rc-font-mono)";
const sans = "var(--rc-font-sans)";

// 핸드오프 전용 well/소프트 hairline 색 (토큰에 없는 값은 hex 그대로)
export const C = {
  well: "#0a0b0c",
  well2: "#0b0c0e",
  softLine: "#1a1c1d",
  line2: "#1e2122",
  hover: "#2f3335",
  greyHead: "#5a5c5e",
};

/** 도구 패널 틀: 상단바("In your browser") + 본문 + 하단 프라이버시 문구 */
export function ToolPanel({ children, footerNote }: { children: React.ReactNode; footerNote?: string }) {
  return (
    <div style={{ border: "1px solid var(--rc-hairline)", borderRadius: 16, background: "var(--rc-surface)", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "14px 18px",
          borderBottom: "1px solid var(--rc-hairline)",
          font: `400 12px/1 ${mono}`,
          letterSpacing: ".6px",
          textTransform: "uppercase",
          color: "var(--rc-mute)",
        }}
      >
        <span style={{ color: "var(--rc-ash)", display: "inline-flex" }}><Icon name="shield" size={14} /></span>
        In your browser
      </div>
      <div style={{ padding: "clamp(18px,3vw,26px)" }}>{children}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "12px 18px",
          borderTop: "1px solid var(--rc-hairline)",
          background: C.well2,
          font: `400 12.5px/1.5 ${sans}`,
          fontFeatureSettings: FEAT,
          color: "var(--rc-mute)",
        }}
      >
        <span style={{ color: "var(--rc-ash)", display: "inline-flex", flex: "none" }}><Icon name="shield" size={14} /></span>
        {footerNote ?? "Runs in your browser. Nothing is uploaded. This is a free tool from Vocast."}
      </div>
    </div>
  );
}

/** 드롭존(empty 상태 입력 영역) */
export function Dropzone({
  label,
  hint,
  onFiles,
  accept = "audio/*,video/*",
}: {
  label: string;
  hint: string;
  onFiles: (files: FileList) => void;
  accept?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [over, setOver] = React.useState(false);
  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files); }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        padding: "clamp(28px,5vw,44px) 24px",
        borderRadius: 12,
        border: `1.5px dashed ${over ? "var(--rc-ray)" : C.hover}`,
        background: over ? "rgba(245,115,43,.05)" : C.well2,
        cursor: "pointer",
        textAlign: "center",
        transition: "border-color .15s ease, background .15s ease",
      }}
    >
      <span style={{ width: 44, height: 44, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--rc-surface-elevated)", border: "1px solid var(--rc-hairline)", color: "var(--rc-mute)" }}>
        <Icon name="upload" size={20} />
      </span>
      <div style={{ font: `500 15px/1.4 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>{label}</div>
      <div style={{ font: `400 13px/1.5 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)", maxWidth: 380 }}>{hint}</div>
      <span style={{ marginTop: 4, display: "inline-flex", alignItems: "center", padding: "9px 18px", borderRadius: 8, background: "var(--rc-surface-elevated)", border: "1px solid var(--rc-hairline)", color: "var(--rc-body)", font: `600 13px/1 ${sans}`, fontFeatureSettings: FEAT }}>
        Choose file
      </span>
      <input ref={inputRef} type="file" accept={accept} hidden onChange={(e) => e.target.files && e.target.files.length && onFiles(e.target.files)} />
    </div>
  );
}

/** 결과 리드아웃 타일 (mono 수치) */
export function ReadoutTile({ label, value, tone }: { label: string; value: string; tone?: "ok" | "accent" }) {
  const col = tone === "ok" ? "var(--rc-accent-green)" : tone === "accent" ? "var(--rc-ray)" : "var(--rc-ink)";
  return (
    <div style={{ flex: "1 1 120px", minWidth: 0, padding: "12px 14px", borderRadius: 10, border: "1px solid var(--rc-hairline)", background: C.well }}>
      <div style={{ font: `500 18px/1.1 ${mono}`, color: col, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: 7 }}>{value}</div>
      <div style={{ font: `400 11px/1 ${mono}`, color: "var(--rc-ash)", textTransform: "uppercase", letterSpacing: ".4px" }}>{label}</div>
    </div>
  );
}

/** 비확정 진행 셔머 바 (prefers-reduced-motion 존중, globals.css의 vt-prog) */
export function ProgressShimmer({ label }: { label?: string }) {
  return (
    <div>
      {label && <div style={{ font: `400 12.5px/1 ${mono}`, color: "var(--rc-mute)", marginBottom: 10 }}>{label}</div>}
      <div style={{ height: 6, borderRadius: 3, background: "var(--rc-surface-elevated)", overflow: "hidden", position: "relative" }}>
        <div className="vt-prog" style={{ position: "absolute", inset: 0, width: "40%", borderRadius: 3, background: "linear-gradient(90deg, transparent, var(--rc-ray), transparent)" }} />
      </div>
    </div>
  );
}

/** 복구 가능한 에러 박스 */
export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div style={{ padding: "18px 20px", borderRadius: 12, border: "1px solid rgba(255,97,97,.35)", background: "rgba(255,97,97,.05)", display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#ff6161", font: `500 14px/1.4 ${sans}`, fontFeatureSettings: FEAT }}>
        <Icon name="alert" size={18} /> Something went wrong
      </div>
      <div style={{ font: `400 13.5px/1.6 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>{message} Nothing was uploaded.</div>
      {onRetry && (
        <button onClick={onRetry} style={{ alignSelf: "flex-start", padding: "8px 14px", borderRadius: 8, border: "1px solid var(--rc-hairline)", background: "transparent", color: "var(--rc-ink)", font: `600 13px/1 ${sans}`, cursor: "pointer" }}>
          Try again
        </button>
      )}
    </div>
  );
}

/** 단일 열림 FAQ 아코디언 (Faq.tsx 패턴 재사용) */
export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div>
      {items.map((it, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--rc-hairline)" }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 4px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", font: `500 16px/1.4 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}
          >
            {it.q}
            <span style={{ flex: "none", color: "var(--rc-ray)", fontSize: 22, lineHeight: 1, transform: open === i ? "rotate(45deg)" : "none", transition: "transform .18s ease" }}>+</span>
          </button>
          <div style={{ maxHeight: open === i ? 240 : 0, overflow: "hidden", transition: "max-height .24s ease" }}>
            <p style={{ margin: 0, padding: "0 4px 18px", maxWidth: 640, font: `400 14.5px/1.6 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>{it.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
