# @timbre/design-system

Timbre 웹 디자인 시스템 — **다크 캔버스 · 헤어라인(그림자 없음) · 단일 화이트 CTA ·
Inter `ss03`**. Vocast 랜딩(그리고 다른 웹 표면)이 이 위에서 만들어진다.

`/Users/minhyeok/Downloads/design_handoff_timbre_design_system` 핸드오프를 기반으로
셋업했다. 토큰(`--rc-*`)과 컴포넌트 계약을 그대로 따른다.

## 구조

```
src/
├── styles.css        글로벌 엔트리 (한 번만 import) — 폰트 + 토큰 + body 기본값
├── tokens/*.css      --rc-* 커스텀 프로퍼티 (colors·typography·spacing·animations·base·shadcn-dark)
├── fonts/*.woff2     self-hosted Inter Variable + JetBrains Mono
├── assets/*.svg      로고·파비콘
├── components/
│   ├── shared/       Button·Badge·PillTab·GradientText·InlineLink·InstallButton·InstallCommand·Logo
│   └── marketing/    FeatureCard·SectionHeading·PromoCard·TakeoffCTA
└── index.ts          공개 배럴 export
```

surface 경계: **shared**(랜딩·앱 공용) / **marketing**(랜딩 전용). 제품 `Ui*`/voice
레이어는 범위 밖 — 나중에 별도 `@timbre/ui` 패키지로.

## 사용

```tsx
import "@timbre/design-system/styles.css";   // 토큰·폰트 (한 번만)
import { Button, SectionHeading, FeatureCard } from "@timbre/design-system";
```

컴포넌트는 **inline style + CSS 변수**만 쓴다 (런타임 의존성 0). 값은 항상
`var(--rc-*)` 토큰을 참조하고 hex/px를 하드코딩하지 않는다.

### 불변 규칙 (핸드오프 spec)
- 그림자 금지 — 깊이는 surface 사다리(`--rc-canvas`→`--rc-surface`→`elevated`→`card`)로.
- 다크 전용. 라이트 테마 없음.
- 화이트(`--rc-primary`)는 유일한 주 액션색. fold당 화이트 pill 하나.
- 채도 높은 accent(노랑/빨강/초록/파랑)는 일러스트 전용 — chrome/텍스트/버튼 금지.
- 브랜드 오렌지 `#f5732b`는 로고 마크 + 히어로 스트라이프에만.
- `font-feature-settings: "calt","kern","liga","ss03"` 전역 (ss03이 시그니처).

## Storybook

```bash
npm install
npm run storybook        # 로컬 개발 (http://localhost:6006)
npm run build-storybook  # 정적 빌드 → storybook-static/
npm run typecheck        # tsc --noEmit
```

main 브랜치에 푸시되면 `.github/workflows/pages.yml`이 Storybook을 빌드해
**https://devkangminhyeok.github.io/vocast/storybook/** 로 배포한다 (랜딩은 `/`).

## 컴포넌트 더 추가하기

핸드오프에는 shared+marketing 42개가 있고 지금은 파운데이션 12개를 포팅했다.
더 필요하면 (랜딩 디자인이 요구하는 것부터) 같은 패턴으로:

1. `design_handoff.../source/components/**/<Name>.jsx`(동작) + `.d.ts`(계약) +
   `.prompt.md`(의도)를 읽는다.
2. `src/components/{shared|marketing}/<Name>.tsx`로 포팅 (inline style + `var(--rc-*)`).
   상태/핸들러가 있으면 파일 맨 위에 `"use client"`.
3. `src/index.ts`에 export 추가 + `<Name>.stories.tsx` 작성.
4. `npm run typecheck && npm run build-storybook`로 확인.

랜딩에서 쓰는 13개 세트: PrimaryNav · RayBurst · Button · CommandPalette · CommandRow ·
SectionHeading · GradientShowcase · FeatureCard · InlineLink · TakeoffCTA · PromoCard ·
NewsletterSignup · FooterSection (아직 미포팅: PrimaryNav·RayBurst·CommandPalette·
CommandRow·GradientShowcase·NewsletterSignup·FooterSection).
