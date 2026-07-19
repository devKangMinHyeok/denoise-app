// Free tools 레지스트리. 인덱스 카드 + 도구 페이지 콘텐츠 + SEO 데이터의 단일 소스.
// live=true 인 도구만 실제 페이지/사이트맵/JSON-LD 대상. 나머지는 인덱스에 "soon" 카드로만.

import type { Icon } from "../_ui/Icon";

type IconName = React.ComponentProps<typeof Icon>["name"];
export type VizKind = "noise" | "reading" | "mic" | "recorder" | "silence" | "loudness" | "convert";

export interface ToolFaq {
  q: string;
  a: string;
}
export interface ToolStep {
  name: string;
  text: string;
}
export interface ToolDef {
  slug: string;
  live: boolean;
  name: string; // 페이지 H1 / title
  shortName: string; // nav/related 짧은 이름
  icon: IconName;
  viz: VizKind;
  windowTitle: string; // 카드 윈도우 타이틀바(mono)
  cardTitle: string; // 윈도우 아래 H3
  cardDesc: string; // 윈도우 아래 한두 줄
  // 아래는 live 도구에서 필수
  metaTitle?: string;
  metaDescription?: string;
  quickAnswer?: string;
  keywords?: string[];
  faqs?: ToolFaq[];
  howto?: ToolStep[];
  cta?: { title: string; body: string };
  related?: string[]; // slugs
}

