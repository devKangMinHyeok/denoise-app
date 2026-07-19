"use client";
import * as React from "react";
import { ToolPanel, Dropzone, ReadoutTile, ProgressShimmer, ErrorBox } from "../_ui";
import { Icon } from "../../_ui/Icon";
import { loadFFmpeg, runFFmpeg } from "../lib/ffmpeg";

const FEAT = '"calt","kern","liga","ss03"';
const sans = "var(--rc-font-sans)";
const mono = "var(--rc-font-mono)";

type State = "empty" | "active" | "success" | "error";

const TARGETS = [
  { v: -14, label: "-14 LUFS", note: "YouTube" },
  { v: -16, label: "-16 LUFS", note: "Podcasts, Apple" },
  { v: -23, label: "-23 LUFS", note: "Broadcast (EBU)" },
];

interface Measure { inI: number; inTp: number; outI: number; outTp: number }

function parseLoudnorm(logs: string[]): Measure | null {
  const s = logs.join("\n");
  const num = (k: string) => {
    const m = s.match(new RegExp(`"${k}"\\s*:\\s*"(-?[\\d.]+|-?inf)"`));
    if (!m) return null;
    return m[1] === "-inf" ? -70 : Number(m[1]);
  };
  const inI = num("input_i"), inTp = num("input_tp"), outI = num("output_i"), outTp = num("output_tp");
  if (inI == null || outI == null) return null;
  return { inI, inTp: inTp ?? 0, outI, outTp: outTp ?? 0 };
}

