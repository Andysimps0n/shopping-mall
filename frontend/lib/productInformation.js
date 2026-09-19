// Statutory product information shown at the bottom of each PDP.
// Shopping copy stays in products.js; editorial story stays in
// productBanners.js. This file is the label / 표시광고 table.
//
// Do not invent INCI lists, shelf-life months, or an OEM name.
// Volume comes from the product photos in /public/products.

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

const SUB_ITEM_MARKS = ["가", "나", "다", "라", "마"];

/**
 * One PDP information table. Shared legal rows come from brand.js;
 * volume / 전성분 / extra cautions come from the product and its banner.
 *
 * @param {object} product
 * @returns {{ rows: Array<{ label: string, value?: string, cautions?: object[] }> }}
 */
export function getProductInformation(product) {
  const banner = getProductBanner(product.id);
  const extraCautions = (banner?.cautions ?? []).map((text) => ({ text }));

  return {
    rows: [
      { label: "제품명", value: product.name },
      { label: "용량", value: VOLUME_BY_ID[product.id] ?? SEE_PACKAGING },
      { label: "화장품 제조업자", value: SEE_PACKAGING },
      { label: "화장품 책임판매업자", value: brand.companyName },
      { label: "제조국", value: "대한민국" },
      { label: "사용기한", value: SEE_PACKAGING },
      { label: "개봉 후 사용기간", value: SEE_PACKAGING },
      {
        label: "사용시 주의사항",
        cautions: [...STATUTORY_CAUTIONS, ...extraCautions],
      },
      {
        label: "전성분",
        value: banner?.ingredients ?? INGREDIENTS_FALLBACK,
      },
      { label: "품질보증기준", value: QUALITY_GUARANTEE },
    ],
  };
}

/**
 * Turn nested caution sub-items into 가) 나) lines, matching the
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
