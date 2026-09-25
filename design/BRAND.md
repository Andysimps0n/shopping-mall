# 앤클로이 (AnnChloe) 브랜드 가이드 — 에이전트용

짧은 운영 가이드입니다. 긴 비주얼 토큰은 `DESIGN-apple.md`, 브랜드 페이지 문장은 `frontend/components/BrandStory.jsx`, 제품 카탈로그는 `frontend/lib/products.js`, 홈·푸터 등 공통 문구는 `frontend/lib/brand.js`를 따릅니다.

## 이름·표기
- 한글: **앤클로이** (제품 UI·카피에서 "엔클로이"로 쓰지 말 것)
- 영문: **AnnChloe** / 태그라인 맥락에서 *AnnChloe Total Beauty*
- 법인: (주)앤클로이 토탈뷰티
- 연락: 054.241.3336 · 경북 포항시 남구 대이로 45 (이수빌딩 9층)

## 한 줄 포지셔닝
살롱의 손길에서 시작된 뷰티 브랜드. **무늬만 천연이 아니라, 빼야 할 여섯 가지를 뺀 퍼펙트 천연**으로 헤어·두피·피부의 **순환**을 지킨다.

## 핵심 메시지 (우선순위)
1. **6無 / 화학 0% / 퍼펙트 내추럴**
2. **침투가 아니라 순환** — 억지 흡수가 아니라 배출·장벽·턴오버
3. **오일 없으면 유화제도 없다** — 무방부제·바이알·멸균 케어
4. **식물 미네랄 항산화** (야생 식물 미네랄 환원력 비교는 카탈로그에 있는 수치만)

### 6無 (반드시 이 여섯)
무오일 · 무방부제 · 무알코올 · 무합성계면활성제 · 무색소 · 무향료

## 보이스 & 톤
- 차분하고 단정함. 살롱/에디토리얼. 과한 할인·자극 카피 금지
- 짧은 헤드라인 + 호흡 있는 본문 (Apple 스토어프론트 리듬)
- 고객 후기·입소문을 과장 광고보다 앞에
- 영문 eyebrow(BRAND, PHILOSOPHY 등) + 한글 헤드 조합 가능

## 클레임 규칙 (중요)
- 출처: 앤클로이 카탈로그 PDF / `frontend/lib/brand.js`에 **이미 있는** 문구·숫자만 사용
- PDF에 없는 의료 보장, 임상 %, 새로운 설문 수치를 **만들지 말 것**
- `brand.stats` 수치를 바꿀 때는 사용자 확인 후에만
- "치료", "완치", "의학적 효과 보장" 표현 금지. 사용감·케어·리듬·장벽 언어 사용

## 카테고리
| id | 라벨 |
|----|------|
| hair | 헤어 케어 |
| scalp | 두피 케어 |
| skin | 피부 케어 |

제품 SSOT: `frontend/lib/products.js`  
(필드: id, name, tagline, description, price, category, image, heroImage, story …)

## 비주얼 (요약)
자세한 토큰 → `DESIGN-apple.md`

- 사진 우선, UI 크롬은 뒤로
- Primary / Action: `#0066cc` (focus `#0071e3`, on-dark `#2997ff`)
- Ink: `#1d1d1f` · Canvas: `#ffffff` / parchment `#f5f5f7`
- 폰트: SF Pro Display / Text (system-ui, -apple-system)
- 제품 이미지에만 시그니처 드롭섀도. 크롬에 장식 그라데이션·그림자 남발 금지
- 라이트/다크 캔버스가 교차하는 갤러리형 섹션

### 에셋 위치
- 컬렉션·PDP 정사각: `frontend/public/products/`
- 히어로 와이드: `frontend/public/carousel/`
- 브랜드 라인업 등: `frontend/public/brand/`
- 디자인 레퍼런스 PNG: `design/brand-*.png`
- 제품 포스터(에이전트): `design/POSTER.md`
- 3D/렌더 원본(리포 밖): `Desktop/models/`, Blender MCP(`blendmcp`)로 작업 가능

## 페이지별 카피 힌트
- **홈:** 제품 `tagline`은 줄바꿈(`\n`) 가능. 히어로는 와이드 컷
- **브랜드:** `/brand` 문장은 `BrandStory.jsx`에 직접 작성. 섹션 순서 유지 (hero → statement → origin → observation → principles → ritual → family → transparency)
- **PDP:** `story` + 배너(`productBanners.js`). 카탈로그에 없는 효능 단락 추가 금지

## 에이전트가 새 카피를 쓸 때 체크리스트
- [ ] 표기: 앤클로이 / AnnChloe
- [ ] 6無·순환·오일프리 철학과 충돌 없는가
- [ ] 새 숫자/%/임상 주장 없는가
- [ ] lib SSOT 또는 브랜드 페이지 JSX(`BrandStory.jsx`)에 반영했는가
- [ ] DESIGN 토큰(색·타이포)을 깨지 않는가
