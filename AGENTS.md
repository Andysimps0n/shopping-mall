# AGENTS.md — AnnChloe / 앤클로이 mall

이 파일을 **작업 시작 전**에 읽고, 코드 전체를 무작정 훑지 마세요.
브랜드·톤·금지 사항은 `design/BRAND.md`, 비주얼 토큰은 `design/DESIGN-apple.md`가 기준입니다.

## 프로젝트 한 줄
살롱에서 출발한 천연 뷰티 브랜드 **앤클로이(AnnChloe)** 의 스토어프론트.
모노레포: `frontend/`(Next.js 15 App Router) + `backend/`(Prisma 7 + PostgreSQL) + `design/`(가이드·브랜드 이미지).

## 디렉터리 규칙 (중요)
- **UI·페이지·컴포넌트·정적 자산:** `frontend/` 만 수정
- **DB 스키마·Prisma 클라이언트:** `backend/` 만 수정
- **브랜드/디자인 가이드·레퍼런스 이미지:** `design/`
- 루트에 예전 flat Next 앱 파일이 남아 있으면 **쓰지 말고** `frontend/` 기준으로 작업
- `node_modules/`, `.next/`, `backend/generated/`, `backend/.env` 는 읽거나 커밋하지 말 것

## 데이터·카피 Single Source of Truth
| 내용 | 파일 |
|------|------|
| 브랜드 페이지 카피 | `frontend/components/BrandStory.jsx` (JSX에 직접 작성) |
| 홈·푸터·로그인 등 공통 브랜드 문구·6無·회사 정보 | `frontend/lib/brand.js` |
| 제품 카탈로그(이름·가격·이미지·스토리) | `frontend/lib/products.js` |
| 리뷰 | `frontend/lib/reviews.js` |
| PDP 배너 | `frontend/lib/productBanners.js` |
| 장바구니 로직 | `frontend/lib/cart.js` |
| DB 모델 | `backend/prisma/schema.prisma` |
| 브랜드 보이스·클레임 규칙 | `design/BRAND.md` |
| 색·타이포·레이아웃 토큰 | `design/DESIGN-apple.md` |
| 제품 포스터(인쇄·마케팅) | `design/POSTER.md` |

카피/제품명을 바꿀 때는 해당 SSOT를 고치세요. 브랜드 페이지 문장은 `BrandStory.jsx`에서, 제품명은 `products.js`에서 고칩니다.
PDF·추출본에 없는 **의료·효능 수치·보장**을 새로 만들지 마세요. (`brand.js` 주석과 동일)

## 라우트 (frontend)
- `/` — 히어로 캐러셀 + 컬렉션
- `/brand` — 브랜드 스토리
- `/products/[id]` — PDP
- `/cart` — 장바구니

## 기술 스택
- Frontend: Next.js 15, React 19, App Router, JS/JSX (TypeScript 아님)
- Backend: Prisma 7, PostgreSQL, `@prisma/adapter-pg`
- 워크스페이스 스크립트(루트 `package.json`): `npm run dev` → frontend, `npm run studio` → Prisma Studio

## 에이전트 작업 방식
1. 이 파일 + `design/BRAND.md` 를 먼저 읽기 (필요 시 `DESIGN-apple.md`의 colors/typography만)
2. 관련 lib/스키마만 열고 최소 범위로 수정
3. UI는 Apple-like: 사진 중심, 크롬 최소화, Action Blue `#0066cc`, 불필요한 그라데이션·그림자 금지
4. 큰 기능은 plan → 구현; 작은 UI 수정은 파일 범위를 PR 설명에 명시
5. Prisma/DB 작업 시 `.cursor/skills/prisma-composer-core-concepts/SKILL.md` 참고
6. 커밋 메시지·PR은 한글로도 가능. 사용자 대면 카피는 항상 한국어 + 브랜드명 **앤클로이 / AnnChloe** (표기 통일: "엔클로이" 쓰지 말 것)

## 하지 말 것
- 카탈로그에 없는 제품·가격·통계 숫자 창작
- 방부제/오일 관련 과장·의료 효능 단정
- `backend/.env` 내용 출력·커밋
- 루트 flat 앱 구조로 되돌리기

## 빠른 검증
- `npm run dev` (루트) 후 홈·브랜드·PDP·카트 스모크
- 제품 추가 시 `products.js` + `public/products` + `public/carousel`
