---
name: review
description: 변경분을 전문가 관점(code/design/copy/seo/geo)으로 리뷰한다. 인자가 없으면 변경 파일로 프로필을 자동 감지.
argument-hint: '[code|design|copy|seo|geo|all] [파일경로]'
---

# review

변경된 코드/콘텐츠를 **전문가 관점**으로 리뷰한다. Vocast 랜딩/DS에 맞춘 5개 프로필만 둔다.

## 사용법

```
/review           → 변경 파일 분석 후 해당 프로필 자동 선택
/review seo       → SEO 감사만
/review geo       → GEO(AI 검색 최적화) 감사만
/review code      → 코드 품질 리뷰만
/review design    → UI/디자인 리뷰만
/review copy      → 마케팅 카피 리뷰만
/review all       → 5개 프로필 전부
/review code path → 특정 파일 코드 리뷰
```

## 실행 흐름

1. **파일 수집**: `.claude/skills/review/base.md`의 수집 로직을 따른다.
2. **프로필 결정**: 인자가 프로필명이면 그것, 파일 경로면 확장자/경로로 판단, 없으면 아래
   매핑으로 자동 선택.

   | 파일 패턴 | 프로필 |
   |-----------|--------|
   | `landing/**/*.{ts,tsx}`(로직), `packages/**/src/**/*.{ts,tsx}` | code |
   | `landing/app/**/*.tsx`(UI), `packages/design-system/src/**/*.tsx` | design |
   | `landing/app/**/*.tsx`(카피), `landing/app/blog/_data.tsx`, `landing/app/_sections/faq-data.ts` | copy |
   | `landing/app/sitemap.ts`, `landing/app/robots.ts`, `landing/app/layout.tsx`, `landing/lib/site.ts`, `landing/lib/schema.ts`, `landing/app/**/page.tsx` | seo |
   | `landing/public/llms.txt`, `landing/app/_sections/**`, `landing/app/blog/_data.tsx` | geo |

3. **리뷰 수행**: 각 프로필(`profiles/<name>.md`)의 체크리스트로 검토하고, base.md의 출력
   포맷으로 결과를 낸다. SEO/GEO는 카테고리별 점수 요약 + P0/P1/P2 액션 플랜을 추가한다.

## 프로필

- `profiles/code.md`: 코드 정확성, 정적 export 안전성, 타입, 데드코드
- `profiles/design.md`: Timbre DS UI 규율(다크/hairline/버튼/오렌지/반응형)
- `profiles/copy.md`: 영어 sentence case, 사실 기반, 용어 일관성
- `profiles/seo.md`: Technical + On-Page SEO, 구조화 데이터 (영어 사이트)
- `profiles/geo.md`: AI 검색 인용 최적화
