"use client";
import * as React from "react";
import { ToolPanel, Dropzone, ReadoutTile, ProgressShimmer, ErrorBox } from "../_ui";
import { Icon } from "../../_ui/Icon";
import { ToolPlayer } from "../_audio";
import { loadFFmpeg, runFFmpeg } from "../lib/ffmpeg";
import { fmtSize } from "../lib/audio";

const FEAT = '"calt","kern","liga","ss03"';
const sans = "var(--rc-font-sans)";
const mono = "var(--rc-font-mono)";

type State = "empty" | "active" | "success" | "error";

interface Fmt {
  id: string;
  label: string;
  ext: string;
  mime: string;
  lossy: boolean;
  codec: (br: number) => string[];
}
const FORMATS: Fmt[] = [
  { id: "mp3", label: "MP3", ext: "mp3", mime: "audio/mpeg", lossy: true, codec: (br) => ["-c:a", "libmp3lame", "-b:a", `${br}k`] },
  { id: "wav", label: "WAV", ext: "wav", mime: "audio/wav", lossy: false, codec: () => ["-c:a", "pcm_s16le"] },
  { id: "m4a", label: "M4A (AAC)", ext: "m4a", mime: "audio/mp4", lossy: true, codec: (br) => ["-c:a", "aac", "-b:a", `${br}k`] },
  { id: "ogg", label: "OGG", ext: "ogg", mime: "audio/ogg", lossy: true, codec: (br) => ["-c:a", "libvorbis", "-b:a", `${br}k`] },
  { id: "flac", label: "FLAC", ext: "flac", mime: "audio/flac", lossy: false, codec: () => ["-c:a", "flac"] },
];
const BITRATES = [128, 192, 320];

export function Converter() {
  const [state, setState] = React.useState<State>("empty");
  const [err, setErr] = React.useState("");
  const [phase, setPhase] = React.useState("Preparing the in-browser engine");
  const [fmtId, setFmtId] = React.useState("mp3");
  const [bitrate, setBitrate] = React.useState(192);
  const [url, setUrl] = React.useState<string | null>(null);
  const [outName, setOutName] = React.useState("converted");
  const [size, setSize] = React.useState(0);
  const fileRef = React.useRef<File | null>(null);

  const fmt = FORMATS.find((f) => f.id === fmtId)!;
  React.useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  async function run(files: FileList) {
    const file = files[0];
    if (!file) return;
    fileRef.current = file;
    await convert(file);
  }

  async function convert(file: File) {
    setState("active");
    setErr("");
    try {
      setPhase("Preparing the in-browser engine");
      const { fetchFile } = await loadFFmpeg();
      const inExt = (file.name.split(".").pop() || "wav").toLowerCase();
      const base = file.name.replace(/\.[^.]+$/, "");
      setPhase(`Converting to ${fmt.label}, on your device`);
      const data = await runFFmpeg(`in.${inExt}`, await fetchFile(file), ["-i", `in.${inExt}`, "-vn", ...fmt.codec(bitrate), `out.${fmt.ext}`], `out.${fmt.ext}`);
      const blob = new Blob([data.buffer as ArrayBuffer], { type: fmt.mime });
      setSize(blob.size);
      setOutName(`${base}.${fmt.ext}`);
      setUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob); });
      setState("success");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Conversion failed.");
      setState("error");
    }
  }

  const reset = () => { if (url) URL.revokeObjectURL(url); setUrl(null); fileRef.current = null; setState("empty"); };
  const seg = (active: boolean): React.CSSProperties => ({ padding: "8px 14px", borderRadius: 8, border: active ? "1px solid var(--rc-ray)" : "1px solid var(--rc-hairline)", background: active ? "rgba(245,115,43,.1)" : "transparent", color: active ? "var(--rc-ray)" : "var(--rc-body)", font: `500 13px/1 ${sans}`, fontFeatureSettings: FEAT, cursor: "pointer" });
  const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 8, cursor: "pointer", font: `600 13.5px/1 ${sans}`, fontFeatureSettings: FEAT };

  const controls = (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ font: `400 12px/1 ${mono}`, color: "var(--rc-mute)", marginBottom: 8 }}>Output format</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FORMATS.map((f) => (<button key={f.id} onClick={() => setFmtId(f.id)} style={seg(fmtId === f.id)}>{f.label}</button>))}
        </div>
      </div>
      {fmt.lossy && (
        <div>
          <div style={{ font: `400 12px/1 ${mono}`, color: "var(--rc-mute)", marginBottom: 8 }}>Bitrate</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BITRATES.map((b) => (<button key={b} onClick={() => setBitrate(b)} style={seg(bitrate === b)}>{b} kbps</button>))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ToolPanel>
      {state === "empty" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {controls}
          <Dropzone label="Drop an audio file" hint={`Converted to ${fmt.label} in your browser, never uploaded. Unlike upload-based converters, your file stays on your device.`} onFiles={run} accept="audio/*,video/*" />
        </div>
      )}

      {state === "active" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "8px 0" }}>
          <div style={{ font: `400 12.5px/1.4 ${mono}` }}><span style={{ color: "var(--rc-body)" }}>your file</span> <span style={{ color: "var(--rc-stone)" }}>→</span> <span style={{ color: "var(--rc-ray)" }}>{fmt.label}</span></div>
          <ProgressShimmer label={phase} />
        </div>
      )}

      {state === "success" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {controls}
          {url && <ToolPlayer src={url} />}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ReadoutTile label="Format" value={fmt.label} tone="accent" />
            {fmt.lossy && <ReadoutTile label="Bitrate" value={`${bitrate} kbps`} />}
            <ReadoutTile label="Size" value={fmtSize(size)} />
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={url ?? "#"} download={outName} style={{ ...btn, background: "var(--rc-ink)", color: "var(--rc-canvas)", textDecoration: "none" }}><Icon name="download" size={16} /> Download {fmt.label}</a>
            <button onClick={() => fileRef.current && convert(fileRef.current)} style={{ ...btn, background: "transparent", border: "1px solid var(--rc-hairline)", color: "var(--rc-body)" }}>Reconvert</button>
            <button onClick={reset} style={{ ...btn, background: "transparent", border: "1px solid var(--rc-hairline)", color: "var(--rc-body)" }}>New file</button>
          </div>
        </div>
      )}

      {state === "error" && <ErrorBox message={err} onRetry={reset} />}
    </ToolPanel>
  );
}
