// Central product catalog for the Ann Chloe storefront.
// This is the single source of truth for both the hero carousel and the
// product grid. Keeping the data here (instead of hard-coding it inside
// components) makes it easy to swap in real products or a CMS later.

/**
 * @typedef {"hair" | "scalp" | "skin"} ProductCategory
 *
 * @typedef {object} Product
 * @property {string} id
 * @property {string} name 제품명
 * @property {string} tagline 히어로용 짧고 큰 마케팅 카피
 * @property {string} description 쇼케이스용 한 줄 설명
 * @property {number} price 원 단위 정수
 * @property {ProductCategory} category
 * @property {string} categoryLabel 화면에 표시되는 한글 카테고리
 * @property {string} image 실제 이미지 경로 (지금은 플레이스홀더로 대체)
 * @property {string} story 제품 상세 페이지용 긴 설명
 */

// Human-readable Korean labels for each category.
export const CATEGORY_LABELS = {
  hair: "헤어 케어",
  scalp: "두피 케어",
  skin: "피부 케어",
};

/** @type {Product[]} */
export const products = [
  {
    id: "silk-repair-shampoo",
    name: "엔클로이 두피 샴푸",
    tagline: "손상된 모발을\n매일 실크처럼",
    description: "약산성 저자극 포뮬러로 매일의 세정을 부드럽게.",
    price: 50000,
    category: "hair",
    categoryLabel: CATEGORY_LABELS.hair,
    image: "/products/shampoo_sixteen_3.png",
    story:
      "살롱에서 매일 마주한 손상 모발을 위해 만든 데일리 샴푸입니다. 약산성 저자극 포뮬러가 두피 자극은 덜고, 씻을수록 부드러워지는 결을 남깁니다.",
  },
  {
    id: "moisture-glow-treatment",
    name: "엔클로이 모발 & 두피 미스트",
    tagline: "한 번의 케어로\n윤기 가득한 결",
    description: "고농축 수분 케어로 푸석한 모발에 광택을 더합니다.",
    price: 38000,
    category: "hair",
    categoryLabel: CATEGORY_LABELS.hair,
    image: "/products/moisture-glow-treatment.jpg",
    story:
      "고농축 수분 케어가 푸석한 모발 깊숙이 스며듭니다. 헹군 뒤에도 무겁지 않은 광택이 남아, 한 번의 트리트먼트로도 결이 달라진 느낌을 줍니다.",
  },
  {
    id: "volume-lift-essence",
    name: "스킨&바디 보습 로션",
    tagline: "뿌리부터\n가벼운 볼륨",
    description: "가벼운 텍스처로 모근에 힘을 실어주는 데일리 에센스.",
    price: 49000,
    category: "hair",
    categoryLabel: CATEGORY_LABELS.hair,
    image: "/products/volume-lift-essence.jpg",
    story:
      "뿌리부터 가볍게 세워 주는 데일리 에센스입니다. 끈적임 없는 텍스처가 모근에 힘을 더해, 부스스하지 않은 자연스러운 볼륨을 완성합니다.",
  },
  {
    id: "scalp-balance-tonic",
    name: "엔클로이 버블 워시",
    tagline: "두피 균형을\n다시 세우다",
    description: "청량한 사용감으로 두피에 시원한 밸런스를 선사합니다.",
    price: 34000,
    category: "scalp",
    categoryLabel: CATEGORY_LABELS.scalp,
    image: "/products/scalp-balance-tonic.jpg",
    story:
      "예민해진 두피의 균형을 다시 맞추는 토닉입니다. 청량한 사용감이 열감을 가라앉히고, 하루 종일 개운한 두피 컨디션을 유지하도록 돕습니다.",
  },
  {
    id: "scalp-deep-cleanser",
    name: "엔클로이 EGF 엠플",
    tagline: "쌓인 노폐물까지\n깊은 클렌징",
    description: "주 1~2회 딥 클렌징으로 두피를 맑고 개운하게.",
    price: 36000,
    category: "scalp",
    categoryLabel: CATEGORY_LABELS.scalp,
    image: "/products/scalp-deep-cleanser.jpg",
    story:
      "주 1~2회, 쌓인 노폐물과 잔여 제품을 깊게 씻어내는 두피 클렌저입니다. 과하지 않은 세정력으로 두피를 맑게 비우고 다음 케어가 잘 스며들게 합니다.",
  },
  {
    id: "hydra-calming",
    name: "클로이 두피 팩",
    tagline: "예민한 피부를\n촉촉하게 진정",
    description: "수분 장벽을 채우며 민감해진 피부결을 정돈합니다.",
    price: 28000,
    category: "skin",
    categoryLabel: CATEGORY_LABELS.skin,
    image: "/products/hydra-calming-toner.jpg",
    story:
      "수분 장벽을 채우며 민감해진 피부결을 정돈하는 토너입니다. 자극 없이 촉촉함을 올려 다음 단계 케어가 부드럽게 이어지도록 돕습니다.",
  },
  {
    id: "radiance-serum",
    name: "엔클로이 얼굴 팩",
    tagline: "속부터 번지는\n맑은 광채",
    description: "매일 한 방울로 생기 있는 광채 피부를 완성합니다.",
    price: 45000,
    category: "skin",
    categoryLabel: CATEGORY_LABELS.skin,
    image: "/products/radiance-serum.jpg",
    story:
      "매일 한 방울로 속부터 맑은 광채를 끌어올리는 세럼입니다. 가벼운 텍스처가 빠르게 스며들어, 생기 있는 피부 톤을 차분하게 완성합니다.",
  },
];

// Formats a number into Korean-style currency, e.g. 32000 -> "32,000 원".
export function formatPrice(price) {
  return `${price.toLocaleString("ko-KR")} 원`;
}

// Look up a single product by its URL-friendly id.
export function getProductById(id) {
  return products.find((product) => product.id === id);
}

// Pick four other products to recommend. Same-category items come first so
// the row feels related, then we fill from the rest of the catalog.
export function getRecommendedProducts(productId, count = 4) {
  const current = getProductById(productId);
  const others = products.filter((product) => product.id !== productId);

  if (!current) {
    return others.slice(0, count);
  }

  const sameCategory = others.filter(
    (product) => product.category === current.category,
  );
  const otherCategories = others.filter(
    (product) => product.category !== current.category,
  );

  return [...sameCategory, ...otherCategories].slice(0, count);
}
