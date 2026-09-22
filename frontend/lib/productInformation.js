// Statutory product information shown at the bottom of each PDP.
// Shopping copy stays in products.js; editorial story stays in
// productBanners.js. This file is the label / 표시광고 table.
//
// Do not invent INCI lists, shelf-life months, or an OEM name.
// Volume comes from the product photos in /public/products.
// LABEL_BY_ID is only for fields we have photographed on the box.

import { brand } from "./brand";
import { getProductBanner } from "./productBanners";

const SEE_PACKAGING = "제품 용기 또는 포장에 별도 표기";

// Printed on the studio shots we already sell with. Do not guess a size
// that is not on the bottle (the mist banner says 235ml; the label is 200ml).
const VOLUME_BY_ID = {
  "silk-repair-shampoo": "550g",
  "moisture-glow-treatment": "200ml",
  "volume-lift-essence": "250ml",
  "scalp-balance-tonic": "500g",
  "scalp-deep-cleanser": "30ml",
  "hydra-calming": "20ml",
  "radiance-serum": "12ml",
};

const INGREDIENTS_FALLBACK = "자세한 전성분은 제품 라벨을 확인해 주세요.";

// 화장품법 시행규칙 별표 — 모든 화장품에 공통인 사용 시 주의사항.
// 효능 카피가 아니라 법정 고지라서 여기에 둔다.
const STATUTORY_CAUTIONS = [
  {
    text: "화장품 사용 시 또는 사용 후 직사광선에 의하여 사용부위가 붉은 반점, 부어오름 또는 가려움증 등의 이상 증상이나 부작용이 있는 경우에는 전문의 등과 상담할 것",
  },
  {
    text: "상처가 있는 부위 등에는 사용을 자제할 것",
  },
  {
    text: "보관 및 취급 시의 주의사항",
    subItems: [
      "어린이의 손이 닿지 않는 곳에 보관할 것",
      "직사광선을 피해서 보관할 것",
    ],
  },
];

const QUALITY_GUARANTEE =
  "본 제품에 이상이 있을 경우 공정거래위원회 고시 「소비자분쟁해결기준」에 의해 보상해 드립니다.";

/**
 * Label-printed rows that differ by product. Only fill a field when that
 * box is in hand — do not copy a phone, INCI list, or OEM onto another SKU.
 *
 * @typedef {object} ProductLabel
 * @property {string} [manufacturer] 화장품 제조업자
 * @property {string} [seller] 화장품 책임판매업자
 * @property {string} [shelfLife] 사용기한
 * @property {string} [afterOpening] 개봉 후 사용기간
 * @property {string} [manufacturingLot] 제조일자 / 제조번호
 * @property {string} [storage] 보관방법
 * @property {string} [usage] 사용법
 * @property {string} [ingredients] 전성분
 * @property {string} [cautionLabel] 주의사항 행 제목
 * @property {string} [qualityGuarantee] 품질보증기준
 * @property {string} [customerService] 고객 상담실
 */

