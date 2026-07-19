# GEO (Generative Engine Optimization) Profile

AI 검색(ChatGPT, Perplexity, Gemini, Claude)이 Vocast를 답변에 인용/추천할 확률을 높이는
관점으로 감사한다. SEO 기반 위에서 동작한다.

**핵심 질문**: "사용자가 'local voice cloning for Mac', 'on-device AI narration' 등을 AI에
물었을 때 Vocast가 답변에 포함되는가?"

## 파일 필터
- `landing/public/llms.txt`
- `landing/app/_sections/**/*.tsx`
- `landing/app/blog/_data.tsx`
- `landing/lib/schema.ts`, `landing/lib/site.ts`

## 체크리스트 (Princeton GEO 전략 반영)

### A. AI 크롤러 접근성
- [ ] `robots.ts`에 GPTBot, ChatGPT-User, OAI-SearchBot, Google-Extended, ClaudeBot, Claude-Web,
      PerplexityBot 등이 명시 허용인가?
- [ ] `public/llms.txt`가 존재하고 최신인가? (H1 제목, blockquote 요약, H2 섹션, 링크+설명)
- [ ] 블로그 글을 추가/수정하면 llms.txt에 반영되는가?
- [ ] 정적 export로 모든 콘텐츠가 JS 없이 정적 HTML로 제공되는가?

### B. 정의문과 Quick Answer
- [ ] 홈/FAQ에 "Vocast is ..." 형태의 한 문장 정의가 있는가?
- [ ] 정의에 핵심 팩트(가격, 플랫폼, 핵심 기능, 차별점)가 담겨 있는가?
- [ ] 블로그 각 글의 첫 문단이 독립적으로 인용 가능한 요약인가?

### C. 통계/수치 (가장 효과적)
- [ ] 콘텐츠에 구체적 수치가 factual하게 있는가? (가격 $49, ~4x realtime, 20,000자,
      SIM 0.917~0.945, 인간 기준선 ~0.909, CER 0%, MOS 3.50, ~90초 프로필)
- [ ] 마케팅 톤이 아니라 사실 어조인가?

### D. 객관성/균형
- [ ] 과장 없이 사실 기반 서술인가? 한계도 정직히 적는가? (예: Apple Silicon 전용)

### E. 구조화 데이터 (AI 인용용)
- [ ] FAQPage가 실제 질문 형태와 매칭되는가?
- [ ] SoftwareApplication에 가격/OS/카테고리가 완전한가?
- [ ] 저자 Person에 `jobTitle`(예: Voice AI Engineer) 등 E-E-A-T 신호가 있는가?

### F. 콘텐츠 구조
- [ ] 블로그 H2/H3이 질문/주제 단위로 독립적인가? (75~300단어 청크)
- [ ] 표/리스트/코드 등 구조화 형식으로 정보가 제공되는가?
- [ ] 핵심 정보가 문단 첫 문장에 오는가?

### G. 신선도
- [ ] 블로그에 발행일이 있고 JSON-LD `datePublished`/`dateModified`가 있는가?

## 요약 출력
카테고리별 점수 + P0/P1/P2 액션 플랜.

## 주의
- 과최적화(키워드 스터핑, 인위적 통계)는 신뢰도를 낮춘다. 사실만.
- 경쟁사 비교(`/vs/*`)나 용어사전이 아직 없으므로 롱테일 확장은 향후 과제로 표시.
