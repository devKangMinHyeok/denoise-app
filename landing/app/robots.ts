import type { MetadataRoute } from "next";
import { abs } from "../lib/site";

// Vercel 루트 배포(vocast.me)에서 /robots.txt 로 생성된다. 사이트맵은 도메인 루트
// (https://vocast.me/sitemap.xml)에 놓이고 Search Console 에도 직접 제출한다.
export const dynamic = "force-static";

// AI 검색/학습 크롤러 명시적 허용 (GEO: AI 답변에 인용될 수 있게)
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "Google-Extended",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Applebot-Extended",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((ua) => ({ userAgent: ua, allow: "/" })),
    ],
    sitemap: abs("/sitemap.xml"),
  };
}
