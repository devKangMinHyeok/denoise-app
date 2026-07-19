---
type: spec
id: 1784428974
goal: 1784428973-launch-vocast-me
related_issues: []
branch: feat/1784428974
created: 2026-07-19
weak_dimensions: []
---

# point-vocast-me-dns

## What changes (S1)

가비아 DNS에 vocast.me A 레코드(`@` -> 216.198.79.1)를 설정하고, Vercel 프로젝트
(vocast-landing)에서 vocast.me 도메인 검증과 SSL 발급을 완료해 https://vocast.me 가 프로덕션
배포를 서빙하게 한다. 코드 변경이 아니라 DNS/도메인 설정 작업이다. (site.ts의 canonical/OG/
sitemap/robots는 이미 vocast.me 기준으로 반영·배포됨.)

## Done criteria (S2)

- `dig +short vocast.me A` 가 216.198.79.1 (또는 Vercel 대체 IP)
- Vercel 도메인 화면에서 vocast.me = "Valid Configuration"
- `curl -sI https://vocast.me/` 가 200 + 유효 인증서로 Vocast 랜딩을 서빙
- 블로그 글 URL(예: https://vocast.me/blog/natural-voice-you-can-publish/)도 200

## Out of scope (S3)

www.vocast.me 서브도메인, Google Search Console 속성 등록/사이트맵 제출, 기존 github.io 속성
정리, 결제/체크아웃. 각각 별도 작업/Spec으로 뺀다.

## Why now (S4)

정식 사이트 전환(canonical=vocast.me)은 이미 배포됨. 도메인이 안 붙으면 canonical이 아직 살아
있지 않은 주소를 가리켜 중복/미인덱싱 상태로 방치된다. 새 도메인은 DNS 전파에 시간이 걸리므로
빨리 시작할수록 좋다. 현재 상태: 도메인은 구매했으나 아직 DNS에 미전파(NXDOMAIN), A 레코드
미설정.

## User / consumer (S5)

예비 사용자(크리에이터)와 검색/AI 크롤러, 그리고 코드베이스 자체(정식 도메인 확립).

## Riskiest assumption (S6)

가비아 DNS에 A 레코드를 넣고 전파되기만 하면 Vercel 검증과 SSL 발급이 문제없이 완료된다.
(레지스트라 네임서버 설정, 전파 지연, CAA 레코드 같은 걸림돌이 없다는 전제.)

## Implementation notes

<!-- 완료 시 작성 (done/ 또는 canceled/로 이동할 때). 비워둔다. -->
