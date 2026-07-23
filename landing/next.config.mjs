// Vocast 랜딩 (Next.js App Router).
// - transpilePackages: 워크스페이스 DS(@timbre/design-system)의 raw TS/TSX를 Next가 컴파일.
// - 배포: Vercel + 커스텀 도메인 vocast.me (루트 서빙, basePath 없음).
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@timbre/design-system"],
  images: { unoptimized: true },
  // 사이트 전역 URL 규약 = trailing slash. canonical/sitemap/내부 링크가 모두 "/x/"
  // 형태라 서빙도 이에 맞춰 정렬(그래야 canonical이 308 리다이렉트를 안 가리킴).
  trailingSlash: true,
  // 이 모노레포 루트를 트레이싱 루트로 고정 (상위 docusaurus-blog lockfile 오탐 방지)
  outputFileTracingRoot: repoRoot,
};

export default nextConfig;
