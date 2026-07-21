---
type: issue
id: 1784632299
created: 2026-07-21
goal: 1784428973
---

# i18n-remaining-untranslated-strings

인터페이스 언어를 한국어로 두면, 디자인 핸드오프(`i18n-strings.md`, 99키)에는 없었던
2차 문자열들이 아직 영어로 노출된다. 핸드오프 키는 전부 배선 완료(하드코딩 0). 남은 것은
핸드오프에 키 자체가 없어서 번역 소스가 없는 문자열들이다.

## What (증상)

인터페이스 = 한국어일 때 아래가 영어로 남아 있다. 정확한 영어 원문 + 제안 키는 census 문서에
정리돼 있다: `/Users/minhyeok/Downloads/design_handoff_i18n/REMAINING_AFTER_HANDOFF.md`

주요 그룹:
- **토스트/진행 단계 메시지 전부** (예: "Voice profile ready.", "Generating speech",
  "Could not reach the local engine. Is it running?") — AppModel의 `complete(...)`·스테이지 라벨
- **앱 메뉴바** (New narration, Render, Settings, Import audio to clean 등) — VocastApp.swift
- **온보딩 모델 화면**: "Voice models ready" / "Download the voice models" 헤딩, "3.3 GB on this Mac",
  모델 행 이름(Voice model (fast) 등) — 실제로 화면에서 영어로 확인됨
- **작업 상세 인스펙터**: Type/Target/Profile/Elapsed 라벨, 빈 상태 문구
- **스코어카드 미달 사유** ("Needs attention: …", "prosody below the 82 quality bar" 등)
- **잡음 제거 결과 부가설명** 3줄, 실시간 배속 라벨("~21x slower than realtime")
- **보이스**: "· 3 clips" 조각, "Recording/Captured/Ready to record", "Current/Earlier version" 등
- **설정**: 모델 상태 "installed", "Running · localhost only", "Disabled", 개인정보 행 부가설명

## When (조건)

- 재현 조건: 설정 → 언어에서 인터페이스 언어를 한국어로 두고 각 화면을 열면 재현.
- 항상 재현(랜덤 아님). 핸드오프 키로 배선된 문자열은 정상 한국어로 나온다.

## Reproduction (재현)

1. 베타 실행 → 설정 → 언어 → 인터페이스 언어 "한국어".
2. 온보딩(모델 화면), 작업 상세, 스튜디오 상단 프로필 칩, 설정 개인정보/모델 탭, 토스트가
   뜨는 동작(낭독/정리 완료 등)을 확인.
3. 위 그룹의 문자열이 영어로 표시됨.

## Impact (영향)

- 심각도: 낮음~중간. 기능 결함은 아니고, 데모/출시 시 한국어 UI의 완성도(잔여 영어) 문제.
- launch-vocast-me 골의 제품 완성도에 걸린다(치명적 관문은 아님).

## 처리 방향 (참고)

핸드오프 방식 유지: census(`REMAINING_AFTER_HANDOFF.md`)의 한국어 칸을 디자인 에이전트가
채워 오면, 기존과 동일하게 `Strings.swift`에 키 추가 + 각 뷰를 키에 배선(하드코딩 없음).
그러면 "잔여 영어 0(고유명사·오디오 단위·내부 보드 3종 제외)" 기준을 충족한다.

임의 번역은 하지 않기로 함(사용자 지시). 이 이슈는 디자인 에이전트 왕복 후 처리 예정.
