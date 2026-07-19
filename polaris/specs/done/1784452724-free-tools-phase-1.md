---
type: spec
id: 1784452724
goal: 1784452723-organic-tools-traffic
related_issues: []
branch: feat/1784452724
created: 2026-07-19
weak_dimensions: []
---

# free-tools-phase-1

## What changes (S1)

/tools 인덱스 + /tools/{slug} 공유 템플릿 + SEO 인프라 전체 + 라이브 도구 2종
(script-reading-time-calculator 순수 JS, audio-noise-remover ffmpeg.wasm arnndn 재사용).
Nav에 Tools 추가, sitemap/llms.txt/JSON-LD(WebApplication·HowTo·FAQPage·Breadcrumb·
ItemList), next.config trailingSlash 전역.

## Done criteria (S2)

빌드 성공, /tools/* 200(trailing slash), reading time 계산 정확, noise remover empty 렌더,
JSON-LD/canonical/sitemap 출력 확인. (완료)

## Out of scope (S3)

Phase 2(mic test, voice recorder, silence remover), Phase 3(loudness, converter).
noise remover의 실제 대용량 처리 라이브 스팟체크는 배포 후.

## Why now (S4)

SEO 유입은 페이지가 색인될 시간이 필요하므로 빨리 올릴수록 좋다.

## User / consumer (S5)

크리에이터/내레이터/팟캐스터 + 검색/AI 크롤러.

## Riskiest assumption (S6)

ffmpeg.wasm 벤더(/demo/vendor) 재사용이 Vercel 프로덕션에서도 그대로 동작한다.

## Implementation notes

로컬 검증: 빌드 OK, reading time 150w@150=1:00 확인, noise remover empty 스펙대로 렌더,
2개 SSG 프리렌더 + JSON-LD 풀세트 + canonical(vocast.me/tools/.../) 확인. trailingSlash
전역 도입으로 canonical 308 리다이렉트 해소. ffmpeg 실처리는 배포 후 라이브 스팟체크 예정.