/** @type {Record<string, ProductLabel>} */
const LABEL_BY_ID = {
  "silk-repair-shampoo": {
    manufacturer:
      "(주)스킨셀 랩 경기도 성남시 중원구 둔촌대로 457번길 27",
    seller:
      "앤클로이토탈뷰티(주) 경상북도 포항시 남구 대이로 45, 이수빌딩9층",
    shelfLife: "제조일로부터 18개월",
    manufacturingLot: "별도표기",
    usage:
      "미온수로 머리를 적신 후 두 세번 펌핑하여 손가락 지문면으로 부드럽게 마사지하면서 샴푸합니다. 2분정도 방치 후 헹구고 다시한번 동일한 방법으로 반복합니다.",
    ingredients:
      "정제수, 소듐코코일글루타메이트, 포타슘코코일글루타메이트, 데실글루코사이드, 글루코오스, 덱스트린, 트레할로스, 베타인, 카프릴릴글라이콜, 1,2-헥산다이올, 하이드록시에틸셀룰로스, 판테놀, 알란토인, 다이메틸설폰, 글라이신, 알라닌, 덱스트란, 폴릭애씨드, 알지닌, 류신, 발린, 세린, 아스파라진, 글루타믹애씨드, 시트릭애씨드, 프롤린, 바이오틴, 식물재추출물, 고삼뿌리추출물, 고추열매추출물, 구기자추출물, 녹차추출물, 참당귀뿌리추출물, 구릿대뿌리추출물, 복분자딸기열매추출물, 뽕나무뿌리추출물, 대왕소나무잎추출물, 지치뿌리추출물, 하수오뿌리추출물, 홍삼추출물, 비누풀잎추출물, 하이알루로닉애씨드, 락피노오스, 병풀추출물, 감초뿌리추출물",
  },
  "volume-lift-essence": {
    manufacturer:
      "(주)스킨셀 랩 경기도 성남시 중원구 둔촌대로 457번길 27",
    seller:
      "앤클로이토탈뷰티(주) 경상북도 포항시 남구 대이로 45, 이수빌딩 9층",
    shelfLife: "미개봉시 제조일로부터 12개월",
    afterOpening: "3개월",
    manufacturingLot: "별도표기",
    storage: "개봉 후에는 냉장보관하시고, 가급적 빨리 사용하십시오.",
    ingredients:
      "정제수, 알로에베라잎추출물, 베타인, 글루코오스, 글리세린, 조류추출물, 류코노스톡/무발효여과물, 글라이코실트레할로스, 하이드로제네이티드스타치하이드롤리세이트, 감초뿌리추출물, 헥산디올, 포타슘알지네이트, 캐롭열매추출물, 알란토인, 초피나무열매추출물, 할미꽃추출물, 우스니아추출물, 알지닌, 소듐하이알루로네이트, 화산암, 시트릭애씨드, 식물재추출물, 감태추출물, 톳추출물, 개청각추출물, 젤리튬카르틸라기네움추출물",
  },
  "moisture-glow-treatment": {
    manufacturer:
      "(주)스킨셀 랩 경기도 성남시 중원구 둔촌대로 457번길 27",
    seller:
      "앤클로이토탈뷰티(주) 경상북도 포항시 남구 대이로 45, 이수빌딩9층",
    shelfLife: "제조일로부터 18개월",
    manufacturingLot: "별도표기",
    storage: "상온보관",
    usage:
      "샴푸후 타올로 머리의 물기를 제거합니다. 두피와 모발 전체에 미스트를 충분히 뿌린 후 드라이어로 말려줍니다.",
    ingredients:
      "정제수, 해양심층수, 블래더랙알지추출물, 참미역추출물, 사르가숨 필리펜둘라추출물, 구주소나무껍질추출물, 삼나무껍질, 쓴쑥추출물, 자이언트켈프추출물, 삼백초잎/뿌리추출물, 초피나무열매추출물, 할미꽃추출물, 우스니아추출물",
  },
  "scalp-balance-tonic": {
    cautionLabel: "사용할 때의 주의사항",
    qualityGuarantee:
      "본 제품에 이상이 있을 경우 공정거래위원회 고시 「소비자분쟁해결기준」에 의해 보상받을 수 있습니다.",
    customerService: "054-248-2520",
  },
};

const SUB_ITEM_MARKS = ["1", "2", "3", "4", "5"];

/**
 * One PDP information table. Shared legal rows come from brand.js;
 * extra cautions come from the banner. Photographed box fields in
 * LABEL_BY_ID win over those fallbacks.
 *
 * @param {object} product
 * @returns {{ rows: Array<{ label: string, value?: string, cautions?: object[] }> }}
 */
export function getProductInformation(product) {
  const banner = getProductBanner(product.id);
  const extraCautions = (banner?.cautions ?? []).map((text) => ({ text }));
  const label = LABEL_BY_ID[product.id] ?? {};

  const rows = [
    { label: "제품명", value: product.name },
    { label: "용량", value: VOLUME_BY_ID[product.id] ?? SEE_PACKAGING },
    {
      label: "화장품 제조업자",
      value: label.manufacturer ?? SEE_PACKAGING,
    },
    {
      label: "화장품 책임판매업자",
      value: label.seller ?? brand.companyName,
    },
    { label: "제조국", value: "대한민국" },
    { label: "사용기한", value: label.shelfLife ?? SEE_PACKAGING },
    {
      label: "개봉 후 사용기간",
      value: label.afterOpening ?? SEE_PACKAGING,
    },
  ];

  if (label.manufacturingLot) {
    rows.push({
      label: "제조일자 / 제조번호",
      value: label.manufacturingLot,
    });
  }

  if (label.storage) {
    rows.push({ label: "보관방법", value: label.storage });
  }

  if (label.usage) {
    rows.push({ label: "사용법", value: label.usage });
  }

  rows.push(
    {
      label: label.cautionLabel ?? "사용시 주의사항",
      cautions: [...STATUTORY_CAUTIONS, ...extraCautions],
    },
    {
      label: "전성분",
      value: label.ingredients ?? banner?.ingredients ?? INGREDIENTS_FALLBACK,
    },
    {
      label: "품질보증기준",
      value: label.qualityGuarantee ?? QUALITY_GUARANTEE,
    },
  );

  if (label.customerService) {
    rows.push({ label: "고객 상담실", value: label.customerService });
  }

  return { rows };
}

/**
 * The INCI / 전성분 line shown on the dedicated ingredients tab.
 * Same source as the legal table so the two views cannot drift.
 *
 * @param {object} product
 * @returns {string}
 */
export function getProductIngredients(product) {
  const { rows } = getProductInformation(product);
  const row = rows.find((item) => item.label === "전성분");
  return row?.value ?? INGREDIENTS_FALLBACK;
}

/**
 * Turn nested caution sub-items into 1) 2) lines, matching the
 * standard Korean cosmetics label.
 *
 * @param {string[]} subItems
 * @returns {string[]}
 */
export function formatCautionSubItems(subItems) {
  return subItems.map((item, index) => {
    const mark = SUB_ITEM_MARKS[index] ?? `${index + 1}`;
    return `${mark}) ${item}`;
  });
}
