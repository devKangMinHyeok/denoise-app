import type { Metadata, Viewport } from "next";
// Design system tokens + fonts + body defaults (dark canvas, Inter ss03).
import "@timbre/design-system/styles.css";
import "../globals.css";
import { rootMetadata } from "../../lib/metadata";

// 한국어 루트 레이아웃. 라우트 그룹 (ko) + 내부 /ko 세그먼트로 /ko/ 아래 서빙.
export const metadata: Metadata = rootMetadata("ko");

export const viewport: Viewport = {
  themeColor: "#07080a",
};

export default function KoRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
