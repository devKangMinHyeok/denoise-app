---
name: landing
description: Vocast 랜딩/블로그(Next.js App Router 정적 export, GitHub Pages) 구조와 라우팅, basePath 규칙, SEO 배선. 랜딩 페이지 작업 시 참조.
---

# Landing 스킬

`landing/`은 Next.js(App Router) 마케팅 랜딩 + 블로그. 정적 export로 GitHub Pages
(`/vocast/`)에 배포된다. UI 규칙은 `/timbre-design` 참조.

## 언제 쓰나
- 랜딩 섹션/블로그 추가·수정, 라우팅·링크 작업, SEO/메타 배선

## 구조

```
landing/
  app/
    layout.tsx          # 전역 메타(title 템플릿, canonical, OG, twitter, robots, JSON-LD icons)
    page.tsx            # 홈. 섹션 조합 + 홈 JSON-LD
    sitemap.ts          # /vocast/sitemap.xml (홈/블로그/데모/포스트)
    robots.ts           # /vocast/robots.txt (전체 허용 + AI 크롤러)
    _sections/          # Hero, Problem, Features, Quality, LocalFirst, Mcp, Pricing, Faq, FinalCta, Nav, Footer
    _sections/faq-data.ts   # FAQ 단일 소스 (UI + FAQPage JSON-LD 공유)
    _seo/JsonLd.tsx     # <script type="application/ld+json"> 헬퍼
    blog/
      page.tsx          # 목록: BlogHeader + FeaturedPost + BlogList
      [slug]/page.tsx   # 상세: ArticleHeader + HeroCover + Prose + AuthorCard + Article JSON-LD
      _data.tsx         # 글 데이터(POSTS, 저자, 카테고리, 본문 FC)
      _components.tsx    # 블로그 서버 컴포넌트
      BlogList.tsx      # 카테고리 필터 + 카드 그리드 (client)
  lib/
    asset.ts            # asset(path): basePath 접두
    site.ts             # 사이트 전역 SEO 상수 (단일 소스)
    schema.ts           # JSON-LD 빌더
  public/
    og.png              # 1200x630 OG 이미지
    llms.txt            # GEO용 요약
    blog/               # 커버/피규어/아바타 이미지
    demo/               # 브라우저 노이즈제거 데모(정적)
```

## basePath 규칙 (필독, 404의 주범)
- `output:"export"` + `basePath:"/vocast"`는 `PAGES=1`일 때만 켜진다.
- **`next/link`는 basePath를 자동으로 붙인다.** `<Link href={asset(...)}>`로 쓰면
  `/vocast/vocast/...`가 되어 404. `next/link`에는 깨끗한 경로(`/blog/slug/`)를 준다.
- 일반 `<a>`, `<img>`, CSS `url()`, DS의 `BlogCard href`(내부적으로 `<a>`)에는 `asset()`을 쓴다.
- 절대 URL(메타/사이트맵/OG)은 `lib/site.ts`의 `abs()` / `absFromAsset()`로 만든다.

## 새 블로그 글 추가 절차
1. `app/blog/_data.tsx`의 `POSTS`에 항목 추가(slug, 카테고리, 커버, 저자, 본문 FC).
2. 커버/피규어 이미지를 `public/blog/`에 넣고 `asset()`으로 참조.
3. `public/llms.txt`의 Blog 섹션에 링크 추가.
4. 빌드로 사이트맵/JSON-LD/canonical 자동 반영 확인.

## SEO 배선
- 전역 상수: `lib/site.ts` (URL/설명/OG/가격/키워드/GSC 토큰). 하드코딩 대신 이걸 통한다.
- 페이지별 `metadata`/`generateMetadata`에 canonical + OG를 준다.
- 구조화 데이터는 `lib/schema.ts` 빌더 + `<JsonLd>`. 감사는 `/review seo`, `/review geo`.
- Google Search Console 소유확인은 `site.ts`의 `googleSiteVerification`에 토큰을 넣으면 자동 출력.

## 규칙
- **GitHub/오픈소스 노출 금지**(private 전환 예정). 방법론 링크는 내부 블로그로.
- 카피: 영어 sentence case, 느낌표/이모지/긴 대시(U+2014) 금지.
- 핸드오프에 없는 섹션/카피를 임의 추가하기 전에 확인받는다.

## 검증
```bash
cd landing && PAGES=1 pnpm exec next build   # 정적 export 빌드 (라우트/사이트맵/메타 확인)
```
로컬 미리보기는 `out/`를 정적 서버로 띄워 `/vocast/` 경로로 연다.
