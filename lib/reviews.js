// Customer reviews for product detail pages.
// Kept in its own file (like products.js) so the catalog stays easy to scan.
// Later this can be replaced by a real API without changing the UI.

/**
 * @typedef {object} Review
 * @property {string} id
 * @property {string} productId 이 리뷰가 속한 제품 id
 * @property {string} author 작성자 이름 (표시용)
 * @property {number} rating 1~5 정수 별점
 * @property {string} date YYYY.MM.DD 형식
 * @property {string} title 한 줄 요약
 * @property {string} body 본문
 */

/** @type {Review[]} */
export const reviews = [
  {
    id: "silk-1",
    productId: "silk-repair-shampoo",
    author: "김민지",
    rating: 5,
    date: "2026.08.21",
    title: "두피가 편안해졌어요",
    body: "약산성 샴푸를 찾다가 정착했습니다. 향이 은은하고 헹군 뒤 모발이 까슬거리지 않아요. 매일 써도 자극이 없어서 안심됩니다.",
  },
  {
    id: "silk-2",
    productId: "silk-repair-shampoo",
    author: "박서연",
    rating: 4,
    date: "2026.07.14",
    title: "거품이 부드럽고 결이 달라요",
    body: "거품이 조밀해서 소량으로도 충분합니다. 건조했던 끝이 한결 부드러워졌어요. 향은 호불호가 갈릴 수 있지만 저는 마음에 듭니다.",
  },
  {
    id: "silk-3",
    productId: "silk-repair-shampoo",
    author: "이준호",
    rating: 5,
    date: "2026.06.03",
    title: "살롱에서 쓰던 그 느낌",
    body: "시술 후에 푸석해진 모발에 잘 맞습니다. 세정력은 과하지 않고, 보통 이틀 정도 두피가 개운하게 유지돼요.",
  },
  {
    id: "glow-1",
    productId: "moisture-glow-treatment",
    author: "최유진",
    rating: 5,
    date: "2026.08.09",
    title: "한 번만 발라도 광택이 나요",
    body: "푸석한 날에 집중 케어로 쓰고 있어요. 무겁지 않은데 윤기가 살아나서 드라이 후에도 결이 정돈됩니다.",
  },
  {
    id: "glow-2",
    productId: "moisture-glow-treatment",
    author: "한소희",
    rating: 4,
    date: "2026.07.22",
    title: "수분감이 오래 가요",
    body: "린스 대신 주 2~3회 사용 중입니다. 끝이 갈라지던 게 덜해졌어요. 굵은 모발에는 조금 더 오래 방치하면 좋습니다.",
  },
  {
    id: "glow-3",
    productId: "moisture-glow-treatment",
    author: "정다은",
    rating: 5,
    date: "2026.05.30",
    title: "향도 제형도 고급스러워요",
    body: "바르자마자 스며드는 느낌이 좋아요. 헹군 뒤에도 잔여감이 거의 없어서 데일리로 쓰기 편합니다.",
  },
  {
    id: "volume-1",
    productId: "volume-lift-essence",
    author: "윤하은",
    rating: 5,
    date: "2026.08.18",
    title: "뿌리 볼륨이 자연스러워요",
    body: "끈적이지 않아서 아침에 뿌리만 살짝 발라줍니다. 부스스하지 않고 가볍게 떠 있는 느낌이 마음에 들어요.",
  },
  {
    id: "volume-2",
    productId: "volume-lift-essence",
    author: "오민서",
    rating: 4,
    date: "2026.07.01",
    title: "잔여감이 거의 없어요",
    body: "에센스인데도 무게감이 없어서 가늘고 힘없는 모발에 잘 맞습니다. 효과를 보려면 뿌리 쪽에 정확히 발라야 해요.",
  },
  {
    id: "volume-3",
    productId: "volume-lift-essence",
    author: "신재원",
    rating: 5,
    date: "2026.06.11",
    title: "출근 전 루틴이 짧아졌어요",
    body: "드라이 전에만 써도 하루 종일 납작해지지 않습니다. 향이 진하지 않아서 다른 제품이랑도 잘 어울려요.",
  },
  {
    id: "tonic-1",
    productId: "scalp-balance-tonic",
    author: "강지윤",
    rating: 5,
    date: "2026.08.05",
    title: "열감이 빠르게 가라앉아요",
    body: "여름에 두피가 뜨거울 때 바로 꺼내 씁니다. 청량한데 따갑지 않고, 저녁까지 개운함이 유지돼요.",
  },
  {
    id: "tonic-2",
    productId: "scalp-balance-tonic",
    author: "배서진",
    rating: 4,
    date: "2026.06.27",
    title: "예민한 날에도 무난합니다",
    body: "각질이 올라오는 주기에 사용 중이에요. 과하게 조이지 않아서 좋습니다. 스프레이 입자가 고운 편입니다.",
  },
  {
    id: "tonic-3",
    productId: "scalp-balance-tonic",
    author: "문채원",
    rating: 5,
    date: "2026.05.19",
    title: "두피 컨디션이 안정됐어요",
    body: "샴푸 후에 토닉만 추가했을 뿐인데 가려움이 줄었습니다. 향이 깔끔해서 매일 쓰기 부담 없어요.",
  },
  {
    id: "cleanser-1",
    productId: "scalp-deep-cleanser",
    author: "임하늘",
    rating: 5,
    date: "2026.08.12",
    title: "주 1회 딥클렌징으로 충분해요",
    body: "스타일링 제품을 자주 쓰는데 노폐물이 잘 빠집니다. 세정력이 세지만 당김이 심하지 않아서 안심하고 써요.",
  },
  {
    id: "cleanser-2",
    productId: "scalp-deep-cleanser",
    author: "조예린",
    rating: 4,
    date: "2026.07.08",
    title: "다음 케어가 잘 스며들어요",
    body: "클렌저 후에 토닉을 바르면 흡수가 확실히 다릅니다. 매일 쓰기엔 강하고, 주 1~2회가 딱이에요.",
  },
  {
    id: "cleanser-3",
    productId: "scalp-deep-cleanser",
    author: "서도윤",
    rating: 5,
    date: "2026.04.29",
    title: "개운함이 오래갑니다",
    body: "두피가 묵직하던 느낌이 씻기듯이 사라져요. 향이 인위적이지 않고 마무리도 산뜻합니다.",
  },
  {
    id: "toner-1",
    productId: "hydra-calming-toner",
    author: "노지아",
    rating: 5,
    date: "2026.08.25",
    title: "자극 없이 촉촉해져요",
    body: "세안 직후 화해하던 피부에 잘 맞습니다. 화장솜으로 닦아내도 당김이 없고, 다음 세럼이 부드럽게 올라가요.",
  },
  {
    id: "toner-2",
    productId: "hydra-calming-toner",
    author: "홍수아",
    rating: 4,
    date: "2026.07.16",
    title: "민감 피부에 무난한 토너",
    body: "알콜 향이 거의 없고 수분감이 담백합니다. 지성 피부는 조금 가볍게 느껴질 수 있어요.",
  },
  {
    id: "toner-3",
    productId: "hydra-calming-toner",
    author: "김태희",
    rating: 5,
    date: "2026.06.02",
    title: "장벽이 탄탄해진 느낌",
    body: "환절기에 빨개지던 볼이 덜해졌어요. 냉장고에 넣어 두고 쓰면 진정감이 더 좋습니다.",
  },
  {
    id: "serum-1",
    productId: "radiance-serum",
    author: "이하린",
    rating: 5,
    date: "2026.08.07",
    title: "속광이 진짜 올라와요",
    body: "한 방울만 발라도 톤이 맑아 보입니다. 끈적임 없이 빠르게 스며들어서 메이크업 전에도 부담이 없어요.",
  },
  {
    id: "serum-2",
    productId: "radiance-serum",
    author: "박도하",
    rating: 5,
    date: "2026.07.19",
    title: "기미 있는 날에 꺼내 씁니다",
    body: "2주 정도 쓰니 칙칙함이 옅어졌어요. 향이 거의 없어서 예민한 피부에도 시도해 볼 만합니다.",
  },
  {
    id: "serum-3",
    productId: "radiance-serum",
    author: "정시우",
    rating: 4,
    date: "2026.05.08",
    title: "제형이 가볍고 발림이 좋아요",
    body: "워터리해서 손이 잘 갑니다. 보습은 크림과 같이 써야 하고, 광채 목적으론 만족스러워요.",
  },
  {
    id: "cream-1",
    productId: "deep-moisture-cream",
    author: "서지안",
    rating: 5,
    date: "2026.08.15",
    title: "아침까지 수분이 남아요",
    body: "밤 루틴 마지막에 바르면 다음날 당김이 없습니다. 리치한데 밀리거나 미끄럽지 않아서 좋아요.",
  },
  {
    id: "cream-2",
    productId: "deep-moisture-cream",
    author: "유나경",
    rating: 4,
    date: "2026.06.21",
    title: "건성 피부에 잘 맞아요",
    body: "겨울·환절기에 특히 좋습니다. 지성 피부는 밤용으로만 쓰는 걸 추천해요. 향은 은은한 편입니다.",
  },
  {
    id: "cream-3",
    productId: "deep-moisture-cream",
    author: "장민재",
    rating: 5,
    date: "2026.04.17",
    title: "보습막이 탄탄합니다",
    body: "소량으로도 얼굴이 촉촉하게 감싸지는 느낌이에요. 눈가에도 따갑지 않아서 데일리 크림으로 쓰고 있습니다.",
  },
];

// All reviews that belong to one product, newest first.
export function getReviewsByProductId(productId) {
  return reviews
    .filter((review) => review.productId === productId)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Simple average, rounded to one decimal (e.g. 4.7).
export function getAverageRating(productReviews) {
  if (productReviews.length === 0) {
    return 0;
  }

  const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / productReviews.length) * 10) / 10;
}
