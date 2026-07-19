"use client";
import * as React from "react";
import { ToolPanel, ReadoutTile, ErrorBox } from "../_ui";
import { LiveWave, LevelMeter, ToolPlayer, useLevel } from "../_audio";
import { Icon } from "../../_ui/Icon";
import { audioCtx } from "../lib/audio";

const FEAT = '"calt","kern","liga","ss03"';
const sans = "var(--rc-font-sans)";
const mono = "var(--rc-font-mono)";

type State = "empty" | "active" | "error";

export function MicTest() {
  const [state, setState] = React.useState<State>("empty");
  const [err, setErr] = React.useState("");
  const [analyser, setAnalyser] = React.useState<AnalyserNode | null>(null);
  const [sampleUrl, setSampleUrl] = React.useState<string | null>(null);
  const [recording, setRecording] = React.useState(false);
  const [floor, setFloor] = React.useState(0);
  const streamRef = React.useRef<MediaStream | null>(null);
  const { level, clipping, db } = useLevel(analyser);

  React.useEffect(() => { if (db > -90) setFloor((f) => Math.min(f || 0, db)); }, [db]);

  const stopAll = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setAnalyser(null);
    if (sampleUrl) URL.revokeObjectURL(sampleUrl);
    setSampleUrl(null);
    setState("empty");
  }, [sampleUrl]);

  React.useEffect(() => () => { streamRef.current?.getTracks().forEach((t) => t.stop()); }, []);

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = audioCtx();
      await ctx.resume();
      const an = ctx.createAnalyser();
      an.fftSize = 2048;
      ctx.createMediaStreamSource(stream).connect(an);
      setFloor(0);
      setAnalyser(an);
      setState("active");
    } catch {
      setErr("Microphone access was blocked. Allow the microphone in your browser and try again.");
      setState("error");
    }
  }

  function recordSample() {
    if (!streamRef.current) return;
    setRecording(true);
    const rec = new MediaRecorder(streamRef.current);
    const chunks: BlobPart[] = [];
    rec.ondataavailable = (e) => chunks.push(e.data);
    rec.onstop = () => { setSampleUrl(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/webm" }))); setRecording(false); };
    rec.start();
    setTimeout(() => rec.state !== "inactive" && rec.stop(), 5000);
  }

  const background = floor < -58 ? "Low" : floor < -46 ? "Medium" : "High";
  const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 8, cursor: "pointer", font: `600 13px/1 ${sans}`, fontFeatureSettings: FEAT };
  const label = { font: `400 10.5px/1 ${mono}`, color: "var(--rc-ash)", textTransform: "uppercase", letterSpacing: ".5px" } as const;

  return (
    <ToolPanel>
      {state === "empty" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "clamp(24px,5vw,44px) 24px", textAlign: "center" }}>
          <span style={{ width: 52, height: 52, borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--rc-surface-elevated)", border: "1px solid var(--rc-hairline)", color: "var(--rc-mute)" }}><Icon name="mic" size={24} /></span>
          <div style={{ font: `500 16px/1.4 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-ink)" }}>Check your microphone</div>
          <div style={{ maxWidth: 400, font: `400 13.5px/1.6 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-mute)" }}>Your browser will ask for microphone access. Nothing is recorded or uploaded until you choose to record a sample.</div>
          <button onClick={start} style={{ ...btn, background: "var(--rc-ink)", color: "var(--rc-canvas)", border: "none", padding: "11px 18px" }}><Icon name="mic" size={16} /> Start microphone</button>
        </div>
      )}

      {state === "active" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: "var(--rc-radius-full)", background: "rgba(89,212,153,.12)", font: `500 12.5px/1 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-accent-green)" }}>
              <span className="vt-blink" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--rc-accent-green)" }} /> Listening
            </span>
            <span style={{ font: `400 13px/1.4 ${sans}`, fontFeatureSettings: FEAT, color: "var(--rc-body)" }}>Speak normally to check your level.</span>
          </div>
          <div>
            <div style={{ ...label, marginBottom: 10 }}>Input level</div>
            <LevelMeter level={level} clipping={clipping} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 7, font: `400 11px/1 ${mono}`, color: "var(--rc-ash)" }}>
              <span>-60 dB</span><span style={{ color: "var(--rc-accent-green)" }}>safe range</span><span>0 dB</span>
            </div>
          </div>
          <LiveWave analyser={analyser} height={40} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <ReadoutTile label="Level" value={`${db > -90 ? db.toFixed(0) : "-inf"} dB`} />
            <ReadoutTile label="Clipping" value={clipping ? "Detected" : "None"} tone={clipping ? undefined : "ok"} />
            <ReadoutTile label="Background" value={background} tone={background === "Low" ? "ok" : undefined} />
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={recordSample} disabled={recording} style={{ ...btn, background: "var(--rc-surface-elevated)", border: "1px solid var(--rc-hairline)", color: "var(--rc-body)", opacity: recording ? 0.6 : 1 }}>
              {recording ? "Recording 5 seconds…" : "Record a 5 second sample"}
            </button>
            <button onClick={stopAll} style={{ ...btn, background: "transparent", border: "1px solid var(--rc-hairline)", color: "var(--rc-body)" }}>Stop</button>
          </div>
          {sampleUrl && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ ...label }}>Your sample</div>
              <ToolPlayer src={sampleUrl} />
            </div>
          )}
        </div>
      )}

      {state === "error" && <ErrorBox title="Microphone blocked" message={err} onRetry={() => setState("empty")} />}
    </ToolPanel>
  );
}
