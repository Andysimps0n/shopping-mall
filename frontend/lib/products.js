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
 * @property {string} [image] 컬렉션·상세용 정사각에 가까운 제품컷
 * @property {string} [heroImage] 히어로 캐러셀용 와이드 컷 (/public/carousel)
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
    name: "앤클로이 두피 샴푸",
    tagline: "손상된 모발을\n매일 실크처럼",
    description:
      "유해한 화학물질이 들어있지 않은 무오일 타입의 천연샴푸.",
    price: 50000,
    category: "hair",
    categoryLabel: CATEGORY_LABELS.hair,
    image: "/products/shampoo.jpg",
    heroImage: "/carousel/shampoo_wide.jpg",
    story:
      "다당체 포집 작용으로 막힌 모공을 뚫어내고 천연 아미노산 세정성분으로 두피 보호막 손상없이 클린세정이 가능합니다. 남녀노소 두피타입에 관계없이 사용할 수 있으며 문제성 두피를 정상화시킵니다. 아미노산과 다당체가 대기 중의 수분을 흡착하여 부드러운 머릿결을 유지시킴으로 린스는 필요 없습니다. 강력한 항산화효과의 식물성 미네랄이 산화되는 두피를 건강한 두피로 유지시킵니다.",
  },
  {
    id: "moisture-glow-treatment",
    name: "엔클로이 모발 & 두피 미스트",
    tagline: "한 번의 케어로\n윤기 가득한 결",
    description: "고농축 수분 케어로 푸석한 모발에 광택을 더합니다.",
    price: 38000,
    category: "hair",
    categoryLabel: CATEGORY_LABELS.hair,
    image: "/products/mist.jpg",
    heroImage: "/carousel/mist_wide.jpg",
    story:
      "고농축 수분 케어가 푸석한 모발 깊숙이 스며듭니다. 헹군 뒤에도 무겁지 않은 광택이 남아, 한 번의 트리트먼트로도 결이 달라진 느낌을 줍니다.",
  },
  {
    id: "volume-lift-essence",
    name: "스킨&바디 보습 로션",
    tagline: "오일 없이\n수분만 남기다",
    description:
      "무오일 타입의 천연 바디로션으로 피부보습과 각질층 케어에 효과적입니다.",
    price: 49000,
    category: "skin",
    categoryLabel: CATEGORY_LABELS.skin,
    image: "/products/lotion.jpg",
    heroImage: "/carousel/lotion_wide.jpg",
    story:
      "샤워 후에나 혹은 건조할 때 바디는 물론 핸드까지 촉촉하게 사용됩니다. 워터타입의 바디로션이 피부의 수분 밸런스를 맞춰주며 식물 미네랄의 강력한 항산화 효과로 피부를 투명하고 젊게 유지시킵니다.",
  },
  {
    id: "scalp-balance-tonic",
    name: "엔클로이 버블 워시",
    tagline: "수분으로 지우는\n맑고 투명한 세정",
    description: "청량한 사용감으로 두피에 시원한 밸런스를 선사합니다.",
    price: 34000,
    category: "skin",
    categoryLabel: CATEGORY_LABELS.skin,
    image: "/products/bubblewash.jpg",
    heroImage: "/carousel/bubblewash_wide.jpg",
    story:
      "예민해진 두피의 균형을 다시 맞추는 토닉입니다. 청량한 사용감이 열감을 가라앉히고, 하루 종일 개운한 두피 컨디션을 유지하도록 돕습니다.",
  },
  {
    id: "scalp-deep-cleanser",
    name: "엔클로이 EGF 엠플",
    tagline: "EGF 앰플로\n집중 영양 케어",
    description: "주 1~2회 딥 클렌징으로 두피를 맑고 개운하게.",
    price: 36000,
    category: "skin",
    categoryLabel: CATEGORY_LABELS.skin,
    heroImage: "/carousel/ampule_wide.jpg",
    image: "/products/ampule.jpg",
    story:
      "주 1~2회, 쌓인 노폐물과 잔여 제품을 깊게 씻어내는 두피 클렌저입니다. 과하지 않은 세정력으로 두피를 맑게 비우고 다음 케어가 잘 스며들게 합니다.",
  },
  {
    id: "hydra-calming",
    name: "클로이 두피 팩",
    tagline: "지친 두피를\n촉촉하게 진정",
    description: "수분 장벽을 채우며 민감해진 피부결을 정돈합니다.",
    price: 28000,
    category: "scalp",
    categoryLabel: CATEGORY_LABELS.scalp,
    image: "/products/scalppack.jpg",
    heroImage: "/carousel/scalppack_wide.jpg",
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
    image: "/products/facepack.jpg",
    heroImage: "/carousel/facepack_wide.jpg",
    story:
      "매일 한 방울로 속부터 맑은 광채를 끌어올리는 세럼입니다. 가벼운 텍스처가 빠르게 스며들어, 생기 있는 피부 톤을 차분하게 완성합니다.",
  },
];

// Formats a number into Korean-style currency, e.g. 32000 -> "32,000 원".
export function formatPrice(price) {
  return `${price.toLocaleString("ko-KR")} 원`;
}

// Only return a photo path when the file actually exists in /public.
// Missing files stay as the gray "AC" placeholder instead of a broken <img>.
const AVAILABLE_PRODUCT_PHOTOS = new Set([
  "/products/shampoo.jpg",
  "/products/mist.jpg",
  "/products/lotion.jpg",
  "/products/bubblewash.jpg",
  "/products/ampule.jpg",
  "/products/scalppack.jpg",
  "/products/facepack.jpg",
]);

const AVAILABLE_HERO_PHOTOS = new Set([
  "/carousel/shampoo_wide.jpg",
  "/carousel/mist_wide.jpg",
  "/carousel/lotion_wide.jpg",
  "/carousel/bubblewash_wide.jpg",
  "/carousel/ampule_wide.jpg",
  "/carousel/scalppack_wide.jpg",
  "/carousel/facepack_wide.jpg",
]);

export function getProductPhotoSrc(product) {
  if (product?.image && AVAILABLE_PRODUCT_PHOTOS.has(product.image)) {
    return product.image;
  }
  return undefined;
}

// Hero uses the wide studio shots in /public/carousel. If a slide has no
// wide cut yet, we fall back to the square product photo.
export function getHeroPhotoSrc(product) {
  if (product?.heroImage && AVAILABLE_HERO_PHOTOS.has(product.heroImage)) {
    return product.heroImage;
  }
  return getProductPhotoSrc(product);
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

// Collection is two storefront sections, matching the header:
// 헤어 케어 (hair + scalp) and 피부 케어 (skin).
export const COLLECTION_SECTIONS = [
  {
    id: "hair-care",
    title: "헤어 케어",
    copy: "손상된 모발과 두피를 부드럽게 가꾸는 데일리 케어",
    categories: ["hair", "scalp"],
  },
  {
    id: "skin-care",
    title: "피부 케어",
    copy: "촉촉하고 맑은 피부결을 위한 페이스와 바디 케어",
    categories: ["skin"],
  },
];

export function getCollectionSections() {
  return COLLECTION_SECTIONS.map((section) => ({
    ...section,
    products: products.filter((product) =>
      section.categories.includes(product.category),
    ),
  }));
}

export function getCollectionSectionId(category) {
  return category === "skin" ? "skin-care" : "hair-care";
}
