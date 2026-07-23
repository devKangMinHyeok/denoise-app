// English copy dictionary. Single source for all landing marketing prose.
// Korean lives in ko.ts (English fallback until the design handoff lands).
// Decorative mock-window microcopy (fake filenames, ETAs, tool names) is NOT
// here on purpose: it is product-UI simulation, not translatable marketing copy.

export interface NavLinkT {
  label: string;
  href: string; // locale-relative (e.g. "/#features", "/tools", "/blog")
}

export interface CardT {
  title: string;
  body: string;
}

export interface FaqItemT {
  q: string;
  a: string;
}

export const en = {
  nav: {
    links: [
      { label: "Features", href: "/#features" },
      { label: "Quality", href: "/#quality" },
      { label: "Privacy", href: "/#privacy" },
      { label: "AI (MCP)", href: "/#mcp" },
      { label: "Tools", href: "/tools" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Blog", href: "/blog" },
    ] as NavLinkT[],
    home: "Vocast home",
    menu: "Menu",
    buy: "Buy",
    buyPrice: "Buy · $49",
  },

  hero: {
    badge: "One-time purchase · 100% local · AI-agent (MCP) native",
    titleA: "Turn any script into natural audio,",
    titleB: "read aloud in your own voice.",
    body: "A Mac voice studio for creators. Clone your voice from a few lines, then narrate 20,000-character scripts that sound like you. Studio-clean audio, entirely on your machine.",
    ctaPrimary: "Own it for $49, one-time",
    ctaSecondary: "Try it in your browser",
    note: "macOS (Apple Silicon) · No subscription · Recordings never leave your device",
  },

  problem: {
    headingTitle: "Great narration shouldn't cost you your",
    headingAccent: "time or your voice.",
    cards: [
      {
        title: "Re-recording one line costs an hour",
        body: "Fix a single awkward take and you re-record, re-level and re-export the whole thing. Again.",
      },
      {
        title: "Subscriptions pile up, and your voice lives on someone's server",
        body: "Cloud voice tools bill monthly and keep your voiceprint. You never really own either one.",
      },
      {
        title: "Noise removal that erases your word endings",
        body: "Aggressive denoisers swallow the tail of every sentence, and the result sounds processed.",
      },
    ] as CardT[],
  },

  features: {
    headingTitle: "Narrate in your voice,",
    headingAccent: "clean audio included.",
    items: [
      { title: "Your voice profile", body: "Read ten guided lines once. Vocast builds a reusable profile, version it, reinforce it, roll back anytime." },
      { title: "Long-form narration", body: "Paste up to 20,000 characters. Edit any paragraph in place and re-render just that block, not the whole take." },
      { title: "Performance transfer", body: "Record a reference delivery and the clone follows your pacing, emphasis and pauses, not a flat read." },
      { title: "Karaoke lyrics view", body: "Watch each word light up as it plays, and click any word to jump there. Proofing long narration gets fast." },
      { title: "Hybrid noise removal", body: "Studio-clean audio that keeps your word endings. Standard filtering or full resynthesis when you need it." },
      { title: "Task center + ETA", body: "Everything heavy runs in the background with a live ETA, so you keep writing while renders finish." },
    ] as CardT[],
  },

  quality: {
    headingTitle: "We didn't build this on",
    headingAccent: "vibes.",
    stats: [
      { label: "Prosody north-star", note: "Naturalness scored against a human baseline on every render." },
      { label: "Word-ending loss gate", note: "Denoise is rejected if it shaves the tail of a sentence." },
      { label: "Speaker similarity", note: "Every clone is measured against your real voiceprint." },
      { label: "Automated tests", note: "The whole evaluation stack is guarded in CI, not vibes." },
    ],
    methodologyLink: "Read the methodology",
  },

  localFirst: {
    heading: "Your files never leave the machine.",
    points: [
      { title: "No upload", body: "There is no server. Nothing to send, nothing to leak." },
      { title: "Works offline", body: "After the one-time model download, run it on a plane." },
      { title: "Your files are yours", body: "Voice, scripts and renders stay on your disk. Always." },
    ] as CardT[],
  },

  mcp: {
    badge: "AI-native · Model Context Protocol",
    heading: "Claude operates this app directly.",
    body: "Vocast ships a local MCP server, so an AI agent can clone, narrate and denoise for you, entirely on your machine, no network in the loop.",
    chatUser: "Clean this interview and read the intro in my voice.",
    chatDone: "Done, clean cut plus a narrated intro in MyVoice, saved locally.",
    localBadge: "All local stdio, no network, no cloud.",
  },

  pricing: {
    headingTitle: "Not a subscription.",
    headingAccent: "Buy once, it's yours.",
    oneTime: "one-time",
    includes: [
      "1 year of free updates, optional renewal after",
      "Keep the app and last version forever",
      "Local MCP server included",
      "Use on up to 3 Macs",
      "14-day, no-questions refund",
    ],
    cta: "Own it for $49, one-time",
    fineprint: "14-day refund · macOS (Apple Silicon)",
  },

  faq: {
    headingTitle: "Questions,",
    headingAccent: "answered.",
    items: [
      { q: "Is it really not a subscription?", a: "Yes. $49 once. You get a year of free updates and can keep the app plus your last version forever, renewal after that is optional, not required." },
      { q: "Where is my voice data stored?", a: "On your Mac, in your user folder. There is no account and no server: your voiceprint, scripts and renders never leave the device." },
      { q: "Which Mac do I need?", a: "An Apple Silicon Mac (M1 or newer) on macOS 12+. Voice cloning uses on-device Metal acceleration; noise removal works everywhere." },
      { q: "How do I connect an AI agent?", a: "Vocast exposes a local MCP server over stdio. Point Claude, or any MCP-capable agent, at it and it can call denoise, clone_voice and the rest directly." },
      { q: "Can I clone any voice?", a: "Only your own voice, or a voice you have explicit consent to use. Cloning is built for creators narrating their own work, not for impersonation." },
      { q: "How is quality measured?", a: "Every render is scored on speaker similarity, word accuracy, naturalness and a prosody metric, and a render that misses any gate is rejected rather than shipped. The full methodology is on our blog." },
      { q: "What's the refund policy?", a: "14 days, no questions asked. If it doesn't fit your workflow, email us within two weeks for a full refund." },
    ] as FaqItemT[],
  },

  finalCta: {
    titleA: "Own your voice.",
    titleB: "Keep your words.",
    cta: "Own it for $49, one-time",
    or: "or",
    note: "macOS (Apple Silicon) · one-time purchase · no account",
  },

  footer: {
    tagline: "A local Mac voice studio for creators. Your voice, your words, your machine.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Features", href: "/#features" },
          { label: "Pricing", href: "/#pricing" },
          { label: "AI (MCP)", href: "/#mcp" },
          { label: "Privacy", href: "/#privacy" },
        ] as NavLinkT[],
      },
      {
        title: "Resources",
        links: [
          { label: "Blog", href: "/blog/" },
          { label: "Quality methodology", href: "/blog/measuring-prosody-not-vibes/" },
        ] as NavLinkT[],
      },
      {
        title: "Company",
        links: [
          { label: "Refund policy", href: "/#pricing" },
          { label: "Consent & usage", href: "/#" },
        ] as NavLinkT[],
      },
    ],
    copyright: "© 2026 Vocast",
    legal: "macOS (Apple Silicon) · 100% local · one-time purchase",
  },

  langSwitch: {
    label: "Language",
    en: "English",
    ko: "한국어",
  },
} as const;

export type Dict = typeof en;
