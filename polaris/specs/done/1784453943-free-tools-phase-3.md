---
type: spec
id: 1784453943
goal: 1784452723-organic-tools-traffic
related_issues: []
branch: feat/1784453943
created: 2026-07-19
weak_dimensions: []
---

# free-tools-phase-3

## What changes (S1)

ffmpeg.wasm 기반 도구 2종 추가(라이브): loudness-normalizer(loudnorm으로 -14/-16/-23/
custom LUFS 정규화, before/after LUFS+true peak 파싱·표시), audio-format-converter
(mp3/wav/m4a/ogg/flac + bitrate). 공유 로더 app/tools/lib/ffmpeg.ts(로그 캡처 포함)로
추출하고 NoiseRemover도 이 로더를 쓰도록 리팩터. 이로써 7종 전부 라이브.

## Done criteria (S2)

빌드 성공, 7개 SSG 프리렌더, 신규 2개 JSON-LD 풀세트+canonical, 인덱스 7 라이브 링크,
sitemap 8개. (완료)

## Out of scope (S3)

MP3 recorder 내보내기, 도구 페이지 반응형 미세조정, ffmpeg 실처리 라이브 스팟체크(배포 후).

## Why now (S4)

Phase 1/2에 이어 남은 2종을 채워 핸드오프의 7종 세트를 완성.

## User / consumer (S5)

크리에이터/팟캐스터/유튜버 + 검색/AI 크롤러.

## Riskiest assumption (S6)

벤더 코어가 libmp3lame/libvorbis/flac/aac/loudnorm을 지원(strings로 확인함),
loudnorm print_format=json 로그 파싱이 실환경에서 안정적이다.

## Implementation notes

코어 인코더 지원 strings로 확인(mp3lame/vorbis/opus/flac/pcm/loudnorm/arnndn). 빌드 OK,
7 SSG, 신규 2개 JSON-LD+canonical(vocast.me)+H1 확인, 인덱스 7 링크, sitemap 8. ffmpeg
공유 로더로 DRY(NoiseRemover 포함). 실처리는 배포 후 라이브 스팟체크.
