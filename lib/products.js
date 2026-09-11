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
    name: "스킨&바디 모이스춰 로션",
    tagline: "내 몸을 위한\n수분가득 로션",
    description:
      "오일 없이 각질층까지 채우는 천연 스킨&바디 보습 로션.",
    price: 49000,
    category: "skin",
    categoryLabel: CATEGORY_LABELS.skin,
    image: "/products/volume-lift-essence.jpg",
    story:
      "우리 몸의 70~80%는 수분입니다. 그런데 오일이나 화학 알코올이 들어간 보습은 오히려 피부를 더 건조하고 민감하게 만들 수 있습니다. 오일은 몸이 스스로 머금은 수분이 오가는 길을 막고, 알코올은 증발하면서 피부 속 수분까지 함께 가져갑니다.\n\n앤클로이 모이스춰 로션 스킨 & 바디는 오일을 넣지 않은 천연 바디로션입니다. 피부! 오일 NO, 수분 OK. 각질층까지 스며드는 깊은 보습으로 장벽을 지키며, 당김 없는 촉촉함을 남깁니다.\n\n식물 미네랄은 항산화 부스터로 작용합니다. 산화환원전위(ORP)가 약 -600mV로, 비타민 C의 약 +50mV보다 환원력이 뚜렷합니다. 당류 성분은 공기 중의 수분을 끌어당겨, 바른 뒤에도 보습이 쉽게 날아가지 않도록 돕습니다.\n\n오일을 빼면 유화제가 필요 없습니다. 방부제와 합성 계면활성제도 쓰지 않고, 피부 장벽을 지키는 쪽으로 처방을 가져갔습니다.\n\n샤워 후, 또는 피부가 건조할 때 몸과 손에 고르게 펴 바르세요. 실온에 보관하고, 직사광선은 피해주세요.",
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
    name: "앤클로이 스칼프 팩",
    tagline: "막힌 두피를 열고\n리듬을 되찾다",
    description:
      "모공을 열고 각질층을 회복해, 약산성 두피 장벽을 다시 세웁니다.",
    price: 28000,
    category: "scalp",
    categoryLabel: CATEGORY_LABELS.scalp,
    image: "/products/hydra-calming-toner.jpg",
    story:
      "가려움, 트러블, 탈모 고민은 따로 오지 않습니다. 막힌 모공과 무너진 장벽이 서로를 키우는 악순환입니다.\n\n건강한 두피는 땀과 피지로 약산성(pH 5~6)을 스스로 지킵니다. 모공을 맑게 열고, 각질층을 회복하고, 장벽을 다시 쌓으면 28일 턴오버 리듬이 돌아옵니다. 화학·오일 제품은 잠시 편하게 느껴질 수 있지만, 그 근본 리듬을 오히려 흔들 수 있습니다.\n\n앤클로이 스칼프 팩은 식품 등급의 천연 아미노산, 당류, 다당류로 케라틴을 보호하고, 삼투압으로 영양이 스며들게 하는 헤어팩입니다. 오일 없이 공기 중 수분으로 보습합니다. 방부제, 향료, 알코올, 색소, 합성 계면활성제, 오일을 넣지 않은 6-프리 처방입니다.\n\n샴푸가 노폐물을 씻어낸 뒤, 팩은 모터 펌프처럼 삼투압으로 영양을 끌어올립니다. 모공이 열리면 산소가 공급되고, 두피는 건강한 호흡을 시작합니다. 샴푸와 함께 쓰면 유수분 균형이 맞춰지며 장벽이 회복됩니다.\n\n식물 미네랄의 항산화력(ORP 약 -600mV)이 두피 환경을 지키는 힘을 더합니다.",
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
