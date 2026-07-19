"use client";
import * as React from "react";
import { ToolPanel, Dropzone, ReadoutTile, ProgressShimmer, ErrorBox } from "../_ui";
import { Waveform } from "../../_ui/Waveform";
import { Icon } from "../../_ui/Icon";

const FEAT = '"calt","kern","liga","ss03"';
const sans = "var(--rc-font-sans)";
const mono = "var(--rc-font-mono)";

// 기존 브라우저 데모의 벤더 ffmpeg.wasm(단일스레드 코어)을 그대로 재사용.
const VENDOR = "/demo/vendor";
const RNNOISE = "/demo/rnnoise-sh.rnnn";

type FF = Record<string, (...args: unknown[]) => unknown>;
let ffmpegPromise: Promise<{ ff: FF; fetchFile: (f: File | string) => Promise<Uint8Array> }> | null = null;
async function loadFFmpeg() {
  if (ffmpegPromise) return ffmpegPromise;
  ffmpegPromise = (async () => {
    const ffmpegMod: { FFmpeg: new () => FF } = await import(
      /* webpackIgnore: true */ `${VENDOR}/ffmpeg/index.js`
    );
    const utilMod: { fetchFile: (f: File | string) => Promise<Uint8Array> } = await import(
      /* webpackIgnore: true */ `${VENDOR}/util/index.js`
    );
    const ff = new ffmpegMod.FFmpeg();
    await (ff.load as (o: unknown) => Promise<void>)({
      coreURL: new URL(`${VENDOR}/core/ffmpeg-core.js`, location.href).href,
      wasmURL: new URL(`${VENDOR}/core/ffmpeg-core.wasm`, location.href).href,
    });
    return { ff, fetchFile: utilMod.fetchFile };
  })();
  return ffmpegPromise;
}

type State = "empty" | "active" | "success" | "error";

export function NoiseRemover() {
  const [state, setState] = React.useState<State>("empty");
  const [phase, setPhase] = React.useState("Preparing the in-browser engine");
  const [error, setError] = React.useState("");
  const [ab, setAb] = React.useState<"cleaned" | "original">("cleaned");
  const [origUrl, setOrigUrl] = React.useState<string | null>(null);
  const [cleanUrl, setCleanUrl] = React.useState<string | null>(null);
  const [outName, setOutName] = React.useState("cleaned.wav");
  const audioRef = React.useRef<HTMLAudioElement>(null);

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
    try {
      setPhase("Preparing the in-browser engine");
      const { ff, fetchFile } = await loadFFmpeg();
      const ext = (file.name.split(".").pop() || "wav").toLowerCase();
      const base = file.name.replace(/\.[^.]+$/, "");
      const inName = `in.${ext}`;
      setPhase("Loading your file, on your device");
      await (ff.writeFile as (n: string, d: Uint8Array) => Promise<void>)(inName, await fetchFile(file));
      await (ff.writeFile as (n: string, d: Uint8Array) => Promise<void>)("rnnoise-sh.rnnn", await fetchFile(RNNOISE));
      setPhase("Removing background noise");
      const code = await (ff.exec as (a: string[]) => Promise<number>)([
        "-i", inName, "-vn",
        "-af", "aformat=channel_layouts=mono,arnndn=m=rnnoise-sh.rnnn",
        "-c:a", "pcm_s16le", "out.wav",
      ]);
      if (code !== 0) throw new Error("The engine could not process this file.");
      const data = (await (ff.readFile as (n: string) => Promise<Uint8Array>)("out.wav")) as Uint8Array;
      await (ff.deleteFile as (n: string) => Promise<void>)(inName).catch(() => {});
      await (ff.deleteFile as (n: string) => Promise<void>)("out.wav").catch(() => {});
      const cleaned = URL.createObjectURL(new Blob([data.buffer as ArrayBuffer], { type: "audio/wav" }));
      setOrigUrl(URL.createObjectURL(file));
      setCleanUrl(cleaned);
      setOutName(`${base}_cleaned.wav`);
      setAb("cleaned");
      setState("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something failed while cleaning the audio.");
      setState("error");
    }
  }

  // A/B 전환 시 재생 소스 교체 (재생 상태 유지)
  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const url = ab === "cleaned" ? cleanUrl : origUrl;
    if (!url) return;
    const wasPlaying = !a.paused;
    const t = a.currentTime;
    a.src = url;
    a.currentTime = Number.isFinite(t) ? t : 0;
    if (wasPlaying) a.play().catch(() => {});
  }, [ab, cleanUrl, origUrl]);

  return (
    <ToolPanel>
      {state === "empty" && (
        <Dropzone
          label="Drop an audio or video file"
          hint="Your file is cleaned in your browser and never uploaded. First run downloads the engine once."
          onFiles={run}
        />
      )}

      {state === "active" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18, padding: "8px 0" }}>
          <Waveform count={48} mode="smooth" pos={1} activeColor="var(--rc-ray)" height={40} />
          <ProgressShimmer label={phase} />
          <div style={{ font: `400 12.5px/1.5 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>This stays on your device. Large files take longer.</div>
        </div>
      )}

      {state === "success" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "inline-flex", background: "var(--rc-surface-elevated)", borderRadius: 10, padding: 4, gap: 4, alignSelf: "flex-start" }}>
            {(["cleaned", "original"] as const).map((k) => (
              <button key={k} type="button" onClick={() => setAb(k)} style={{ padding: "8px 16px", borderRadius: 7, border: "none", cursor: "pointer", font: `500 13px/1 ${sans}`, fontFeatureSettings: FEAT, textTransform: "capitalize", background: ab === k ? "var(--rc-ink)" : "transparent", color: ab === k ? "var(--rc-canvas)" : "var(--rc-body)" }}>{k}</button>
            ))}
          </div>
          <Waveform count={48} mode="smooth" pos={1} activeColor={ab === "cleaned" ? "var(--rc-ray)" : "var(--rc-accent-blue)"} height={44} />
          <audio ref={audioRef} controls style={{ width: "100%" }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ReadoutTile label="Noise" value="reduced" tone="ok" />
            <ReadoutTile label="Speech" value="preserved" tone="ok" />
            <ReadoutTile label="Output" value="WAV · mono" />
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href={cleanUrl ?? "#"} download={outName} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", borderRadius: 8, background: "var(--rc-ink)", color: "var(--rc-canvas)", font: `600 13.5px/1 ${sans}`, fontFeatureSettings: FEAT, textDecoration: "none" }}>
              <Icon name="download" size={16} /> Download cleaned WAV
            </a>
            <button type="button" onClick={reset} style={{ padding: "11px 18px", borderRadius: 8, border: "1px solid var(--rc-hairline)", background: "transparent", color: "var(--rc-body)", font: `600 13.5px/1 ${sans}`, fontFeatureSettings: FEAT, cursor: "pointer" }}>Start over</button>
          </div>
        </div>
      )}

      {state === "error" && <ErrorBox message={error} onRetry={reset} />}
    </ToolPanel>
  );
}
