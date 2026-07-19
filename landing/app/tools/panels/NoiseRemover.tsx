"use client";
import * as React from "react";
import { ToolPanel, Dropzone, FileChip, ReadoutTile, ProgressShimmer, ErrorBox } from "../_ui";
import { WavePeaks, ToolPlayer } from "../_audio";
import { Icon } from "../../_ui/Icon";
import { loadFFmpeg } from "../lib/ffmpeg";
import { decodeFile, computePeaks, fmtTime, fmtSize } from "../lib/audio";

const FEAT = '"calt","kern","liga","ss03"';
const sans = "var(--rc-font-sans)";

const RNNOISE = "/demo/rnnoise-sh.rnnn";

type State = "empty" | "active" | "success" | "error";

export function NoiseRemover() {
  const [state, setState] = React.useState<State>("empty");
  const [phase, setPhase] = React.useState("Preparing the in-browser engine");
  const [error, setError] = React.useState("");
  const [ab, setAb] = React.useState<"cleaned" | "original">("cleaned");
  const [origUrl, setOrigUrl] = React.useState<string | null>(null);
  const [cleanUrl, setCleanUrl] = React.useState<string | null>(null);
  const [outName, setOutName] = React.useState("cleaned.wav");
  const [fileName, setFileName] = React.useState("");
  const [meta, setMeta] = React.useState({ dur: 0, size: 0, kHz: 48, peaks: [] as number[] });

  const reset = () => {
    if (origUrl) URL.revokeObjectURL(origUrl);
    if (cleanUrl) URL.revokeObjectURL(cleanUrl);
    setOrigUrl(null); setCleanUrl(null); setError(""); setState("empty");
  };

  async function run(files: FileList) {
    const file = files[0];
    if (!file) return;
    setState("active");
    setError("");
    setFileName(file.name);
    try {
      setPhase("Analysing noise profile");
      const { ff, fetchFile } = await loadFFmpeg();
      const ext = (file.name.split(".").pop() || "wav").toLowerCase();
      const base = file.name.replace(/\.[^.]+$/, "");
      const inName = `in.${ext}`;
      setPhase("Loading your file, on your device");
      await (ff.writeFile as (n: string, d: Uint8Array) => Promise<void>)(inName, await fetchFile(file));
      await (ff.writeFile as (n: string, d: Uint8Array) => Promise<void>)("rnnoise-sh.rnnn", await fetchFile(RNNOISE));
      setPhase("Separating speech from background noise");
      const code = await (ff.exec as (a: string[]) => Promise<number>)([
        "-i", inName, "-vn",
        "-af", "aformat=channel_layouts=mono,arnndn=m=rnnoise-sh.rnnn",
        "-c:a", "pcm_s16le", "out.wav",
      ]);
      if (code !== 0) throw new Error("The engine could not process this file.");
      const data = (await (ff.readFile as (n: string) => Promise<Uint8Array>)("out.wav")) as Uint8Array;
      await (ff.deleteFile as (n: string) => Promise<void>)(inName).catch(() => {});
      await (ff.deleteFile as (n: string) => Promise<void>)("out.wav").catch(() => {});
      const cleanedBlob = new Blob([data.buffer as ArrayBuffer], { type: "audio/wav" });
      const buf = await decodeFile(cleanedBlob);
      setMeta({ dur: buf.duration, size: cleanedBlob.size, kHz: Math.round(buf.sampleRate / 1000), peaks: computePeaks(buf, 200) });
      setOrigUrl(URL.createObjectURL(file));
      setCleanUrl(URL.createObjectURL(cleanedBlob));
      setOutName(`${base}_cleaned.wav`);
      setAb("cleaned");
      setState("success");
    } catch {
      setError("It may be corrupt or in a format we do not support. Try a WAV, MP3, M4A or OGG file.");
      setState("error");
    }
  }

  const activeUrl = ab === "cleaned" ? cleanUrl : origUrl;

  return (
    <ToolPanel>
      {state === "empty" && (
        <Dropzone label="Drop an audio or video file" hint="Your file is cleaned in your browser and never uploaded. First run downloads the engine once." onFiles={run} />
      )}

      {state === "active" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <FileChip name={fileName} />
            <span style={{ font: `400 13px/1.4 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>{phase}</span>
          </div>
          <ProgressShimmer />
          <div style={{ font: `400 12.5px/1.5 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>Separating speech from background noise. This runs entirely in your browser.</div>
        </div>
      )}

      {state === "success" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <FileChip name={outName} meta={`${fmtTime(meta.dur)} · ${fmtSize(meta.size)}`} />
            <div style={{ display: "inline-flex", background: "var(--rc-surface-elevated)", borderRadius: 9, padding: 3, gap: 3 }}>
              {(["original", "cleaned"] as const).map((k) => (
                <button key={k} type="button" onClick={() => setAb(k)} style={{ padding: "7px 14px", borderRadius: 6, border: "none", cursor: "pointer", font: `500 12.5px/1 ${sans}`, fontFeatureSettings: FEAT, textTransform: "capitalize", background: ab === k ? "var(--rc-ink)" : "transparent", color: ab === k ? "var(--rc-canvas)" : "var(--rc-body)" }}>{k}</button>
              ))}
            </div>
          </div>
          <WavePeaks peaks={meta.peaks} height={48} color={ab === "cleaned" ? "#f5732b" : "#3f7bd6"} />
          {activeUrl && <ToolPlayer key={ab} src={activeUrl} accent={ab === "cleaned" ? "#f5732b" : "#3f7bd6"} />}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ReadoutTile label="Noise" value="reduced" tone="ok" />
            <ReadoutTile label="Speech" value="preserved" tone="ok" />
            <ReadoutTile label="Output" value={`WAV ${meta.kHz} kHz`} />
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={cleanUrl ?? "#"} download={outName} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 8, background: "var(--rc-ink)", color: "var(--rc-canvas)", font: `600 13.5px/1 ${sans}`, fontFeatureSettings: FEAT, textDecoration: "none" }}>
              <Icon name="download" size={16} /> Download cleaned WAV
            </a>
            <button type="button" onClick={reset} style={{ padding: "11px 18px", borderRadius: 8, border: "1px solid var(--rc-hairline)", background: "var(--rc-surface-elevated)", color: "var(--rc-body)", font: `600 13.5px/1 ${sans}`, fontFeatureSettings: FEAT, cursor: "pointer" }}>Start over</button>
          </div>
        </div>
      )}

      {state === "error" && <ErrorBox title="We could not read that file" message={error} onRetry={reset} retryLabel="Try another file" />}
    </ToolPanel>
  );
}
