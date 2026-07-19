---
type: spec
id: 1784455439
goal: 1784452723-organic-tools-traffic
related_issues: []
branch: feat/1784455439
created: 2026-07-19
weak_dimensions: []
---

# free-tools-states-polish

## What changes (S1)

레퍼런스 스크린샷(06~08,10~14) 대조로 툴 success/active/error 상태 픽셀 다듬기 +
recorder MP3 내보내기 + 실동작 스팟체크.
- 공유: 커스텀 오디오 플레이어(ToolPlayer, 플레이+오렌지 스크러버+시간), FileChip
  (name·duration·size), 타일 2종(ReadoutTile 라벨-위 / StatTile 값-위), 중앙정렬
  ErrorBox(title/retryLabel). native audio controls를 전 도구에서 ToolPlayer로 교체.
- NoiseRemover: active(파일칩+phase+셔머+캡션), success(파일칩+A/B 우측+실파형+플레이어
  +NOISE/SPEECH/OUTPUT 타일), error(중앙, "We could not read that file"/Try another file).
- MicTest: Listening 필+INPUT LEVEL+dB 라벨(safe range)+LEVEL/CLIPPING/BACKGROUND 타일+
  보조 버튼.
- VoiceRecorder: ToolPlayer + MP3 다운로드(ffmpeg libmp3lame).

## Done criteria (S2)

빌드 OK. 실오디오 스팟체크: noise remover(ffmpeg arnndn) 실제 처리→cleaned WAV 생성+
success UI 레퍼런스 07 일치; silence remover(Web Audio) 무음 탐지/제거 실동작(Regions 1).
(완료)

## Out of scope (S3)

mic test/voice recorder 실마이크 스팟체크(샌드박스 권한 불가 → 사용자 실기기 확인).
converter/loudness 실파일 스팟체크(동일 검증된 ffmpeg 경로라 생략).

## Why now (S4)

디자인 충실도와 실동작 확신을 위해 상태별 UI를 레퍼런스와 맞추고 실제로 구동해 검증.

## User / consumer (S5)

크리에이터 + 검색/AI 크롤러.

## Riskiest assumption (S6)

converter/loudness/recorder-MP3도 동일 loadFFmpeg/runFFmpeg 경로라 noise와 같이 동작.

## Implementation notes

브라우저에서 생성한 실 WAV로 검증: noise remover → test_cleaned.wav(48kHz/0:03/281KB),
readouts reduced/preserved/WAV 48kHz, 실파형(무음 구간 가시)+커스텀 플레이어 정상.
silence remover → threshold -30에서 Regions 1, Removed 0:01. ffmpeg 로더/Web Audio DSP
/공유 UI 컴포넌트 실데이터로 검증됨. 마이크 도구는 사용자 실기기 스팟체크 필요.
