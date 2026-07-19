# Design Review Profile

Timbre DS 위에서 UI가 디자인 규율을 지키는지 본다. 기준: Linear/Vercel 수준의 절제된 다크 UI.

## 파일 필터
- `landing/app/**/*.tsx` (UI)
- `packages/design-system/src/**/*.tsx`

## 체크리스트

### 토큰 규율 (핵심)
- [ ] 색/타입/여백/라운드를 DS 토큰(`--rc-*`)에서만 가져오는가? 하드코딩 hex/px 남발 금지.
- [ ] 새 색/폰트/간격을 임의로 도입하지 않았는가?
- [ ] 다크 전용 팔레트를 유지하는가? (canvas #07080a, surface, hairline #242728 등)

### 카드/보더/그림자
- [ ] 카드/패널은 hairline 보더(1px `--rc-hairline`)만 쓰고 **그림자(box-shadow)가 없는가?**
- [ ] 라운드는 토큰(xs4/sm6/md8/lg10/xl16/full) 범위인가?

### 색 사용
- [ ] 버튼 **채움색은 흰색만** 쓰는가? (주요 CTA)
- [ ] 브랜드 오렌지(#f5732b)는 워드마크 마침표, 강조 단어, 지표 마크에만 절제해 쓰는가?
      (본문/보더/배경 전반에 오렌지 남발 금지)

### 타이포/레이아웃
- [ ] Inter(ss03) + JetBrains Mono, `fontFeatureSettings` 일관 적용?
- [ ] 반응형은 `clamp()` / `auto-fit` / `flex-wrap` 위주인가? JS 브레이크포인트는 Nav(900px)만.
- [ ] 넘치는 콘텐츠(표/코드/다이어그램)가 가로 스크롤 컨테이너 안에 갇히는가?

### 접근성
- [ ] 이미지에 의미 있는 `alt`(장식은 빈 alt)?
- [ ] 대비/포커스 상태가 충분한가? 인터랙티브 요소가 버튼/링크 시맨틱인가?

## 심각도 가이드
- Critical: 토큰 무시한 임의 색/그림자 도입, 라이트모드 유출
- Warning: 오렌지 남용, 반응형 깨짐, alt 누락
- Suggestion: 미세 여백/정렬/상태 다듬기
