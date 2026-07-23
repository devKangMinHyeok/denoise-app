---
type: spec
id: 1784805814
goal: 1784428973-launch-vocast-me
related_issues: []
branch: worktree-landing-bilingual-en-ko
created: 2026-07-23
weak_dimensions: []
---

<!--
related_issues 비워둠: 열린 이슈 1784632299-i18n-remaining-untranslated-strings 는
맥 앱(Swift) 인터페이스 번역 이야기이고, 이 스펙은 랜딩(Next.js 웹사이트) 대상이라
표면이 다르다. 두 작업은 독립적이다.
-->

# landing-bilingual-en-ko

랜딩(Next.js App Router)을 영어 우선 + 한국어 지원의 이중언어 사이트로 만든다.
이번 PR은 **i18n 인프라 + SEO 배선 + 죽은 GitHub Pages 코드 제거**까지다. 한국어
마케팅/블로그 카피 자체는 이번 범위가 아니다(아래 S3). 영어 우선, 한국어는 `/ko/`.

## What changes (S1)

**A. 라우팅을 언어 세그먼트로**
- `app/[lang]/` 동적 세그먼트 도입, `generateStaticParams` → `['en','ko']`.
- 영어는 루트(`/`, 접두사 없음), 한국어는 `/ko/`. 블로그/툴도 동일 규칙
  (`/blog/`·`/tools/` = en, `/ko/blog/`·`/ko/tools/` = ko).

**B. 번역 사전 계층(신규)**
- `landing/lib/i18n/{en,ko}.ts` + `index.ts`(`getDict(lang)`), 타입드 키.
- `app/_sections/*.tsx`, `app/_sections/faq-data.ts`의 하드코딩 영어 문자열을 전부
  사전에서 읽도록 전환(섹션에 `lang` 전달).
- `ko.ts`는 **키 구조는 완비하되 값은 영어 폴백**으로 둔다(핸드오프 전까지). 기계번역 안 함.

**C. SEO/메타를 언어 인지형으로**
- `app/layout.tsx`: `<html lang>`을 라우트에서, 언어별 title/description.
- hreflang: 모든 페이지에 `alternates.languages`로 `en`/`ko`/`x-default` 출력, 자기참조 canonical.
- `og:locale` + `og:locale:alternate`(en_US ↔ ko_KR).
- `lib/site.ts`: tagline/description/keywords를 언어별로(name "Vocast"는 공통).
- `lib/schema.ts`: `inLanguage` 인자화, 로케일별 JSON-LD.
- `app/sitemap.ts`: 두 로케일(홈/블로그/툴) 모두 방출 + `alternates.languages`.

**D. 블로그**
- `Post`에 `lang` 필드 추가. `/blog`·`/blog/[slug]`가 현재 로케일로 필터. 기존 글은 en으로.

**E. 죽은 GitHub Pages 랜딩 코드 제거(랜딩만, Storybook 배포는 유지)**
- `landing/next.config.mjs`: `isPages`/`PAGES` 분기, `output:"export"`, `basePath:"/vocast"`,
  `NEXT_PUBLIC_BASE_PATH` env 제거(`transpilePackages`/`trailingSlash`/`images.unoptimized`/
  `outputFileTracingRoot`는 유지).
- `landing/lib/asset.ts`: basePath가 사라졌으므로 단순화/제거(경로 그대로 사용).
- `sitemap.ts`·`robots.ts`의 낡은 `/vocast/` 주석 정리.
- 문서 갱신: `CLAUDE.md` 규칙 2(랜딩 카피 영어 전용 → 영어+한국어 이중언어)와 규칙 4
  (basePath 함정 → 제거/단순화), `.claude/skills/landing.md`,
  `.claude/skills/review/profiles/{seo,code}.md`, `.claude/skills/review/base.md`,
  `README.md`의 github.io 랜딩 URL(라인 14). Storybook용 `.github/workflows/pages.yml`과
  그 Storybook Pages URL은 건드리지 않는다.

## Done criteria (S2)

- `cd landing && pnpm exec next build`가 `PAGES`/`basePath` env 없이 성공하고,
  `/`(en)와 `/ko/`(+ `/ko/blog/`, `/ko/tools/`) 라우트를 생성한다.
- 빌드된 `/index.html`: `<html lang="en">`, `<link rel="canonical" href="https://vocast.me/">`,
  `<link rel="alternate" hreflang="ko" href="https://vocast.me/ko/">`, `hreflang="x-default"` 존재.
- 빌드된 `/ko/index.html`: `<html lang="ko">`, canonical `https://vocast.me/ko/`, en으로의 hreflang 존재.
- `sitemap.xml`에 `https://vocast.me/` 와 `https://vocast.me/ko/` 둘 다 존재.
- `grep -rnE "PAGES|/vocast/|NEXT_PUBLIC_BASE_PATH" landing` 결과 없음(Storybook 참조는 landing 밖).
- `/ko/` 페이지가 사전 계층으로 렌더(영어 폴백 문자열 허용), 로케일 전환 시 빌드/런타임 에러 없음.

## Out of scope (S3)

- **실제 한국어 마케팅/블로그 카피 작성·번역.** 기계번역은 명시적으로 제외(사용자 표준
  지침: "임의 번역 금지"). 한국어 값은 추후 디자인 핸드오프로 채우고, 그전까지 영어 폴백.
