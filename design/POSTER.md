# 앤클로이 제품 포스터 — 에이전트용

이 파일은 **인쇄·마케팅용 제품 포스터**를 만들 때 쓴다.  
웹 UI 규칙은 `DESIGN-apple.md` / `BRAND.md`가 기준이고, 포스터는 그 브랜드 문법을 **세로형 1장**에 옮긴 것이다.

레퍼런스의 “모양”을 복제하지 말고, 아래 **디자인 문법**만 재사용한다.

## 시작 전 읽을 것
1. `design/BRAND.md` — 표기·보이스·클레임
2. 이 파일
3. 해당 제품: `frontend/lib/products.js` + (있으면) `frontend/lib/productBanners.js`

## 입력 (사용자가 주는 것)
1. 제품 id 또는 제품 이미지 경로 (`frontend/public/products/…`)
2. (선택) 배경색 — 없으면 아래 기본 팔레트
3. (선택) 강조하고 싶은 메시지 — 반드시 SSOT에 있는 문장/수치만

## Single Source of Truth (카피)
| 쓸 수 있는 것 | 파일 |
|---------------|------|
| 제품명·tagline·description·story | `frontend/lib/products.js` |
| PDP 헤드·사용법·6無·설문 수치 | `frontend/lib/productBanners.js` |
| 브랜드 철학·6無 정의 | `frontend/lib/brand.js` |

**만들지 말 것:** PDF/lib에 없는 효능, 임상 %, “치료·완치·의학적 보장”, 새 설문 숫자.  
표기: 한글 **앤클로이**, 영문 **AnnChloe**. (카탈로그 제품명에 “엔클로이”가 남아 있으면 UI SSOT를 따르되, 새 카피는 앤클로이로.)

---

## 캔버스
- 방향: portrait (세로)
- 권장 비율: 약 `0.64 : 1` (예: 1080×1690)
- 구성은 **중앙 정렬**에 가까운 안정감

```text
┌─────────────────────────┐
│                         │
│       MAIN COPY         │  ← tagline / 배너 heading 축약
│                         │
│       SUB COPY          │  ← 제품명 · 카테고리
│                         │
│                         │
│      PRODUCT IMAGE      │
│                         │
│                         │
│   soft wash / texture   │  ← 제품·카피보다 약하게
└─────────────────────────┘
```

### 시각 우선순위
1. Main Copy  
2. 제품 이미지  
3. Sub Copy  
4. 배경 장식  
5. 작은 고지(용량·주의 한 줄 등)

---

## 색 (이 프로젝트 토큰)

웹과 맞출 기본값 (`frontend/app/globals.css`):

| 역할 | Hex |
|------|-----|
| Brand | `#63298c` |
| Brand hover | `#511f73` |
| Ink (본문) | `#1a1a1a` |
| Muted | `#6b6b6b` |
| White | `#ffffff` |
| Well / parchment | `#f5f5f5` |
| Wash | `#f9f9f9` |
| Cream (히어로 톤) | `#f3eee4` |

### 기본 배경 (포스터)
사용자가 색을 지정하지 않으면 아래 중 하나:

- `#f9f9f9` wash  
- `#f5f5f5` well  
- `#f3eee4` cream (따뜻한 살롱 톤)  
- 아주 옅은 brand tint: `#f5f0f8` (보라를 거의 안 티 나게)

레퍼런스의 pale blue(`#E0EBF8`)는 **기본값으로 쓰지 않는다.** 앤클로이 포스터의 기본은 뉴트럴 wash / cream / soft brand tint다. 사용자가 blue를 명시하면 그때만 허용.

### 텍스트 색
- 밝은 배경 → ink `#1a1a1a` (Main), muted `#6b6b6b` (Sub)
- 어두운 배경 → white / cream
- Brand `#63298c`는 **악센트** (eyebrow, 작은 라벨). Main 헤드라인 전체를 brand로 칠하지 말 것 — 대비·가독성 우선
- 대비: 본문 ≥ 4.5:1, 큰 제목 ≥ 3:1 (가능하면 더 높게)
- **텍스트가 앉는 실제 영역의 배경**으로 contrast를 본다 (포스터 평균색만 보지 말 것)

---

## 타이포
- 한글 본문/헤드: Pretendard (웹과 동일 계열)
- 영문 워드마크·eyebrow: Playfair Display 계열 가능 (`AnnChloe`)
- Main Copy: 크고 굵게, 2~3줄, 중앙, line-height 다소 촘촘
- Sub Copy: Main보다 훨씬 작게, regular/medium
- 과한 장식 타이포·그라데이션 글자 금지