export const TOOLS: ToolDef[] = [
  {
    slug: "audio-noise-remover",
    live: true,
    name: "Audio noise remover",
    shortName: "Noise remover",
    icon: "clean",
    viz: "noise",
    windowTitle: "noise removal",
    cardTitle: "Audio noise remover",
    cardDesc: "Remove background noise and keep your word endings, in your browser.",
    metaTitle: "Audio noise remover, free and in your browser",
    metaDescription:
      "Remove background noise from audio or video for free. Runs entirely in your browser, nothing is uploaded. Compare original and cleaned, then download.",
    quickAnswer:
      "This free audio noise remover cleans background hiss, hum, and room noise from a recording. It runs entirely in your browser using a neural filter, so nothing is uploaded and your file never leaves your device. Drop an audio or video file, compare the original with the cleaned version, and download the result. Made for creators, podcasters, and anyone recording voice.",
    keywords: [
      "audio noise remover",
      "remove background noise from audio",
      "noise reducer online",
      "clean up audio online free",
      "remove noise from video",
    ],
    faqs: [
      { q: "Is my audio uploaded anywhere?", a: "No. The noise removal runs entirely in your browser on your machine. Your file is never uploaded, and nothing is sent to a server." },
      { q: "What file types work?", a: "Common audio and video files (for example wav, mp3, m4a, mov, mp4). For video, the audio is cleaned and the video is kept as is." },
      { q: "Will it cut off the ends of my words?", a: "The filter is tuned to preserve speech, including word endings and breaths, rather than aggressively gating everything. You can compare original and cleaned before you download." },
      { q: "Is it really free?", a: "Yes. It is a free tool from Vocast, with no signup and no limits. The first run downloads the in-browser engine once." },
      { q: "How is this different from Vocast?", a: "This tool cleans an existing recording. Vocast, the paid Mac app, clones your voice and narrates any script in it, fully local, for $49 one time." },
    ],
    howto: [
      { name: "Add your file", text: "Drop an audio or video file onto the panel, or choose one. It stays on your device." },
      { name: "Clean it", text: "The in-browser engine removes background noise while preserving your speech." },
      { name: "Compare", text: "Toggle between original and cleaned to hear the difference before you commit." },
      { name: "Download", text: "Save the cleaned audio. Nothing was uploaded at any point." },
    ],
    cta: {
      title: "Clean audio is step one",
      body: "This free tool cleans a recording. To narrate any script in a voice cloned from your own, fully local on your Mac, get Vocast.",
    },
    related: ["silence-remover", "loudness-normalizer", "audio-format-converter"],
  },
  {
    slug: "script-reading-time-calculator",
    live: true,
    name: "Script reading time calculator",
    shortName: "Reading time",
    icon: "clock",
    viz: "reading",
    windowTitle: "script.txt",
    cardTitle: "Reading time calculator",
    cardDesc: "Paste a script, get the spoken length at your pace. Instant, no file.",
    metaTitle: "Script reading time calculator, words to minutes",
    metaDescription:
      "Paste a script and get its spoken length in minutes at your speaking pace. Free, instant, and private. Shows word, character, and sentence counts and a per paragraph breakdown.",
    quickAnswer:
      "This free reading time calculator turns a script into an estimated spoken length. Paste your text, pick a speaking pace (words per minute), and it shows the total time plus word, character, and sentence counts and a per paragraph breakdown. It is instant and runs entirely in your browser, so nothing is uploaded. Useful for narrators, video scripts, podcasts, and speeches.",
    keywords: [
      "script reading time calculator",
      "words to minutes",
      "speech time calculator",
      "how long to read a script",
      "words per minute reading time",
    ],
    faqs: [
      { q: "How is the time calculated?", a: "Time equals word count divided by your words per minute, shown as minutes and seconds. Sentences are counted by end punctuation, paragraphs by blank lines." },
      { q: "What speaking pace should I use?", a: "About 130 words per minute is a slow, deliberate narration, 150 is a natural pace, and 170 is brisk. You can also set a custom number." },
      { q: "Is my text uploaded?", a: "No. The calculation happens in your browser as you type. Nothing is sent anywhere." },
      { q: "Does it account for pauses?", a: "It estimates continuous reading at your chosen pace. Real narration with pauses and emphasis will usually run a little longer." },
    ],
    howto: [
      { name: "Paste your script", text: "Type or paste the text you plan to narrate into the box." },
      { name: "Set your pace", text: "Choose a words per minute preset, or enter your own speaking rate." },
      { name: "Read the result", text: "See the estimated spoken time, counts, and a per paragraph breakdown update live." },
    ],
    cta: {
      title: "Know the length, then narrate it",
      body: "This tells you how long your script runs. Vocast narrates it in a voice cloned from your own, up to 20,000 characters, fully local on your Mac.",
    },
    related: ["voice-recorder", "audio-noise-remover", "mic-test"],
  },
  {
    slug: "mic-test",
    live: false,
    name: "Mic test",
    shortName: "Mic test",
    icon: "mic",
    viz: "mic",
    windowTitle: "mic test",
    cardTitle: "Mic test",
    cardDesc: "Check your microphone level and quality before you record.",
  },
  {
    slug: "voice-recorder",
    live: false,
    name: "Voice recorder",
    shortName: "Recorder",
    icon: "record",
    viz: "recorder",
    windowTitle: "recorder",
    cardTitle: "Voice recorder",
    cardDesc: "Record, trim, and download audio, all on your device.",
  },
  {
    slug: "silence-remover",
    live: false,
    name: "Silence remover and trimmer",
    shortName: "Silence remover",
    icon: "scissors",
    viz: "silence",
    windowTitle: "silence",
    cardTitle: "Silence remover",
    cardDesc: "Cut dead air automatically, or trim by hand.",
  },
  {
    slug: "loudness-normalizer",
    live: false,
    name: "Loudness (LUFS) normalizer",
    shortName: "Loudness",
    icon: "gauge",
    viz: "loudness",
    windowTitle: "loudness",
    cardTitle: "Loudness normalizer",
    cardDesc: "Match YouTube, podcast, or broadcast loudness targets.",
  },
  {
    slug: "audio-format-converter",
    live: false,
    name: "Audio format converter",
    shortName: "Converter",
    icon: "convert",
    viz: "convert",
    windowTitle: "convert",
    cardTitle: "Audio format converter",
    cardDesc: "Convert between mp3, wav, m4a, and more, privately.",
  },
];

export function liveTools(): ToolDef[] {
  return TOOLS.filter((t) => t.live);
}
export function getTool(slug: string): ToolDef | undefined {
  return TOOLS.find((t) => t.slug === slug && t.live);
}
