"use client";
import * as React from "react";
import { Icon } from "../_ui/Icon";

const RAY = "#f5732b";

const mono = "var(--rc-font-mono)";
function fmt(s: number): string {
  if (!Number.isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/** 커스텀 오디오 플레이어: 플레이/일시정지 원 + 오렌지 스크러버 + 현재/전체 시간 (레퍼런스 07/12/13/14) */
export function ToolPlayer({ src, accent = RAY }: { src: string; accent?: string }) {
  const ref = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState(false);
  const [cur, setCur] = React.useState(0);
  const [dur, setDur] = React.useState(0);
  React.useEffect(() => { setPlaying(false); setCur(0); }, [src]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <audio ref={ref} src={src} preload="metadata" onLoadedMetadata={(e) => setDur((e.target as HTMLAudioElement).duration || 0)} onTimeUpdate={(e) => setCur((e.target as HTMLAudioElement).currentTime)} onEnded={() => setPlaying(false)} />
      <button
        aria-label={playing ? "Pause" : "Play"}
        onClick={() => { const a = ref.current; if (!a) return; if (a.paused) { a.play().catch(() => {}); setPlaying(true); } else { a.pause(); setPlaying(false); } }}
        style={{ width: 40, height: 40, borderRadius: "50%", flex: "none", border: "none", cursor: "pointer", background: "var(--rc-ink)", color: "var(--rc-canvas)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      >
        <Icon name={playing ? "pause" : "play"} size={16} />
      </button>
      <span style={{ font: `400 12px/1 ${mono}`, color: "var(--rc-mute)", flex: "none" }}>{fmt(cur)}</span>
      <div
        onClick={(e) => { const a = ref.current; if (!a || !dur) return; const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); a.currentTime = ((e.clientX - r.left) / r.width) * dur; }}
        style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--rc-surface-elevated)", cursor: "pointer", overflow: "hidden" }}
      >
        <div style={{ width: `${dur ? (cur / dur) * 100 : 0}%`, height: "100%", background: accent }} />
      </div>
      <span style={{ font: `400 12px/1 ${mono}`, color: "var(--rc-mute)", flex: "none" }}>{fmt(dur)}</span>
    </div>
  );
}

/** AnalyserNode를 rAF로 그리는 실시간 막대 파형 (녹음/청취 피드백) */
export function LiveWave({ analyser, color = RAY, height = 44 }: { analyser: AnalyserNode | null; color?: string; height?: number }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const cv = ref.current;
    if (!cv || !analyser) return;
    const g = cv.getContext("2d");
    if (!g) return;
    const dpr = window.devicePixelRatio || 1;
    const buf = new Uint8Array(analyser.fftSize);
    let raf = 0;
    const draw = () => {
      const w = (cv.width = Math.max(1, cv.clientWidth * dpr));
      const h = (cv.height = height * dpr);
      analyser.getByteTimeDomainData(buf);
      g.clearRect(0, 0, w, h);
      const bars = Math.max(8, Math.floor(cv.clientWidth / 5));
      const step = Math.floor(buf.length / bars);
      const bw = w / bars;
      g.fillStyle = color;
      for (let i = 0; i < bars; i++) {
        let peak = 0;
        for (let j = 0; j < step; j++) { const v = Math.abs(buf[i * step + j] - 128) / 128; if (v > peak) peak = v; }
        const bh = Math.max(2 * dpr, peak * h * 0.92);
        g.globalAlpha = 0.55 + peak * 0.45;
        const x = i * bw + bw * 0.2;
        g.fillRect(x, (h - bh) / 2, bw * 0.6, bh);
      }
      g.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [analyser, color, height]);
  return <canvas ref={ref} style={{ width: "100%", height, display: "block" }} />;
}

/** 정적 피크 막대 파형 + (옵션) 무음 구간 빨강 오버레이. regions는 0..1 비율 [start,end]. */
export function WavePeaks({ peaks, color = RAY, height = 44, regions }: { peaks: number[]; color?: string; height?: number; regions?: [number, number][] }) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  React.useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const g = cv.getContext("2d");
    if (!g) return;
    const dpr = window.devicePixelRatio || 1;
    const w = (cv.width = Math.max(1, cv.clientWidth * dpr));
    const h = (cv.height = height * dpr);
    g.clearRect(0, 0, w, h);
    if (regions) {
      g.fillStyle = "rgba(255,97,97,.16)";
      for (const [s, e] of regions) g.fillRect(s * w, 0, Math.max(1, (e - s) * w), h);
    }
    const n = peaks.length || 1;
    const bw = w / n;
    g.fillStyle = color;
    for (let i = 0; i < n; i++) {
      const bh = Math.max(2 * dpr, peaks[i] * h * 0.92);
      g.fillRect(i * bw + bw * 0.15, (h - bh) / 2, bw * 0.7, bh);
    }
  }, [peaks, color, height, regions]);
  return <canvas ref={ref} style={{ width: "100%", height, display: "block" }} />;
}

/** 입력 레벨 미터 (0..1). safe 구간 표시 + 클리핑 시 빨강. */
export function LevelMeter({ level, clipping }: { level: number; clipping: boolean }) {
  const pct = Math.max(0, Math.min(1, level)) * 100;
  return (
    <div>
      <div style={{ position: "relative", height: 10, borderRadius: 5, background: "var(--rc-surface-elevated)", overflow: "hidden" }}>
        {/* safe zone marker (대략 -24..-6 dBFS) */}
        <span style={{ position: "absolute", top: 0, bottom: 0, left: "18%", width: "58%", background: "rgba(89,212,153,.10)", borderLeft: "1px solid rgba(89,212,153,.35)", borderRight: "1px solid rgba(89,212,153,.35)" }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${pct}%`, background: clipping ? "#ff6161" : "#59d499", transition: "width .06s linear" }} />
      </div>
    </div>
  );
}

/** analyser에서 RMS(dBFS)와 클리핑 여부를 rAF로 폴링하는 훅 */
export function useLevel(analyser: AnalyserNode | null) {
  const [level, setLevel] = React.useState(0);
  const [clipping, setClipping] = React.useState(false);
  const [db, setDb] = React.useState(-90);
  React.useEffect(() => {
    if (!analyser) return;
    const buf = new Uint8Array(analyser.fftSize);
    let raf = 0;
    const tick = () => {
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      let peak = 0;
      for (let i = 0; i < buf.length; i++) {
        const v = (buf[i] - 128) / 128;
        sum += v * v;
        if (Math.abs(v) > peak) peak = Math.abs(v);
      }
      const rms = Math.sqrt(sum / buf.length);
      const d = 20 * Math.log10(rms || 1e-6);
      setDb(d);
      setLevel(Math.max(0, (d + 60) / 60)); // -60..0 dB → 0..1
      setClipping(peak > 0.985);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [analyser]);
  return { level, clipping, db };
}