### Main Copy 만드는 법
1. `products.js`의 `tagline`을 1순위로 쓴다 (이미 `\n`으로 줄바꿈됨).  
2. tagline이 포스터에 안 맞으면 `productBanners.js`의 `heading`을 2~3줄로 **축약**한다.  
3. 둘 다 없으면 `description`만 짧게. **새 효능 문장을 창작하지 않는다.**

Sub Copy 후보 (있는 것만):
- `name`
- `categoryLabel`
- 배너 `kicker` (예: 헤어 & 두피 미스트)

---

## 제품 이미지
- 경로: `frontend/public/products/{…}.jpg` (가능하면 `.webp` 병행)
- 세로 중앙, 실제 비율 유지 (찌그러뜨리지 않음)
- 포스터 높이의 약 **35% ~ 55%**
- 그림자는 **제품에만**: soft, low opacity, large blur (웹 가이드와 동일 — 크롬/장식에 그림자 남발 금지)
- 투명 PNG면 soft shadow 허용

---

## 배경 장식 (organic)
허용하되 **제품·카피보다 약하게**:

- 낮은 opacity의 blob / cream / soft wash
- 모서리에서 들어오거나 화면 밖으로 잘려도 됨
- 제품을 가리지 않음
- 강한 패턴·반복 장식·네온·퍼플 글로우 금지 (프로젝트 디자인 편향 회피)

목적은 “깨끗한 코스메틱 지면”이지, 장식 쇼가 아니다.

---

## 레이아웃 리듬
```text
TOP (~10–30%)     MAIN COPY
                  SUB COPY
CENTER            PRODUCT IMAGE
BOTTOM            (선택) 작은 고지 · AnnChloe
```

- `text-align: center` 기본
- Main Copy ↔ 제품 사이 breathing room 필수
- 빈 공간을 텍스트·장식으로 채우지 말 것

### 제품 형태
- 세로 병: 위 구조 그대로
- 가로로 넓은 컷: 제품 조금 작게, 상하 여백 확보
- 여러 제품: 대표 1개만 크게, 나머지는 secondary

---

## 카피 파이프라인 (강제)
```text
1. products.js / productBanners.js / brand.js 에서만 추출
2. FACT vs 마케팅 표현 분리 → UNSUPPORTED_CLAIM 폐기
3. Main 1~2줄 핵심 (tagline 우선)
4. 후보 2~3개만 (창작 효능 없이 재조합)
5. 줄 길이·2~3줄 배치·이미지 충돌 검사
```

---

## 출력 형식
에이전트 결과물에 포함:

```json
{
  "product_id": "silk-repair-shampoo",
  "main_copy": ["손상된 모발을", "매일 실크처럼"],
  "sub_copy": "앤클로이 두피 샴푸 · 헤어 케어",
  "copy_source": ["products.js#tagline", "products.js#name"],
  "background": "#f9f9f9",
  "text_color": "#1a1a1a",
  "secondary_text_color": "#6b6b6b",
  "accent": "#63298c",
  "product_image": "/products/shampoo.webp",
  "layout": {
    "title": "top-center",
    "subtitle": "below-title",
    "product": "center"
  },
  "notes": "배경 장식은 wash blob, opacity 낮음"
}
```

---

## 웹 UI와의 경계
| | 웹 (`frontend/`) | 포스터 (이 파일) |
|--|------------------|------------------|
| 목적 | 스토어프론트 | 1장 마케팅 |
| 그림자 | 제품만 | 제품만 |
| 그라데이션 | 크롬에 금지 | 배경 soft wash만 약하게 |
| 카피 | lib SSOT | **동일 SSOT** |
| Action Blue `#0066cc` | 링크/포커스용 | 포스터 기본 brand는 `#63298c` |

포스터 가이드가 웹 컴포넌트 CSS를 덮어쓰지 않는다.

---

## 우선순위
```text
카피 정확성 (SSOT)
  → 가독성
  → 제품 이미지 명확성
  → contrast
  → 레이아웃 균형
  → 장식
```

## 체크리스트
- [ ] 표기: 앤클로이 / AnnChloe
- [ ] Main/Sub가 `products.js` 또는 `productBanners.js` / `brand.js`에 근거하는가
- [ ] 새 효능·수치·의료 단정 없는가
- [ ] Main이 2~3줄, 짧고 강한가
- [ ] 제품 비율 유지·충분한 크기인가
- [ ] 제품↔카피 여백이 있는가
- [ ] 배경이 제품보다 세지 않은가
- [ ] 텍스트 contrast 충분한가
- [ ] brand `#63298c`는 악센트로만 썼는가
- [ ] 살롱·에디토리얼 톤인가 (할인·자극 카피 아닌가)

## 핵심 한 줄
> Minimal + soft wash + 짧은 한글 헤드 + 중앙 제품 + 큰 여백 + SSOT 카피 only.
