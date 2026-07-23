import type { Metadata, Viewport } from "next";
// Design system tokens + fonts + body defaults (dark canvas, Inter ss03).
import "@timbre/design-system/styles.css";
import "../globals.css";
import { rootMetadata } from "../../lib/metadata";

// 영어(기본 로케일) 루트 레이아웃. 라우트 그룹 (en) 은 URL에 영향 없음 → 루트 서빙.
export const metadata: Metadata = rootMetadata("en");

export const viewport: Viewport = {
  themeColor: "#07080a",
};

export default function EnRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