- Storybook의 GitHub Pages 배포(`.github/workflows/pages.yml`)는 그대로 둔다.
- 맥 앱 인터페이스 번역(별도 열린 이슈 `1784632299`).

## Why now (S4)

launch-vocast-me 골 G1(사이트가 검색에 색인되어 발견 가능)을 직접 전진시킨다. 창업자와
초기 유튜브 데모 청중이 한국어권이라, 영어 전용 페이지로는 못 잡는 한국어 오가닉/AI 검색
유입을 한국어 페이지가 잡는다. **사이트가 아직 어리고 색인이 얕은 지금** 해야 하는 이유:
구글이 영어 전용 URL 표면을 색인한 뒤에 `[lang]` 라우팅 + canonical/hreflang을 소급하면
중복 콘텐츠·canonical 흔들림 위험이 있다. 죽은 Pages 코드 정리도 새 라우팅 안에서
`asset()`/basePath를 다시 다루는 낭비를 피하려면 지금 함께 하는 게 맞다.

## User / consumer (S5)

한국어로 검색하는 크리에이터(및 한국어 AI 검색 사용자) - 지금은 영어 전용 페이지에
도달해 이탈한다. 더해서 코드베이스 자체: 죽은 `PAGES`/basePath 분기를 걷어내면 이후 모든
랜딩 변경이 단순해진다.

## Riskiest assumption (S6)

한국어 발견 가능성이 카피 두 벌 유지 비용을 정당화한다는 것. 만약 한국어 검색/AI 유입이
끝내 발생하지 않으면(청중이 영어로 충분하면) `/ko/` 표면은 사표가 되고 카피 유지비만 2배가
된다. 반증 가능: 색인 후 GSC에서 `/ko/` 페이지 노출/클릭이 ~0.

## Implementation notes

머지: PR #2 (squash) → `origin/main` `54eaf073`. 브랜치 `worktree-landing-bilingual-en-ko`.

### 구현된 것
- **라우트 그룹 2개**: `app/(en)/`(루트) + `app/(ko)/ko/`, 각자 루트 레이아웃(`app/layout.tsx`
  제거). 이 구조 덕에 `<html lang>`이 로케일별로 정확히 나온다(정적/SSG 에서 기본 로케일을
  접두 없이 서빙하려면 next 기본 i18n 옵션이 안 맞아 라우트 그룹이 정답이었다).
- 본문 공유: `app/_pages/HomeBody.tsx`, `app/blog/_index-body.tsx`·`_post-body.tsx`,
  `app/tools/_index-body.tsx`·`_slug-body.tsx`. 라우트 파일은 `lang`만 바꾸는 얇은 껍데기.
- 사전 계층 `lib/i18n/{en,ko,index}.ts`. `getDict(lang)`. 네비 `LangSwitch`(EN/KO 토글).
- SEO: `lib/metadata.ts`(`rootMetadata`/`pageMetadata`)가 canonical + hreflang(en/ko/x-default)
  + og:locale(+alternate) 생성. `lib/schema.ts` JSON-LD 는 lang 인자로 inLanguage/url. sitemap
  두 로케일 + xhtml:link alternates.
- `lib/site.ts` 로케일 헬퍼: `localePath`/`absLocale`/`hreflangMap`/`localeMeta`.
- 죽은 Pages 코드 제거: `PAGES`/`basePath:/vocast`/`output:export`/`NEXT_PUBLIC_BASE_PATH`.
  `asset()`는 항등 헬퍼로 축소. 문서(CLAUDE.md 2·4·7, landing 스킬, review 프로필, README) 갱신.

### 스펙과의 차이 / 의도적으로 남긴 것
- **블로그/툴은 `/ko/`로 미러하되 본문 프로세는 영어 폴백**. 네비/내부 링크/JSON-LD/hreflang만
  로케일 정확. 본문 번역은 후속(스펙 S3의 "번역 나중" 원칙 안).
- **한국어 카피 = 영어 폴백**(`ko.ts` = en, `site.ts`의 ko 메타 = en + ko_KR/htmlLang). 임의
  기계번역 안 함(표준 지침).
- **데코용 목업 마이크로카피**(가짜 파일명, `ETA 40s`, `18,240/20,000 chars`, MCP 툴 이름/설명,
  waveform 라벨 등)는 번역 대상이 아니라 사전에 넣지 않고 인라인 유지.
- **한국어 `llms.txt`는 이번 범위 밖**(영어 유지). 후속.
- Breadcrumb의 "Home" 링크가 기존엔 `/tools/`를 가리키던 사소한 버그를 로케일화하며 홈으로 교정.

### 검증
- `cd landing && pnpm exec next build` → 35 페이지(en+ko). 프리렌더 HTML에서 `/`=lang en +
  canonical `vocast.me/` + hreflang + og:locale en_US, `/ko/`=lang ko + `vocast.me/ko/` + ko_KR 확인.
  sitemap 31 URL + 60 alternates. `grep PAGES|/vocast/|NEXT_PUBLIC_BASE_PATH landing` → 코드 0.

### 후속 (별도 스펙/이슈로)
- `ko.ts` + `site.ts` ko 메타를 실제 한국어로(디자인 핸드오프). 블로그/툴 본문 한국어화. 한국어 `llms.txt`.
- Storybook의 GitHub Pages 배포(`.github/workflows/pages.yml`)는 의도적으로 유지(범위 밖).
