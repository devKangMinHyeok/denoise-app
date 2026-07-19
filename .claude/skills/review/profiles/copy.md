# Copy Review Profile

랜딩/블로그 카피의 톤과 정확성을 본다. Vocast는 영어, 절제된 사실 기반 톤.

## 파일 필터
- `landing/app/**/*.tsx` (카피/콘텐츠)
- `landing/app/blog/_data.tsx`
- `landing/app/_sections/faq-data.ts`
- `landing/public/llms.txt`

## 체크리스트

### 스타일 규칙
- [ ] **긴 대시 구분자(U+2014/U+2015) 금지**를 지키는가? 쉼표/콜론/마침표/괄호로 대체되었는가?
- [ ] 영어, **sentence case**인가? (Title Case 남발 금지)
- [ ] **느낌표와 이모지가 없는가?**
- [ ] 마케팅 과장("revolutionary", "the best") 대신 사실/수치로 말하는가?

### 정확성/일관성
- [ ] 제품 사실이 정확한가? (예: $49 one-time, Apple Silicon macOS 12+, 20,000자, ~4x realtime,
      SIM 0.917~0.945, 인간 기준선 ~0.909, CER 0%, MOS 3.50) 서로 모순 없는가?
- [ ] 용어가 일관적인가? (Vocast, on-device, one-time, voice cloning, prosody, MCP)
- [ ] **GitHub/오픈소스 언급이 없는가?** (private 전환 예정)

### 명료성
- [ ] CTA가 명확한가? (Buy, Read the methodology 등)
- [ ] 문장이 짧고 스캔 가능한가? 한 문단에 한 아이디어인가?
- [ ] 블로그: 첫 문장이 독립적으로 읽히는 정의/요약인가? 수치가 본문에 녹아 있는가?

## 심각도 가이드
- Critical: 긴 대시/느낌표/이모지 사용, 사실 오류, GitHub 노출
- Warning: 톤 이탈(과장), 용어 불일치, Title Case
- Suggestion: 문장 다듬기, 리듬/간결성
