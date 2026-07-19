// 브라우저 ffmpeg.wasm(단일스레드 코어) 공유 로더. 기존 /demo 데모의 벤더를 그대로 재사용.
// 클라이언트 패널의 사용자 액션에서만 호출된다(동적 import는 브라우저에서 실행).

export type FF = Record<string, (...args: unknown[]) => unknown>;
const VENDOR = "/demo/vendor";

interface Loaded {
  ff: FF;
  fetchFile: (f: File | string) => Promise<Uint8Array>;
  logs: string[];
  clearLogs: () => void;
}

let promise: Promise<Loaded> | null = null;

export function loadFFmpeg(): Promise<Loaded> {
  if (promise) return promise;
  promise = (async () => {
    const ffmpegMod: { FFmpeg: new () => FF } = await import(/* webpackIgnore: true */ `${VENDOR}/ffmpeg/index.js`);
    const utilMod: { fetchFile: (f: File | string) => Promise<Uint8Array> } = await import(/* webpackIgnore: true */ `${VENDOR}/util/index.js`);
    const ff = new ffmpegMod.FFmpeg();
    const logs: string[] = [];
    (ff.on as (ev: string, cb: (x: { message: string }) => void) => void)("log", ({ message }) => logs.push(message));
    await (ff.load as (o: unknown) => Promise<void>)({
      coreURL: new URL(`${VENDOR}/core/ffmpeg-core.js`, location.href).href,
      wasmURL: new URL(`${VENDOR}/core/ffmpeg-core.wasm`, location.href).href,
    });
    return { ff, fetchFile: utilMod.fetchFile, logs, clearLogs: () => { logs.length = 0; } };
  })();
  return promise;
}

/** ffmpeg 헬퍼: 입력 쓰기 → exec → 결과 읽기 → 정리 */
export async function runFFmpeg(inputName: string, inputData: Uint8Array, args: string[], outName: string): Promise<Uint8Array> {
  const { ff } = await loadFFmpeg();
  await (ff.writeFile as (n: string, d: Uint8Array) => Promise<void>)(inputName, inputData);
  const code = await (ff.exec as (a: string[]) => Promise<number>)(args);
  if (code !== 0) throw new Error("The engine could not process this file.");
  const data = (await (ff.readFile as (n: string) => Promise<Uint8Array>)(outName)) as Uint8Array;
  await (ff.deleteFile as (n: string) => Promise<void>)(inputName).catch(() => {});
  await (ff.deleteFile as (n: string) => Promise<void>)(outName).catch(() => {});
  return data;
}