function Bar({ lufs, color, label, sub }: { lufs: number; color: string; label: string; sub: string }) {
  const pct = Math.max(3, Math.min(100, ((lufs + 30) / 30) * 100));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", font: `400 12px/1 ${mono}`, color: "var(--rc-mute)", marginBottom: 6 }}><span>{label}</span><span>{sub}</span></div>
      <div style={{ height: 10, borderRadius: 5, background: "var(--rc-surface-elevated)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color }} />
      </div>
    </div>
  );
}

export function Loudness() {
  const [state, setState] = React.useState<State>("empty");
  const [err, setErr] = React.useState("");
  const [phase, setPhase] = React.useState("Preparing the in-browser engine");
  const [target, setTarget] = React.useState(-14);
  const [custom, setCustom] = React.useState(false);
  const [m, setM] = React.useState<Measure | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);
  const [name, setName] = React.useState("audio");
  const fileRef = React.useRef<File | null>(null);

  React.useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  async function run(files: FileList) {
    const file = files[0];
    if (!file) return;
    fileRef.current = file;
    setName(file.name.replace(/\.[^.]+$/, ""));
    await normalize(file);
  }

  async function normalize(file: File) {
    setState("active");
    setErr("");
    try {
      setPhase("Preparing the in-browser engine");
      const loaded = await loadFFmpeg();
      loaded.clearLogs();
      const ext = (file.name.split(".").pop() || "wav").toLowerCase();
      setPhase(`Normalizing to ${target} LUFS, on your device`);
      const data = await runFFmpeg(
        `in.${ext}`,
        await loaded.fetchFile(file),
        ["-i", `in.${ext}`, "-vn", "-af", `loudnorm=I=${target}:TP=-1.5:LRA=11:print_format=json`, "-c:a", "pcm_s16le", "out.wav"],
        "out.wav",
      );
      setM(parseLoudnorm(loaded.logs));
      setUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: "audio/wav" })); });
      setState("success");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Normalization failed.");
      setState("error");
    }
  }

  const reset = () => { if (url) URL.revokeObjectURL(url); setUrl(null); fileRef.current = null; setM(null); setState("empty"); };
  const seg = (active: boolean): React.CSSProperties => ({ padding: "9px 14px", borderRadius: 8, border: active ? "1px solid var(--rc-ray)" : "1px solid var(--rc-hairline)", background: active ? "rgba(245,115,43,.1)" : "transparent", cursor: "pointer", textAlign: "left", font: `500 13px/1.3 ${sans}`, fontFeatureSettings: FEAT, color: active ? "var(--rc-ray)" : "var(--rc-body)" });
  const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 8, cursor: "pointer", font: `600 13.5px/1 ${sans}`, fontFeatureSettings: FEAT };

  const targetPicker = (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TARGETS.map((t) => (
          <button key={t.v} onClick={() => { setTarget(t.v); setCustom(false); }} style={seg(!custom && target === t.v)}>
            <div>{t.label}</div>
            <div style={{ font: `400 11px/1 ${mono}`, color: "var(--rc-mute)", marginTop: 4 }}>{t.note}</div>
          </button>
        ))}
        <button onClick={() => setCustom(true)} style={seg(custom)}>Custom</button>
        {custom && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input type="number" min={-30} max={-6} value={target} onChange={(e) => setTarget(Math.max(-30, Math.min(-6, Number(e.target.value) || -14)))} style={{ width: 72, padding: "9px 10px", borderRadius: 8, border: "1px solid var(--rc-hairline)", background: "#0b0c0e", color: "var(--rc-ink)", font: `500 13px/1 ${mono}`, outline: "none" }} />
            <span style={{ font: `400 12px/1 ${mono}`, color: "var(--rc-mute)" }}>LUFS</span>
          </span>
        )}
      </div>
      <p style={{ margin: 0, font: `400 12.5px/1.55 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>LUFS measures perceived loudness. Streaming platforms target a level, so matching it keeps your audio consistent with everything else.</p>
    </div>
  );

  return (
    <ToolPanel>
      {state === "empty" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {targetPicker}
          <Dropzone label="Drop an audio file" hint="Loudness is measured and matched in your browser, never uploaded." onFiles={run} />
        </div>
      )}

      {state === "active" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
          <ProgressShimmer label={phase} />
          <div style={{ font: `400 12.5px/1.5 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>Measuring integrated loudness and applying gain. This stays on your device.</div>
        </div>
      )}

      {state === "success" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {targetPicker}
          {m && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 18px", borderRadius: 12, border: "1px solid var(--rc-hairline)", background: "var(--rc-surface)" }}>
              <Bar lufs={m.inI} color="#434345" label="before" sub={`${m.inI.toFixed(1)} LUFS · TP ${m.inTp.toFixed(1)} dBTP`} />
              <Bar lufs={m.outI} color="linear-gradient(90deg,#ff9448,#e0561c)" label={`after · target ${target}`} sub={`${m.outI.toFixed(1)} LUFS · TP ${m.outTp.toFixed(1)} dBTP`} />
            </div>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ReadoutTile label="Target" value={`${target} LUFS`} tone="accent" />
            {m && <ReadoutTile label="Gain" value={`${(m.outI - m.inI >= 0 ? "+" : "") + (m.outI - m.inI).toFixed(1)} dB`} />}
            <ReadoutTile label="Output" value="WAV" />
          </div>
          {url && <audio controls src={url} style={{ width: "100%" }} />}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={url ?? "#"} download={`${name}_${Math.abs(target)}lufs.wav`} style={{ ...btn, background: "var(--rc-ink)", color: "var(--rc-canvas)", textDecoration: "none" }}><Icon name="download" size={16} /> Download WAV</a>
            <button onClick={() => fileRef.current && normalize(fileRef.current)} style={{ ...btn, background: "transparent", border: "1px solid var(--rc-hairline)", color: "var(--rc-body)" }}>Apply target</button>
            <button onClick={reset} style={{ ...btn, background: "transparent", border: "1px solid var(--rc-hairline)", color: "var(--rc-body)" }}>New file</button>
          </div>
        </div>
      )}

      {state === "error" && <ErrorBox message={err} onRetry={reset} />}
    </ToolPanel>
  );
}
