---
name: timbre-design
description: Timbre 디자인 시스템(@timbre/design-system) 사용 규칙. 토큰, 컬러 규율, 컴포넌트 패턴, 다크 전용 UI. 랜딩/블로그 UI 작성 시 참조.
---

# Timbre Design 스킬

`packages/design-system`(`@timbre/design-system`) 위에서 UI를 만들 때의 규칙. 목표는
Linear/Vercel 수준의 절제된 다크 UI.

## 언제 쓰나
- 랜딩/블로그 컴포넌트, 섹션 UI 작성/수정
- DS 컴포넌트 추가/수정, Storybook 스토리 작성

## 토큰 (색은 반드시 여기서)

`--rc-*` CSS 변수로만 색/타입/여백/라운드를 가져온다. 하드코딩 금지.

- 배경: canvas `#07080a`, surface `#0d0d0d`, elevated `#101111`, card `#121212`
- 라인: hairline `#242728`
- 텍스트: ink `#f4f4f6`, body `#cdcdcd`, mute `#9c9c9d`, ash `#6a6b6c`, stone `#434345`
- 브랜드 오렌지: `--rc-ray` `#f5732b`, 그라디언트 `#ff9448` → `#e0561c`
- 라운드: xs4 / sm6 / md8 / lg10 / xl16 / full
- 폰트: Inter(ss03) + JetBrains Mono. `fontFeatureSettings: '"calt","kern","liga","ss03"'`

## 컬러/스타일 규율 (엄수)

1. **다크 전용.** 라이트 팔레트 유출 금지.
2. **카드/패널 = hairline 보더 1px, 그림자 없음.** `box-shadow` 쓰지 않는다.
3. **버튼 채움색은 흰색만.** 주요 CTA는 흰 배경 + 어두운 글자.
4. **오렌지는 액센트에만.** 워드마크 마침표, 강조 단어, 지표 마크. 본문/보더/배경 전반에 오렌지
   남발 금지.
5. 새 색/폰트/간격을 임의로 도입하지 않는다. 필요하면 먼저 토큰을 논의한다.

## 컴포넌트 패턴

- DS 컴포넌트: `Logo`, `Button`(variant primary/tertiary, `as={Link}` 지원), `SectionHeading`,
  `GradientText`, `InlineLink`, `PillTab`, `CategoryTag`, `Avatar`, `BlogCard`, `Prose` 등.
- `Prose`: 긴 글 타이포. `Prose.Heading`(id로 앵커), `Prose.Figure`(src 또는 pair+images,
  caption). 링크/코드는 오렌지(#ff9448).
- 인라인 스타일 + 토큰 조합이 기본. 이벤트 핸들러/상태가 있으면 파일 상단에 `"use client"`.

## 반응형
- `clamp()`, `grid auto-fit minmax`, `flex-wrap` 위주. JS 브레이크포인트는 Nav(900px)만 사용.
- 넓은 콘텐츠(표/코드/피규어)는 `overflow-x:auto` 컨테이너에 가둬 본문 가로 스크롤을 막는다.

## 주의
- 카피는 영어 sentence case, 느낌표/이모지 금지, 긴 대시(U+2014) 금지. (루트 `CLAUDE.md`)
- 사람 얼굴/외부 스톡 이미지를 주 비주얼로 쓰지 않는다. 제품 UI/추상 비주얼 우선.
