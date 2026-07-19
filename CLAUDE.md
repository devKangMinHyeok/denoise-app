# Vocast (denoise-app)

로컬 온디바이스 맥 음성 스튜디오. 보이스 클로닝 + 노이즈 제거. 제품명은 **Vocast**
(로컬 폴더명은 `denoise-app`, GitHub 저장소는 `vocast`). 1인 개발 + 유튜브 데모 맥락이라
**코딩 초보자 관점으로 쉽게 설명**하고, 되돌리기 어려운 큰 변경 전에는 계획을 먼저 보여주고
확인받는다. 말로만 "다 했다"가 아니라 실제로 빌드/실행해 결과를 보여준다.

## 저장소 구성 (pnpm workspace + Python)

| 경로 | 내용 |
|------|------|
| `landing/` | Next.js(App Router) 마케팅 랜딩 + 블로그. 정적 export → GitHub Pages |
| `packages/design-system/` | `@timbre/design-system` (Timbre DS). React + TS, `--rc-*` CSS 토큰, Storybook |
| `packages/voxa/` | 파이썬 음성 엔진 (media/denoise/clone/analysis) |
| `app/` | 로컬 앱(파이썬 CLI/웹) + 맥 앱 |
| `packaging/` | 맥 앱/번들 빌드 |
| `docs/` | 품질 방법론 등 문서 |
| `.github/workflows/` | `ci.yml`(유닛), `quality.yml`(품질 게이트), `pages.yml`(랜딩 + Storybook 배포) |

- 패키지 매니저: **pnpm 10.22.0**. JS 워크스페이스는 `landing` + `packages/design-system`.
  (voxa는 파이썬이라 JS 워크스페이스에 없음.)
- 배포: `main` 푸시 → `pages.yml`이 `PAGES=1`로 landing 정적 빌드 →
  `https://devkangminhyeok.github.io/vocast/` (basePath `/vocast`).

## 표준 규칙 (반드시 지킬 것)

1. **긴 대시 구분자 금지**: 유니코드 U+2014(em dash)와 U+2015를 응답과 생성 콘텐츠/코드/예제
   어디에도 쓰지 않는다. 쉼표/콜론/마침표/괄호로 바꾸거나 문장을 다시 쓴다.
   (자동 차단 훅: `.claude/hooks/guard-no-emdash.py`, Write/Edit/MultiEdit에서 deny.)
2. **랜딩 카피**: 영어, sentence case. 느낌표와 이모지 금지. 마케팅 과장 대신 사실과 수치.
   용어 일관성(Vocast, on-device, one-time, voice cloning).
3. **디자인(Timbre DS)**: 색/타입/여백/라운드는 DS 토큰(`--rc-*`)에서만 가져온다. 다크 전용.
   카드는 hairline 보더 + 그림자 없음. 버튼 채움색은 흰색만. 브랜드 오렌지(#f5732b)는 워드마크
   마침표, 강조 단어, 지표 마크에만. 새 색/폰트/간격을 도입하지 않는다. 자세히는 `/timbre-design`.
4. **정적 export / basePath 함정**:
   - 공개 파일/라우트의 절대경로는 `landing/lib/asset.ts`의 `asset()`으로 basePath를 붙인다.
   - **`next/link`는 basePath를 자동으로 붙인다.** `<Link href={asset(...)}>`로 쓰면
     `/vocast/vocast/...`가 되어 404가 난다. `next/link`에는 깨끗한 경로(`/blog/slug/`)를 준다.
   - 일반 `<a>`, `<img>`, CSS `url()`에는 `asset()`을 쓴다.
   - Server Component 기본. 이벤트 핸들러/상태가 필요한 컴포넌트만 `"use client"`.
5. **GitHub 노출 금지**: 유료 출시 후 저장소를 private로 전환 예정. 랜딩/블로그/구조화 데이터에
   GitHub 링크나 "오픈소스" 문구를 넣지 않는다.
6. **작업 흐름**: landing 변경 시 `cd landing && PAGES=1 pnpm exec next build`로 검증한 뒤
   커밋한다. **커밋/푸시는 사용자가 요청할 때만.** main에서 작업 중이면 상관없지만 커밋 메시지
   끝에는 `Co-Authored-By` 라인을 남긴다.
7. **SEO 단일 소스**: 사이트 전역 메타 상수는 `landing/lib/site.ts`. sitemap/robots/layout 메타/
   JSON-LD(`lib/schema.ts`)가 모두 이걸 참조한다. 블로그 글을 추가/수정하면
   `landing/public/llms.txt`도 갱신한다. 감사는 `/review seo`, `/review geo`.

## 작업 → 스킬 매핑

| 작업 | 스킬 |
|------|------|
| 변경분 전문가 리뷰 | `/review [code\|design\|copy\|seo\|geo]` |
| 랜딩 구조/섹션/라우팅/블로그 | `/landing` |
| Timbre DS 컴포넌트/토큰/스타일 | `/timbre-design` |
| SEO 메타/구조화 데이터/사이트맵 | `/review seo` (+ `landing/lib/site.ts`) |
| AI 검색(GEO) 최적화 | `/review geo` (+ `landing/public/llms.txt`) |

스킬은 `.claude/skills/`에 있다.
