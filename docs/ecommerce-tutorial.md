# AnnChloe 스토어프론트를 실제 쇼핑몰로 만들기

이 문서는 **이 저장소**(`ann-chloe-storefront`)를 기준으로 한다.  
지금 사이트는 예쁜 카탈로그다. 장바구니·결제·재고는 아직 없다. 아래 순서를 따르면 UI를 유지한 채 **주문까지** 붙일 수 있다.

- 라이브: https://shopping-mall-xi-lyart.vercel.app/
- 저장소: https://github.com/Andysimps0n/shopping-mall
- 스택: Next.js App Router `15.1.9+`, React 19, JavaScript(`jsconfig.json`, TypeScript 아님)
- 가격 단위: 원(KRW) 정수. 화면 표시는 이미 `lib/products.js`의 `formatPrice()`가 `"32,000 원"` 형식으로 처리한다.

코드를 한 번에 다 짜지 말고, **Phase 단위로 커밋**하라. 각 Phase가 끝나도 홈(`/`)과 상세(`/products/[id]`)는 깨지지 않아야 한다.

---

## 목차

1. [현황과 목표](#1-현황과-목표)
2. [전체 아키텍처](#2-전체-아키텍처)
3. [체크리스트](#3-체크리스트)
4. [Phase 0: 준비](#4-phase-0-준비)
5. [Phase 1: DB](#5-phase-1-db)
6. [Phase 2: 인증(최소)](#6-phase-2-인증최소)
7. [Phase 3: 장바구니·주문서](#7-phase-3-장바구니주문서)
8. [Phase 4: 결제 (한국)](#8-phase-4-결제-한국)
9. [Phase 5: 재고·주문 상태](#9-phase-5-재고주문-상태)
10. [Phase 6: 관리자 최소](#10-phase-6-관리자-최소)
11. [Phase 7: 배송·알림·법적 페이지](#11-phase-7-배송알림법적-페이지)
12. [Phase 8: 프로덕션](#12-phase-8-프로덕션)
13. [Troubleshoot](#13-troubleshoot)
14. [다음 액션](#14-다음-액션)

---

## 1. 현황과 목표

### 지금 있는 것 (UI-only)

| 경로 / 파일 | 하는 일 | 아직 안 되는 일 |
| --- | --- | --- |
| `app/page.jsx` | 히어로 + 컬렉션 그리드 + 브랜드 인트로 | 상품을 DB에서 읽지 않음 |
| `app/products/[id]/page.jsx` | 정적 카탈로그로 PDP 생성 | `generateStaticParams()`가 `lib/products.js` 배열에 고정 |
| `app/brand/page.jsx` | 브랜드 스토리 | 그대로 둬도 됨 |
| `lib/products.js` | 7개 상품의 **단일 소스** (가격, 카피, 이미지 경로) | 재고, 품절, 주문과 무관 |
| `lib/reviews.js` | PDP 후기 (정적) | 이번 범위에서 DB화 필수 아님 |
| `components/Header.jsx` | 알림 / 로그인 / 장바구니 **아이콘만** | `IconButton`은 `href`가 없고 클릭해도 아무 일도 없음 |
| `components/ProductDetail.jsx` | `구매하기`, `장바구니` 버튼 | `type="button"`만 있고 핸들러 없음 |
| `components/ProductCard.jsx` | 하트(위시리스트) | 로컬 `useState`만, 저장 안 됨 |
| `public/products/`, `public/carousel/` | 제품컷·와이드 히어로 | 이미지 교체 금지 (이 가이드 범위 밖) |

배포는 이미 Vercel이다. Next는 CVE 패치된 `^15.1.9`다. **이 문서는 앱 동작을 바꾸지 않는다.** 구현은 네가 이 글을 보고 따로 한다.

### 목표 (주문까지)

손님이 할 수 있어야 하는 최소  circul:

1. 상품을 보고 (`/`, `/products/silk-repair-shampoo` 등)
2. 장바구니에 담고 (헤더 아이콘, PDP `장바구니`)
3. 주문서에 배송지를 적고
4. Toss Payments로 결제하고
5. 서버가 **금액을 검증한 뒤** 승인한 다음
6. 재고가 줄고, 관리자가 `/admin`에서 주문을 본다

### 이 문서의 범위

**한다**

- Postgres + Prisma로 카탈로그/장바구니/주문/결제 기록
- 최소 로그인 + **비회원 주문**
- 한국 결제(Toss 우선, PortOne은 대안)
- 재고 차감, 주문 상태, 최소 관리자
- 약관/개인정보 페이지, Vercel 프로덕션 전환

**하지 않는다**

- 상품 카피·캐러셀 이미지·브랜드 PDF 문구 수정
- 풀 CMS, 멤버십 포인트, 쿠폰 엔진, 스마트스토어 연동
- 이 PR에 쇼핑몰 코드를 넣는 일 (문서만)

---

## 2. 전체 아키텍처

돈과 재고는 **브라우저가 아니라 서버**가 결정한다. 프론트는 “이 금액으로 결제하고 싶다”고 말할 뿐이고, 서버가 DB의 주문 금액과 맞는지 확인한 뒤에만 Toss에 승인(confirm)을 보낸다.

```mermaid
flowchart LR
  Buyer["구매자 브라우저"] --> Next["Next.js App Router\nVercel"]
  Admin["관리자 /admin"] --> Next
  Next --> Neon[("Neon Postgres")]
  Next -->|"결제 준비·승인"| Toss["Toss Payments\n또는 PortOne"]
  Toss -->|"웹훅 PAYMENT_STATUS_CHANGED"| Next
```

같은 그림을 ASCII로 보면:

```
  [구매자]                      [Vercel]
     |-- HTTPS -------------> Next.js (app/, Route Handler, Server Action)
     |                              |
     |                              |-- Prisma --> Neon Postgres
     |                              |                 Product, User, CartItem
     |                              |                 Order, OrderItem, Payment
     |                              |
     |<-- 결제 위젯/리다이렉트 ------+---- Toss / PortOne
     |                              |
     |                         Toss 웹훅 --> /api/payments/webhook
```

역할 한 줄 요약:

| 조각 | 이 프로젝트에서의 역할 |
| --- | --- |
| Next.js on Vercel | UI + API. `app/` 라우트, `lib/` 헬퍼 |
| Neon Postgres | 상품·재고·주문·결제 기록의 진실 |
| Toss Payments | 카드/간편결제. **시크릿 키는 서버만** |
| 쿠키 또는 세션 | 비회원 장바구니, 로그인 사용자 식별 |

---

## 3. 체크리스트

개발만으로 상점이 열리지 않는다. 아래는 짧게 적되, **라이브 키를 켜기 전에** 대부분 끝나 있어야 한다.

### 사업·법적 (비개발)

- [ ] 사업자등록 (법인: `lib/brand.js`에 `(주)앤클로이 토탈뷰티`가 이미 있다)
- [ ] **통신판매업 신고** (관할 지자체 / 공정위 통신판매업)
- [ ] 전자상거래법 필수 표시: 상호, 대표자, 주소, 전화, 이메일, 사업자등록번호, 통신판매업신고번호, 호스팅(Vercel)
- [ ] 이용약관, 개인정보처리방침, 청약철회(반품) 안내
- [ ] 고객 문의 채널 (이메일 또는 전화). 푸터 연락처는 `lib/brand.js`의 `companyTelHref`가 `tel:0542413336`
- [ ] 화장품: 기능성·의학적 효능 광고 금지. 전성분/주의사항은 상품 상세에 나중에 붙이면 된다
- [ ] 개인정보 수집 항목·보유 기간을 방침에 명시 (주문자 이름, 전화, 주소, 이메일)

### 개발·계정

- [ ] GitHub 저장소 push 권한
- [ ] Vercel 프로젝트 (이미 `shopping-mall-xi-lyart`로 배포됨)
- [ ] Neon (또는 Supabase) 프로젝트
- [ ] Toss Payments 개발자센터 가입 → **테스트 키** 먼저
- [ ] 도메인(선택). 웹훅은 일단 `*.vercel.app`으로도 테스트 가능

> **보안:** 사업자등록증·통장사본·시크릿 키를 Git에 올리지 마라. Slack/노션에 평문으로 붙여 넣는 것도 피하라.

---

## 4. Phase 0: 준비

### 로컬 도구

```bash
node -v    # 이 환경은 v22. 로컬은 20 LTS 이상이면 충분
npm -v
git --version
```

저장소:

```bash
git clone https://github.com/Andysimps0n/shopping-mall.git
cd shopping-mall
npm install
npm run dev
```

브라우저에서 http://localhost:3000 이 뜨고, `/products/silk-repair-shampoo` 가 열리면 준비 완료다.

### Vercel · GitHub

1. [Vercel Dashboard](https://vercel.com/dashboard)에서 이 GitHub 저장소가 연결된 프로젝트를 연다.
2. **Settings → Environment Variables** 위치를 기억해 둔다. 로컬 `.env.local`에 넣은 값은 Vercel에 **자동으로 가지 않는다.**
3. Preview 배포와 Production 배포의 env를 따로 둘 수 있다. 테스트 키는 Preview, 라이브 키는 Production만.

### env 파일 규칙

이 저장소 `.gitignore`는 이미 아래를 무시한다.

```
.env*.local
```

추가로 **루트 `.env`도 커밋하지 마라.** `.gitignore`에 `.env` 한 줄을 더하는 것을 권한다.

| 파일 | 용도 | Git |
| --- | --- | --- |
| `.env.local` | 네 노트북의 `next dev` | 올리지 않음 |
| Vercel Environment Variables | `next build` / 서버리스 함수 | 대시보드에만 |
| `.env.example` (만들어도 됨) | 키 **이름**만 적어 팀과 공유 | 올려도 됨 (값 없이) |

Next.js 규칙:

- `NEXT_PUBLIC_` 으로 시작하는 값만 브라우저 번들에 들어간다.
- Toss **클라이언트 키**만 `NEXT_PUBLIC_TOSS_CLIENT_KEY`로 둔다.
- Toss **시크릿 키**, DB URL, Auth secret은 `NEXT_PUBLIC_`을 붙이지 마라.

로컬 예시 (값은 가짜다):

```bash
# .env.local  — 이 파일을 커밋하지 말 것

# Neon: 마이그레이션용(다이렉트) / 앱 쿼리용(풀러)
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-pooler.region.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require"

AUTH_SECRET="openssl rand -base64 32 로 만든 값"
AUTH_URL="http://localhost:3000"

# 브라우저에 노출되어도 되는 테스트 클라이언트 키만 PUBLIC
NEXT_PUBLIC_TOSS_CLIENT_KEY="test_ck_xxxxxxxx"
TOSS_SECRET_KEY="test_sk_xxxxxxxx"

# 관리자 로그인 이메일 (콤마 구분)
ADMIN_EMAILS="you@example.com"
```

생성:

```bash
openssl rand -base64 32
```

> **보안:** `TOSS_SECRET_KEY`를 `components/` 나 `"use client"` 파일에서 import 하면 빌드에 새어 나간다. Route Handler / Server Action / `lib/`의 서버 전용 모듈에서만 읽어라.

---

## 5. Phase 1: DB

카탈로그를 `lib/products.js`의 배열에서 Postgres로 옮긴다. **화면 클래스와 카피는 그대로** 두고, 읽는 위치만 바꾼다.

### 왜 Neon을 기본으로 하나

| | **Neon (이 가이드의 primary)** | Supabase |
| --- | --- | --- |
| 무엇인가 | 서버리스 Postgres | Postgres + Auth + Storage |
| 이 프로젝트에 맞는 이유 | Vercel과 연결이 단순, Prisma와 잘 맞음 | Auth까지 한 벤더로 쓰고 싶을 때 |
| 선택 기준 | **DB만 빨리 붙일 때 (추천)** | Phase 2에서 Supabase Auth를 고를 때 |

둘 다 Postgres라 Prisma 스키마는 거의 같다. 아래 명령은 Neon 기준이다. Supabase를 쓰면 Dashboard → **Project Settings → Database** 의 URI를 같은 변수에 넣으면 된다.

### 5.1 Neon 프로젝트

1. https://neon.tech 에서 프로젝트 생성 (region은 `ap-southeast-1` 등 가까운 곳).
2. **Connection string**을 두 개 복사한다.
   - Pooled (`-pooler` 호스트) → `DATABASE_URL` — 앱 런타임
   - Direct (풀러 없음) → `DIRECT_URL` — `prisma migrate`
3. 값을 `.env.local`에 넣는다.

### 5.2 Prisma 설치

이 레포는 JS다. Prisma 6을 쓰면 `DATABASE_URL`만으로 시작하기 쉽다 (Prisma 7은 드라이버 어댑터가 추가로 필요하다).

```bash
npm install @prisma/client@6
npm install -D prisma@6
npx prisma init --datasource-provider postgresql
```

생긴 파일:

- `prisma/schema.prisma`
- `.env` (Prisma가 만들 수 있음 → 값을 `.env.local`로 옮기고, `.env`는 gitignore)

`prisma/schema.prisma` 상단을 이렇게 맞춘다.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

`package.json`에 생성 스크립트를 더한다. Vercel이 `npm install` 할 때 클라이언트가 빠지지 않게 하기 위함이다.

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "node prisma/seed.mjs",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "node prisma/seed.mjs"
  }
}
```

### 5.3 스키마

`lib/products.js`의 필드를 거의 그대로 옮기고, 상점용 컬럼만 더한다. `id`는 URL과 같게 문자열로 둔다 (`silk-repair-shampoo`). 숫자를 새로 채번하면 `/products/[id]`가 전부 깨진다.

```prisma
enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  PREPARING
  SHIPPED
  DELIVERED
  CANCELED
  REFUND_REQUESTED
  REFUNDED
}

enum PaymentStatus {
  READY
  IN_PROGRESS
  DONE
  CANCELED
  PARTIAL_CANCELED
  ABORTED
  EXPIRED
}

model User {
  id            String     @id @default(cuid())
  name          String?
  email         String?    @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?
  role          Role       @default(CUSTOMER)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  accounts  Account[]
  sessions  Session[]
  cartItems CartItem[]
  orders    Order[]
}

// Auth.js Prisma Adapter가 요구하는 테이블
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Product {
  id            String  @id
  name          String
  tagline       String
  description   String
  story         String  @db.Text
  price         Int
  category      String
  categoryLabel String
  image         String?
  heroImage     String?
  stock         Int     @default(20)
  soldOut       Boolean @default(false)
  isPublished   Boolean @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  cartItems  CartItem[]
  orderItems OrderItem[]
}

model CartItem {
  id        String  @id @default(cuid())
  userId    String?
  sessionId String?
  productId String
  quantity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user    User?   @relation(fields: [userId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@unique([userId, productId])
  @@unique([sessionId, productId])
}

model Order {
  id            String      @id @default(cuid())
  /// Toss orderId. 6~64자, 영문/숫자/-/_ 만
  publicId      String      @unique
  userId        String?
  guestEmail    String?
  status        OrderStatus @default(PENDING)
  totalAmount   Int
  recipientName String
  phone         String
  zipCode       String
  address       String
  addressDetail String?
  memo          String?
  trackingNo    String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  user  User?       @relation(fields: [userId], references: [id])
  items OrderItem[]
  payment Payment?
}

model OrderItem {
  id          String @id @default(cuid())
  orderId     String
  productId   String
  /// 주문 당시 스냅샷. 나중에 상품 이름이 바뀌어도 영수증이 안 바뀐다.
  name        String
  price       Int
  quantity    Int

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])
}

model Payment {
  id         String        @id @default(cuid())
  orderId    String        @unique
  provider   String        @default("TOSS")
  paymentKey String?       @unique
  amount     Int
  status     PaymentStatus @default(READY)
  rawPayload Json?
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt

  order Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

포인트:

- `Product.price`는 **원 단위 정수**. `50000`이면 5만 원. 소수/문자열로 바꾸지 마라.
- `OrderItem.name` / `price`는 스냅샷이다. 상품 테이블만 보면 과거 주문이 왜곡된다.
- `CartItem`은 로그인(`userId`) 또는 비회원(`sessionId` 쿠키) 둘 다 받는다.

### 5.4 마이그레이션

```bash
npx prisma migrate dev --name init_shop
```

로컬에서 테이블이 보이면:

```bash
npx prisma studio
```

### 5.5 시드 — 지금 카탈로그를 DB로

`prisma/seed.mjs`를 만든다. **기존 `lib/products.js`의 `products` 배열을 import** 해서 이름·가격·이미지를 한 번만 관리한다.

```js
import { PrismaClient } from "@prisma/client";
import { products } from "../lib/products.js";

const prisma = new PrismaClient();

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name: product.name,
        tagline: product.tagline,
        description: product.description,
        story: product.story,
        price: product.price,
        category: product.category,
        categoryLabel: product.categoryLabel,
        image: product.image ?? null,
        heroImage: product.heroImage ?? null,
      },
      create: {
        id: product.id,
        name: product.name,
        tagline: product.tagline,
        description: product.description,
        story: product.story,
        price: product.price,
        category: product.category,
        categoryLabel: product.categoryLabel,
        image: product.image ?? null,
        heroImage: product.heroImage ?? null,
        stock: 20,
        soldOut: false,
        isPublished: true,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
```

```bash
npx prisma db seed
```

현재 시드될 id:

`silk-repair-shampoo`, `moisture-glow-treatment`, `volume-lift-essence`, `scalp-balance-tonic`, `scalp-deep-cleanser`, `hydra-calming`, `radiance-serum`

> `lib/reviews.js`에는 `hydra-calming-toner`, `deep-moisture-cream`처럼 **카탈로그에 없는 id**가 있다. 후기는 당분간 정적 파일로 두고, 상품 DB와 억지로 맞추지 마라.

`package.json`에 `"type": "module"`은 지금은 없다. 시드를 `.mjs`로 두는 이유가 이것이다. `lib/products.js`는 `export`를 쓰므로 Node ESM에서 import 된다.

### 5.6 Prisma 클라이언트 싱글톤

`lib/db.js` — Server Component / Route Handler에서만 import.

```js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

`next dev`는 파일을 다시 불러도 DB 연결이 폭주하지 않게 이렇게 캐시한다.

### 5.7 읽기만 DB로 바꾸고 UI는 유지

원칙: **헬퍼는 `lib/products.js`에 남긴다.**

남겨도 되는 것:

- `formatPrice`
- `CATEGORY_LABELS`, `COLLECTION_SECTIONS`
- `getProductPhotoSrc`, `getHeroPhotoSrc` (경로가 `public/`에 있는지 검사)
- `getCollectionSectionId`

새로 만들 것: `lib/catalog.js` (async, Prisma)

```js
import { prisma } from "@/lib/db";
import { COLLECTION_SECTIONS } from "@/lib/products";

export async function listPublishedProducts() {
  return prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getProductById(id) {
  return prisma.product.findFirst({
    where: { id, isPublished: true },
  });
}

export async function getRecommendedProducts(productId, count = 4) {
  const current = await getProductById(productId);
  const others = await prisma.product.findMany({
    where: {
      isPublished: true,
      id: { not: productId },
    },
  });

  if (!current) {
    return others.slice(0, count);
  }

  const sameCategory = others.filter((p) => p.category === current.category);
  const otherCategories = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...otherCategories].slice(0, count);
}

export async function getCollectionSections() {
  const products = await listPublishedProducts();
  return COLLECTION_SECTIONS.map((section) => ({
    ...section,
    products: products.filter((product) =>
      section.categories.includes(product.category),
    ),
  }));
}
```

**호출부를 서버로 올려라.** Prisma는 브라우저에서 돌지 않는다.

| 지금 | 문제 | 고치는 방향 |
| --- | --- | --- |
| `components/HeroCarousel.jsx`가 `products`를 직접 import | `"use client"`라 Prisma 사용 불가 | `app/page.jsx`에서 `listPublishedProducts()` 후 `<HeroCarousel products={products} />` |
| `components/ProductGrid.jsx` | 서버 컴포넌트. `getCollectionSections()`를 async로 바꾸면 됨 | `export default async function ProductGrid()` |
| `app/products/[id]/page.jsx` | `getProductById`가 동기 | `await getProductById(id)` |
| `generateStaticParams` | 빌드 시 DB 필요 | 빌드에 `DATABASE_URL`을 넣거나, 이 함수를 지우고 요청마다 조회 (더 단순) |

PDP를 요청마다 읽게 하려면 `app/products/[id]/page.jsx`에서 `generateStaticParams`를 제거하고 파일 상단에 다음을 둔다.

```js
export const dynamic = "force-dynamic";
```

빌드 시 Neon에 붙일 수 있으면 `generateStaticParams`를 `listPublishedProducts()`로 바꿔도 된다.

### 5.8 Phase 1 완료 기준

- `npm run dev` 후 홈 히어로·그리드가 **지금과 같이** 7개 상품을 보여 준다
- `/products/silk-repair-shampoo` 가 열린다
- Prisma Studio에서 `Product` 행이 7개다
- `lib/products.js`의 **카피 문자열을 이 단계에서 수정하지 않는다** (시드가 그 파일을 읽으므로)

---

## 6. Phase 2: 인증(최소)

헤더의 사람 아이콘(`components/Header.jsx`의 `label="로그인"`)이 지금은 빈 버튼이다. 여기를 `/login`으로 연결한다.

### 추천안: Auth.js (NextAuth v5)

추가 월 과금 없이 Prisma `User`와 붙는다. 이 레포처럼 **직접 주문/관리자 role**을 둘 때 맞다.

대안:

| 선택 | 언제 |
| --- | --- |
| **Auth.js + Prisma** (이 가이드) | 기본. 이메일 로그인 + 비회원 주문 |
| Clerk | UI를 사서 시간을 아끼고 싶을 때. 한국 번호/카카오는 플랜 확인 |
| Supabase Auth | Phase 1에서 Supabase를 골랐을 때. 세션을 서버에서 검증하는 방식은 [Supabase SSR](https://supabase.com/docs/guides/auth/server-side) |

카카오/네이버는 나중에 provider만 추가하면 된다. 첫 버전은 **이메일 + 비밀번호** 또는 **Google** 하나로 충분하다.

### 6.1 설치

```bash
npm install next-auth@beta @auth/prisma-adapter bcryptjs
```

`.env.local`에 `AUTH_SECRET`, `AUTH_URL` (Phase 0). Google을 쓰면 `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.

Auth.js v5는 루트에 `auth.js`를 두고, 라우트는 얇게 유지한다.

`auth.js` (프로젝트 루트):

```js
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
});
```

`app/api/auth/[...nextauth]/route.js`:

```js
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
```

로그인 UI는 `app/login/page.jsx`에 이메일/비밀번호 폼을 만들고, Server Action에서 `signIn("credentials", { email, password })`를 호출한다. 헤더 아이콘은 `<Link href="/login">`으로 바꾼다.

관리자 한 명은 시드에서 `role: ADMIN` + `passwordHash`를 만들어 두면 된다. 비밀번호를 문서나 Git에 적지 마라.

### 6.2 비회원 주문 (꼭 열어 둘 것)

한국 화장품 쇼핑몰은 **로그인 강제**를 하면 이탈이 크다.

동작 제안:

1. 미로그인 방문 시 `annchloe_sid` 쿠키를 발급한다 (`crypto.randomUUID()`, `httpOnly`, `sameSite: "lax"`, 30일).
2. `CartItem.sessionId`에 이 값을 넣는다.
3. 주문서(`app/checkout/page.jsx`)에서 이메일·이름·전화·주소를 받는다. `Order.userId`는 null, `guestEmail`에 이메일을 넣는다.
4. 나중에 같은 이메일로 가입하면 “과거 비회원 주문을 연결할까요?”는 **2차 기능**이다. 첫 버전은 연결하지 않아도 된다.

> **보안:** 비회원 주문 조회를 `/orders?email=`처럼 열면 안 된다. 주문 확인은 `publicId` + 이메일을 함께 맞출 때만, 또는 결제 직후 세션에서만 보여라.

---

## 7. Phase 3: 장바구니·주문서

이미 화면에 있는 버튼을 **실제로 연결**하는 단계다.

### 연결할 기존 UI

| 위치 | 현재 | 목표 |
| --- | --- | --- |
| `Header.jsx` 장바구니 아이콘 | 빈 `<button>` | `<Link href="/cart">`, 가능하면 수량 뱃지 |
| `ProductDetail.jsx` `장바구니` | 빈 버튼 | Server Action `addToCart(product.id)` |
| `ProductDetail.jsx` `구매하기` | 빈 버튼 | 담고 `/checkout`로 이동 (바로구매) |
| `HeroCarousel.jsx` `구매하기` | 이미 `/products/[id]` 링크 | 그대로 둬도 됨 |
| `ProductCard.jsx` `구매하기` | PDP 링크 안의 span | 카드 전체 링크 유지. 장바구니는 PDP에서 |

스타일은 `app/globals.css`의 `.button`, `.button--secondary`, `.product-page-buy`, `.product-page-cart`를 재사용하라. 새 브랜딩을 만들지 말고 같은 버튼을 쓰면 된다.

### 7.1 장바구니 API / Server Action

App Router에서는 Server Action이 이 레포(JS)와 잘 맞는다.

`app/actions/cart.js` 스케치:

```js
"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

async function getCartOwner() {
  const session = await auth();
  if (session?.user?.id) {
    return { userId: session.user.id, sessionId: null };
  }

  const cookieStore = await cookies();
  let sessionId = cookieStore.get("annchloe_sid")?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("annchloe_sid", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return { userId: null, sessionId };
}

export async function addToCart(productId, quantity = 1) {
  const product = await prisma.product.findFirst({
    where: { id: productId, isPublished: true, soldOut: false },
  });
  if (!product) {
    return { ok: false, error: "구매할 수 없는 상품입니다." };
  }

  const owner = await getCartOwner();
  const where = owner.userId
    ? { userId_productId: { userId: owner.userId, productId } }
    : { sessionId_productId: { sessionId: owner.sessionId, productId } };

  await prisma.cartItem.upsert({
    where,
    create: { ...owner, productId, quantity },
    update: { quantity: { increment: quantity } },
  });

  revalidatePath("/cart");
  return { ok: true };
}
```

PDP 버튼을 클라이언트에서 부르려면 `ProductDetail`의 액션 영역만 작은 클라이언트 컴포넌트(`components/ProductPurchaseActions.jsx`)로 쪼개면 된다. 갤러리·배너·후기는 서버에 남겨 둔다.

### 7.2 페이지 와이어프레임

만들 라우트:

```
app/cart/page.jsx
app/checkout/page.jsx
app/checkout/success/page.jsx
app/checkout/fail/page.jsx
```

**`/cart`**

1. 라인: 썸네일(`getProductPhotoSrc`), 이름, `formatPrice(price)`, 수량 ±, 삭제
2. 합계: 상품 금액 + (지금은 0원이어도 되는) 배송비
3. 버튼: “주문하기” → `/checkout`
4. 빈 장바구니: “컬렉션 보기” → `/#collection` (`lib/brand.js`의 `companyCtaHref`와 같음)

**`/checkout`**

1. 주문 상품 요약 (장바구니 스냅샷)
2. 배송 정보: 받는 분, 전화, 우편번호, 주소, 상세, 배송 메모
3. 주문자 이메일 (비회원 필수)
4. 약관 동의 체크 (Phase 7 페이지로 링크)
5. “결제하기” → **서버에서 Order + Payment(READY)를 먼저 생성**한 뒤 결제 위젯으로

주문 생성 시 서버가 해야 할 일:

```js
// 의사코드 — 금액을 브라우저에서 받지 않는다
const items = await loadCart(owner);
const totalAmount = items.reduce(
  (sum, line) => sum + line.product.price * line.quantity,
  0,
);

const order = await prisma.order.create({
  data: {
    publicId: `ac_${crypto.randomUUID().replaceAll("-", "").slice(0, 20)}`,
    totalAmount,
    status: "PENDING",
    // ...배송 필드
    items: {
      create: items.map((line) => ({
        productId: line.product.id,
        name: line.product.name,
        price: line.product.price,
        quantity: line.quantity,
      })),
    },
    payment: {
      create: { amount: totalAmount, status: "READY", provider: "TOSS" },
    },
  },
});
```

Toss `orderId` 규칙: 6~64자, 영문/숫자/`-`/`_`. `publicId`를 그대로 쓰면 된다.

> **보안:** hidden input으로 `totalAmount`를 받아 저장하지 마라. 손님이 DevTools로 1원으로 바꿀 수 있다. 항상 `Product.price * quantity`를 서버에서 다시 더한다.

### 7.3 수량·품절

- `quantity < 1` 이면 라인 삭제
- `quantity > product.stock` 이면 서버가 거절
- `soldOut === true` 이면 담기 거절. PDP 버튼 라벨을 “품절”로 바꾸면 된다

---

## 8. Phase 4: 결제 (한국)

공식 문서: [토스페이먼츠 결제위젯](https://docs.tosspayments.com/guides/v2/payment-widget/integration), [LLM Quick Reference](https://docs.tosspayments.com/guides/v2/get-started/llms-quick-reference)

### 왜 Toss를 먼저 하나

국내 카드·간편결제가 한 위젯에 들어 있고, 테스트 키가 바로 나온다. 사업자 심사 전에 **테스트 결제**로 흐름을 고정할 수 있다.

### 8.1 테스트 키

1. https://developers.tosspayments.com 가입
2. 클라이언트 키(`test_ck_...`) / 시크릿 키(`test_sk_...` 또는 `test_gsk_...`) 복사
3. `.env.local`에 넣기 (Phase 0)
4. 패키지:

```bash
npm install @tosspayments/tosspayments-sdk
```

키 사용처:

| 키 | 패턴 | 사용 위치 |
| --- | --- | --- |
| Client key | `test_ck_` / `live_ck_` | 브라우저 SDK만 |
| Secret key | `test_sk_` / `live_sk_` (또는 `*_gsk_`) | 서버 confirm / 조회 / 취소만 |

> **보안:** 시크릿 키 + 콜론을 Base64 한 값이 `Authorization: Basic ...` 이다. 이 헤더를 프론트 fetch에 넣지 마라.

### 8.2 결제 준비 (서버)

`/checkout` 제출 성공 후 결제 페이지 `app/checkout/[publicId]/page.jsx`를 연다. 이 페이지는:

1. 로그인/쿠키 소유자만 자기 `PENDING` 주문을 읽는다
2. `order.totalAmount`를 위젯에 넘긴다 (클라이언트가 금액을 지어내지 않음)
3. `customerKey`는 로그인 사용자 id, 비회원은 `guest_${sessionId}` (개인정보 없는 영구 키)

### 8.3 위젯 (클라이언트)

`components/TossCheckout.jsx` (`"use client"`):

```js
"use client";

import { useEffect, useRef, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";

export default function TossCheckout({
  clientKey,
  customerKey,
  orderId,
  orderName,
  amount,
  customerEmail,
  customerName,
}) {
  const widgetsRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey });
      await widgets.setAmount({ currency: "KRW", value: amount });
      await Promise.all([
        widgets.renderPaymentMethods({ selector: "#payment-method" }),
        widgets.renderAgreement({ selector: "#agreement" }),
      ]);
      if (!cancelled) {
        widgetsRef.current = widgets;
        setReady(true);
      }
    }

    setup();
    return () => {
      cancelled = true;
    };
  }, [clientKey, customerKey, amount]);

  async function onPay() {
    await widgetsRef.current.requestPayment({
      orderId,
      orderName,
      successUrl: `${window.location.origin}/checkout/success`,
      failUrl: `${window.location.origin}/checkout/fail`,
      customerEmail,
      customerName,
    });
  }

  return (
    <div>
      <div id="payment-method" />
      <div id="agreement" />
      <button type="button" className="button" disabled={!ready} onClick={onPay}>
        {amount.toLocaleString("ko-KR")} 원 결제하기
      </button>
    </div>
  );
}
```

성공 리다이렉트 쿼리: `paymentKey`, `orderId`, `amount`.  
실패: `code`, `message`, `orderId`.

### 8.4 서버 승인 — 프론트 금액을 믿지 말 것

`app/checkout/success/page.jsx`가 쿼리를 받아 **서버**에서 confirm 한다. 페이지에서 바로 fetch 하거나 `app/api/payments/confirm/route.js`로 POST.

```js
// app/api/payments/confirm/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request) {
  const { paymentKey, orderId, amount } = await request.json();

  const order = await prisma.order.findUnique({
    where: { publicId: orderId },
    include: { payment: true },
  });

  if (!order || !order.payment) {
    return NextResponse.json({ message: "주문을 찾을 수 없습니다." }, { status: 404 });
  }

  if (order.payment.amount !== Number(amount) || order.totalAmount !== Number(amount)) {
    return NextResponse.json({ message: "결제 금액이 일치하지 않습니다." }, { status: 400 });
  }

  const secret = process.env.TOSS_SECRET_KEY;
  const basic = Buffer.from(`${secret}:`).toString("base64");

  const tossRes = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentKey, orderId, amount: order.totalAmount }),
  });

  const payload = await tossRes.json();
  if (!tossRes.ok) {
    return NextResponse.json(payload, { status: tossRes.status });
  }

  // Phase 5에서 재고 차감을 같은 트랜잭션에 넣는다
  await prisma.$transaction([
    prisma.payment.update({
      where: { orderId: order.id },
      data: { paymentKey, status: "DONE", rawPayload: payload },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
```

반드시 지킬 것:

1. 브라우저가 준 `amount`와 `order.totalAmount`가 **다를 때 confirm을 호출하지 않는다.**
2. confirm body의 `amount`는 **DB 값**을 넣는다.
3. 이미 `PAID`인 주문이 다시 success URL로 오면 승인 API를 중복 호출하지 않고 영수증만 보여 준다.
4. 실패 페이지는 주문을 `PENDING`으로 두고, 손님이 다시 결제할 수 있게 한다.

### 8.5 웹훅

브라우저가 닫혀도 가상계좌 입금·상태 변경이 온다.

1. Toss 개발자센터 → Webhook 등록
2. 로컬: [ngrok](https://ngrok.com) 또는 Cloudflare Tunnel → `https://<tunnel>/api/payments/webhook`
3. Vercel: `https://shopping-mall-xi-lyart.vercel.app/api/payments/webhook` (프로덕션 도메인이 있으면 그걸로)

`app/api/payments/webhook/route.js`:

- 일반 결제 웹훅(`PAYMENT_STATUS_CHANGED`)에는 **서명 헤더가 없다.**
- 본문의 `paymentKey`로 [결제 조회 API](https://docs.tosspayments.com/reference#payment-조회)를 다시 호출해 상태를 확인한다.
- 가상계좌 `DEPOSIT_CALLBACK`만 `secret` 필드를 confirm 응답과 비교할 수 있다.
- 처리 후 **200**을 빨리 반환한다. 실패하면 Toss가 최대 7번 재전송한다 → **멱등**하게 (`paymentKey`로 이미 DONE이면 다시 재고를 깎지 않음).

> **보안:** 웹훅 body의 `status`만 보고 `PAID`로 바꾸지 마라. 반드시 Secret 키로 Toss에 재조회한다.

### 8.6 대안: PortOne (구 아임포트)

여러 PG를 한 계정으로 붙이고 싶을 때.

- 문서: https://developers.portone.io
- 흐름은 같다: **서버에서 결제 준비(금액 저장) → 브라우저 결제창 → 서버에서 결제 검증 → 웹훅**
- 환경 변수만 `PORTONE_API_SECRET`, `NEXT_PUBLIC_PORTONE_STORE_ID` 등으로 바뀔 뿐, `Order` / `Payment` 테이블은 재사용한다.
- 프론트 `paid` 이벤트를 최종 처리로 쓰지 않는 규칙도 Toss와 동일하다.

첫 상점에는 Toss 하나만 완성하는 편이 낫다.

---

## 9. Phase 5: 재고·주문 상태

### 9.1 언제 재고를 깎나

**결제 승인(confirm)이 성공한 뒤**, 같은 DB 트랜잭션에서 깎는다. 위젯이 열릴 때 깎으면 손님이 창을 닫아도 재고가 사라진다.

```js
await prisma.$transaction(async (tx) => {
  for (const item of order.items) {
    const updated = await tx.product.updateMany({
      where: {
        id: item.productId,
        stock: { gte: item.quantity },
        soldOut: false,
      },
      data: { stock: { decrement: item.quantity } },
    });

    if (updated.count !== 1) {
      throw new Error("INSUFFICIENT_STOCK");
    }

    const product = await tx.product.findUnique({ where: { id: item.productId } });
    if (product.stock === 0) {
      await tx.product.update({
        where: { id: item.productId },
        data: { soldOut: true },
      });
    }
  }

  await tx.payment.update({
    where: { orderId: order.id },
    data: { paymentKey, status: "DONE", rawPayload: payload },
  });
  await tx.order.update({
    where: { id: order.id },
    data: { status: "PAID" },
  });
});
```

`updateMany` + `stock: { gte: quantity }` 는 두 사람이 마지막 1개를 동시에 살 때 **한 명만** 성공하게 한다. 읽고 나서 애플리케이션에서 `if (stock >= n)` 만 하면 레이스가 난다.

재고 부족으로 throw 하면:

1. confirm은 이미 성공했을 수 있다 → Toss **취소 API**로 전액 취소
2. 주문은 `CANCELED`, 결제 `CANCELED`
3. 손님에게 “재고 부족으로 결제 취소”를 보여 준다

이게 싫으면 confirm **전에** 재고를 예약 컬럼(`reserved`)으로 잠그는 방식이 있다. 첫 상점에는 위의 “승인 후 차감 + 실패 시 취소”가 더 단순하다.

### 9.2 주문 상태 머신

```
PENDING ──결제 성공──► PAID ──► PREPARING ──► SHIPPED ──► DELIVERED
   │                    │
   │ 결제 실패/만료      │ 전액 환불
   ▼                    ▼
CANCELED              REFUNDED
                      ▲
                      └── 손님 요청: REFUND_REQUESTED
```

규칙:

- `PENDING`만 결제 위젯을 다시 열 수 있다
- `PAID` 이후에는 손님 임의 취소 대신 관리자/환불 API
- 상태 변경은 서버만. 쿼리스트링 `?status=PAID`를 믿지 마라
- 웹훅과 success 페이지가 동시에 오면, `status`가 이미 `PAID`면 재고를 두 번 깎지 마라

---

## 10. Phase 6: 관리자 최소

새 라우트:

```
app/admin/layout.jsx
app/admin/page.jsx                 # 주문 목록
app/admin/orders/[id]/page.jsx     # 송장 입력
app/admin/products/page.jsx        # 품절 토글
```

### 10.1 보호

`ADMIN_EMAILS`에 있는 이메일만 통과. `middleware.js` (루트):

```js
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((request) => {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const email = request.auth?.user?.email;
  const admins = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!email || !admins.includes(email)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
});

export const config = { matcher: ["/admin/:path*"] };
```

Prisma를 middleware에서 호출하지 마라 (Edge). 이메일 목록은 env로 충분하다. JWT에 넣은 `role === "ADMIN"`을 같이 봐도 된다.

> **보안:** `/admin`을 숨기는 것만으로 보호되지 않는다. 주문 목록 API도 같은 `auth()` 체크가 필요하다. `robots.txt`로 막는 것은 보안이 아니다.

### 10.2 주문 목록 / 송장

테이블 컬럼 제안:

- 시각, `publicId`, 수령인, 전화, 금액(`formatPrice`), 상태, 송장번호
- 행 클릭 → 상품 라인 + 주소
- 송장 저장 시 `trackingNo` 업데이트, 상태를 `SHIPPED`로

기존 푸터/헤더 톤을 유지하고, 관리자만 `container` 안에 단순 테이블이면 된다.

### 10.3 상품 품절 토글

`soldOut` boolean. 재고가 남아 있어도 수동 품절할 수 있게 한다 (입고 전 노출 방지).

PDP는 `soldOut`이면 버튼을 disabled. `ProductGrid` 카드에 “품절” 뱃지를 붙여도 된다. **상품 이름·가격·스토리 문구는 관리자 첫 버전에서 편집하지 않는 것을 권한다.** 카피 실수가 브랜드 페이지와 어긋나기 쉽다.

---

## 11. Phase 7: 배송·알림·법적 페이지

### 11.1 법적 페이지

```
app/legal/terms/page.jsx
app/legal/privacy/page.jsx
app/legal/refund/page.jsx
```

`components/Footer.jsx`에 링크를 단다. 본문은 변호사 템플릿을 쓰고, 아래 사실을 채워라.

- 상호: `(주)앤클로이 토탈뷰티` (`lib/brand.js` `companyName`)
- 주소: `경상북도 포항시 남구 대이로 45 (이수빌딩 9층)`
- 전화: `054.241.3336`
- 호스팅: Vercel
- 통신판매업 번호 / 사업자등록번호 / 대표자: 사업 서류에서 복사

전자상거래법상 **푸터에도** 상호·주소·연락처·사업자 정보가 보여야 한다. 지금 푸터는 브랜드 한 줄과 저작권만 있다.

### 11.2 고객 문의

최소:

- `app/contact/page.jsx` — 이메일 또는 `mailto:`
- 또는 푸터의 기존 전화 링크

폼을 만들면 서버에서만 메일 전송. 공개 API로 메일 서버를 열지 마라.

### 11.3 메일 / 알림

우선순위:

1. **결제 완료** 메일 (비회원 `guestEmail` 또는 로그인 email)
2. **발송** 메일 (송장번호)
3. 헤더 종 아이콘은 나중. 지금은 `/login`처럼 알림 센터를 비워 둬도 된다

도구 예: [Resend](https://resend.com) (`RESEND_API_KEY`). Vercel에서 보내기 쉽다.

헤더 `BellIcon`을 알림 센터에 연결하는 것은 주문이 쌓인 다음이다.

---

## 12. Phase 8: 프로덕션

### 12.1 Vercel env

Vercel → Project → Settings → Environment Variables. Production / Preview를 나눠 넣는다.

| 이름 | Production | Preview |
| --- | --- | --- |
| `DATABASE_URL` | Neon prod 브랜치(풀러) | Neon 개발 브랜치 가능 |
| `DIRECT_URL` | Neon prod 다이렉트 | 개발 다이렉트 |
| `AUTH_SECRET` | 새 값 | 로컬과 달라도 됨 |
| `AUTH_URL` | `https://네도메인` 또는 현재 `https://shopping-mall-xi-lyart.vercel.app` | Preview URL은 Auth.js가 대체하기도 함 |
| `NEXT_PUBLIC_TOSS_CLIENT_KEY` | `live_ck_...` | `test_ck_...` |
| `TOSS_SECRET_KEY` | `live_sk_...` | `test_sk_...` |
| `ADMIN_EMAILS` | 실제 관리자만 | 개발자 이메일 |

넣은 뒤 **Redeploy**. env는 빌드/런타임에 다시 읽힌다.

### 12.2 웹훅 URL

Toss 개발자센터에 프로덕션 URL을 등록한다.

```
https://shopping-mall-xi-lyart.vercel.app/api/payments/webhook
```

커스텀 도메인을 붙이면 그 호스트만 라이브 웹훅으로 쓴다. Preview URL을 라이브 웹훅에 넣지 마라.

### 12.3 라이브 키 전환

1. Toss에 사업자 정보 제출·계약이 끝난 뒤 라이브 키 발급
2. **테스트 결제가 success → confirm → DB `PAID`까지** 여러 번 성공한 다음에만 교체
3. 라이브 전환 직후 소액 실결제 1건 + 취소 1건으로 환불 경로를 확인
4. `NEXT_PUBLIC_` 키를 바꾸면 클라이언트가 새 번들을 받아야 하므로 재배포 필수

### 12.4 모니터링

- Vercel → Logs: confirm/webhook 4xx/5xx
- Toss 개발자센터 → 결제·웹훅 로그
- Neon → Connections / Storage
- Prisma: `prisma migrate deploy`를 프로덕션 릴리스에 넣는다. `migrate dev`는 로컬 전용

`package.json` 예:

```json
"build": "prisma generate && prisma migrate deploy && next build"
```

> **보안:** 라이브 시크릿이 커밋되거나 클라이언트 번들에 보이면 **즉시 키를 회전**하고 Toss에 알려라.

---

## 13. Troubleshoot

### 결제 금액 불일치 (`NOT_EQUAL` / 직접 막은 400)

- 위젯 `setAmount`와 DB `order.totalAmount`가 다름
- 배송비를 프론트에서만 더하고 서버는 상품합만 봄
- 손님이 탭을 두 개 열어 장바구니를 바꾼 뒤 옛 주문으로 결제

고침: confirm 전에 주문 row를 다시 읽고, 위젯 금액은 주문 생성 시점 값만 사용. 장바구니가 바뀌면 **새 주문**을 만든다.

### 웹훅이 안 옴 / 중복으로 옴

- URL이 `http://localhost` 이면 Toss가 도달하지 못함 → 터널 또는 Vercel
- 핸들러가 500을 주면 재시도. 로그를 먼저 본다
- 중복 전송은 정상. `paymentKey`로 `Payment.status === DONE`이면 200만 반환
- 일반 결제 웹훅에 HMAC 서명이 없다고 해서 body를 그대로 믿지 말고 **조회 API**로 검증

### CORS

Toss confirm API를 `fetch("https://api.tosspayments.com/...")`로 **브라우저에서** 호출하면 CORS/시크릿 유출이 난다. confirm은 `app/api/payments/confirm/route.js`만.

위젯 SDK는 Toss CDN을 쓰므로 네 도메인 CORS 설정이 필요 없다. 막히면 보통 잘못된 커스텀 fetch다.

### Prisma on Vercel

| 증상 | 원인 | 조치 |
| --- | --- | --- |
| `PrismaClientInitializationError` | `postinstall` / `prisma generate` 누락 | `postinstall`, build 스크립트 확인 |
| migrate가 타임아웃 | 풀러 URL로 migrate | `DIRECT_URL`(non-pooler) 사용 |
| 간헐적 연결 고갈 | 서버리스에서 클라이언트 과생성 | `lib/db.js` 싱글톤, Neon pooled URL |
| 빌드 중 DB 오류 | `generateStaticParams`가 빌드에 DB 요구 | `DATABASE_URL`을 빌드 env에 넣거나 동적 렌더 |
| `prepared statement` 오류 | PgBouncer + Prisma 조합 | Neon 문서의 pooled 파라미터(`pgbouncer=true`) 확인 |

### Auth 콜백 오류

- `AUTH_URL`이 `http://localhost:3000`인데 배포 도메인에서 로그인
- Vercel에 `AUTH_SECRET` 없음
- Credentials + `jwt` 전략인데 `authorize`가 `null` — 비밀번호 해시/이메일 불일치

### PDP 404 또는 홈이 빈 그리드

- 시드를 안 돌림
- `isPublished: false`로 들어가 있음
- `HeroCarousel`에 `products` props를 안 넘김 (클라이언트에서 Prisma를 호출하다 실패)

### 이미지는 깨지고 상품만 DB에서 안 보임

`getProductPhotoSrc`는 `AVAILABLE_PRODUCT_PHOTOS` 화이트리스트를 쓴다. DB에 `/products/new.jpg`를 넣어도 `lib/products.js` Set에 없으면 플레이스홀더가 나온다. 새 컷을 추가할 때 Set과 `public/products/`를 **같이** 갱신하라. 기존 7개 파일명은 바꾸지 마라.

---

## 14. 다음 액션

오늘 코드 전체를 다 짜지 말고, 아래 세 가지만 끝낸다.

1. **Neon 프로젝트**를 만들고 `DATABASE_URL` / `DIRECT_URL`을 `.env.local`에 넣는다. Vercel에는 아직 라이브 키를 넣지 않아도 된다.
2. **Prisma를 설치**하고 이 문서의 스키마로 `npx prisma migrate dev --name init_shop` 한 뒤 `npx prisma db seed`로 `lib/products.js` 7개 상품을 넣는다. Studio에서 행이 보이면 Phase 1의 절반이 끝난 것이다.
3. **Toss 개발자센터**에서 테스트 키를 발급해 `.env.local`에 넣고, 공식 위젯 샘플이 “테스트 카드로 창이 열린다”는 것만 확인한다. 승인·재고는 내일 Phase 4–5에서 붙인다.

그다음 커밋 단위 추천: `catalog-from-db` → `cart-cookie` → `checkout-order` → `toss-confirm` → `admin`.

질문이 “DB랑 결제를 어떻게 하지?”였다면, 답이 이 순서다. **DB에 주문 금액을 먼저 남기고, 결제는 그 금액을 서버가 확인한 뒤에만 승인한다.**
