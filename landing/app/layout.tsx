import type { Metadata, Viewport } from "next";
// Design system tokens + fonts + body defaults (dark canvas, Inter ss03).
import "@timbre/design-system/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vocast — read any script in your own voice",
  description:
    "A local, on-device Mac voice studio for creators. Clone your voice from a few lines, then narrate 20,000-character scripts in a voice that sounds like you. Studio-clean audio, AI-native (local MCP), 100% local. $49 one-time.",
  metadataBase: new URL("https://devkangminhyeok.github.io/vocast/"),
  openGraph: {
    title: "Vocast — read any script in your own voice",
    description:
      "Clone your voice, narrate any script in a voice that sounds like you. 100% local. $49 one-time.",
  },
};

export const viewport: Viewport = {
  themeColor: "#07080a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
