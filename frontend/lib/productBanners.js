// Long-form PDP storytelling banners, keyed by product id.
//
// Only products that have a banner entry get the editorial story under the
// gallery image. Other PDPs keep the short placeholder.
//
// Catalog coverage:
//   silk-repair-shampoo      — 엔클로이 두피 샴푸 (existing)
//   moisture-glow-treatment  — 엔클로이 모발 & 두피 미스트 (PDF: Scalp & Hair Mist)
//   scalp-balance-tonic      — 엔클로이 버블 워시 (PDF: Bubble Wash)
//   volume-lift-essence      — 스킨&바디 보습 로션 (PDF: Moisture Lotion)
//   hydra-calming            — 클로이 두피 팩 (PDF: Scalp Pack)
//   radiance-serum           — 엔클로이 얼굴 팩 (PDF: Face Pack)
// Skipped:
//   scalp-deep-cleanser      — no clear PDF chapter
//   snow flower mask         — not in the catalog
//
// Banner photos (`images`) come from Desktop/엔클로이 자료 product folders.
// Prefer lifestyle / studio / pack shots that are not the catalog thumbnail.
//
// UI product names always come from lib/products.js. Banner copy is taken
// from PDF claims and tightened. Do not invent medical guarantees or
// survey numbers that the source did not include.
//
// Do not put \n in headings to force a line break. The heading wraps on
// column width so a phrase does not split in the middle on a wide screen.
//
// Sections are optional. ProductDetailBanner skips missing arrays, so a
// mist does not need a fake stats grid just because the shampoo has one.

/**
 * @typedef {object} BannerPillar
 * @property {string} title
 * @property {string} copy
 *
 * @typedef {object} BannerFreeItem
 * @property {string} [id]   아이콘 키 (oil, preservative, …)
 * @property {string} title  예: 무오일
 * @property {string} copy
 *
 * @typedef {object} BannerPoint
 * @property {string} index  표시용 번호 (01, 02, 03)
 * @property {string} title
 * @property {string} copy
 *
 * @typedef {object} BannerStat
 * @property {string} value  예: 96%
 * @property {string} label
 *
 * @typedef {object} BannerHowGroup
 * @property {string} title
 * @property {string} [note]
 * @property {string[]} steps
 *
 * @typedef {object} ProductBanner
 * @property {string} kicker
 * @property {string} heading
 * @property {string} intro
 * @property {string[]} [images]  카탈로그 썸네일과 다른 에디토리얼 사진. 스토리 사이에 순서대로 들어갑니다.
 * @property {string} [pillarsHeading]
 * @property {BannerPillar[]} [pillars]
 * @property {string} [symptomsHeading]
 * @property {string} [symptomsLead]
 * @property {string[]} [symptoms]
 * @property {string} [freeHeading]
 * @property {string} [freeLead]
 * @property {string[]} [freeHighlights]
 * @property {BannerFreeItem[]} [freeItems]
 * @property {string} [pointsHeading]
 * @property {string} [pointsLead]
 * @property {BannerPoint[]} [points]
 * @property {string} [scienceKicker]
 * @property {string} [scienceHeading]
 * @property {string} [scienceLead]
 * @property {string[]} [scienceCopy]
 * @property {string} [scienceFootnote]
 * @property {string} [statsHeading]
 * @property {string} [statsLead]
 * @property {string} [statsCaption]
 * @property {BannerStat[]} [stats]
 * @property {string} [howHeading]
 * @property {string} [howNote]
 * @property {string[]} [howSteps]
 * @property {BannerHowGroup[]} [howGroups]
 * @property {string} [cautionHeading]
 * @property {string[]} [cautions]
 * @property {string} [ingredientsHeading]
 * @property {string} [ingredients]
 */

// Shared 6無 list for pack products. Wording stays general on purpose:
// a face pack should not talk about shampoo surfactants.
const SIX_FREE_ITEMS = [
  {
    id: "oil",
    title: "무오일",
    copy: "모공을 막을 수 있는 오일은 넣지 않았습니다.",
  },
  {
    id: "preservative",
    title: "무방부제",
    copy: "방부제를 넣지 않았습니다.",
  },
  {
    id: "fragrance",
    title: "무향료",
    copy: "합성 향료를 넣지 않았습니다.",
  },
  {
    id: "alcohol",
    title: "무알코올",
    copy: "피부를 건조하게 할 수 있는 알코올을 배제했습니다.",
  },
  {
    id: "color",
    title: "무색소",
    copy: "합성 색소를 넣지 않았습니다.",
  },
  {
    id: "surfactant",
    title: "무합성계면활성제",
    copy: "강한 합성 계면활성제 없이 처방했습니다.",
  },
];

const ORP_FOOTNOTE =
  "ORP는 산화 또는 환원력을 나타내는 단위(mV)입니다. 플러스는 산화력이, 마이너스는 환원력이 강한 것을 뜻합니다.";

/** @type {Record<string, ProductBanner>} */
const bannersByProductId = {
  "silk-repair-shampoo": {
    kicker: "아미노산 두피 샴푸",
    heading: "두피를 자극 없이 비우고, 모발이 설 자리를 만들다",
    intro:
      "아미노산계 세정 성분으로 두피 자극을 덜면서 기름때를 씻어냅니다. 아미노산과 당, 다당류가 턴오버를 돕고 세정력을 보완해, 모발이 자라기 좋은 두피 환경을 만듭니다.",
    images: [
      "/products/shampoo/flat.jpg",
      "/products/shampoo/lifestyle.jpg",
      "/products/shampoo/studio.jpg",
    ],
    pillarsHeading: "네 가지 케어",
    pillars: [
      {
        title: "두피 진정과 보호",
        copy: "예민해진 두피를 달래며, 매일 세정에도 부담이 적습니다.",
      },
      {
        title: "항산화 식물 미네랄",
        copy: "독자 제법의 식물 미네랄이 두피 항산화 케어를 돕습니다.",
      },
      {
        title: "두피 보습",
        copy: "아미노산과 다당류가 수분을 잡아, 씻은 뒤에도 촉촉함을 남깁니다.",
      },
      {
        title: "화학성분 제로",
        copy: "합성 계면활성제, 방부제, 향료, 알코올, 색소, 오일을 넣지 않았습니다.",
      },
    ],
    symptomsHeading: "이런 신호가 있다면, 지금 쓰는 샴푸를 점검해 보세요",
    symptomsLead:
      "아래 증상이 반복된다면, 샴푸를 바꿔 볼 시점입니다.",
    symptoms: [
      "두피와 모발이 매우 건조하고, 윤기가 없다",
      "두피가 가렵고 뾰루지가 생긴다",
      "샴푸 후 머리카락이 금방 축축해진다",
      "두피가 붉고 아프다",
      "어깨 라인에 하얀 각질이 내려앉는다",
      "머리카락이 가늘고 힘이 없다",
      "두피가 기름지고 냄새가 난다",
    ],
    freeHeading: "화학 성분을 비우고, 천연에 가까운 처방을 지향합니다",
    freeLead:
      "두피에 부담이 될 수 있는 여섯 가지를 먼저 뺐습니다.",
    freeHighlights: ["6無", "화학성분 0%", "천연 지향"],
    freeItems: [
      {
        id: "oil",
        title: "무오일",
        copy: "모공 막힘을 부를 수 있는 오일은 넣지 않았습니다.",
      },
      {
        id: "preservative",
        title: "무방부제",
        copy: "생체 활성을 떨어뜨릴 수 있는 방부제를 배제했습니다.",
      },
      {
        id: "fragrance",
        title: "무향료",
        copy: "합성 향료를 넣지 않아 두피와 바디 부담을 덜었습니다.",
      },
      {
        id: "alcohol",
        title: "무알코올",
        copy: "피부를 자극하고 수분을 날릴 수 있는 알코올을 배제했습니다.",
      },
      {
        id: "color",
        title: "무색소",
        copy: "모발 손상과 알레르기를 유발할 수 있는 합성 색소를 넣지 않았습니다.",
      },
      {
        id: "surfactant",
        title: "무합성계면활성제",
        copy: "SLS 대신 아미노산계 세정 성분을 사용합니다.",
      },
    ],
    pointsHeading: "앤클로이 샴푸로 건강해지는 두피",
    pointsLead: "피부 턴오버를 도와, 장벽이 제 역할을 하도록 케어합니다.",
    points: [
      {
        index: "01",
        title: "샴푸만으로 보습",
        copy: "아미노산과 다당류가 수분을 흡수해, 린스 없이도 모발에 수분이 남도록 돕습니다.",
      },
      {
        index: "02",
        title: "강력한 항산화",
        copy: "식물 미네랄이 항산화 케어로 두피를 오래 건강하게 유지하도록 돕습니다.",
      },
      {
        index: "03",
        title: "샴푸 하나로 올인원",
        copy: "바디워시도 겸할 수 있는 All Light, All in One 처방입니다.",
      },
    ],
    scienceKicker: "식물 미네랄",
    scienceHeading: "항산화로 두피의 시간을 돌보다",
    scienceLead: "피부 노화만 막으셨나요. 두피도 함께 돌봐 주세요.",
    scienceCopy: [
      "두피를 젊게 유지하는 확실한 방법 중 하나는 항산화 케어입니다. 야생 식물 미네랄이 산화되는 두피에 항산화 부스터로 작용하도록 설계했습니다.",
      "비타민 C의 ORP는 사용 후 약 +50mV입니다. 식물 미네랄은 약 −600mV의 환원력을 지닙니다.",
    ],
    scienceFootnote: ORP_FOOTNOTE,
    statsHeading: "사용 후 피부 변화와 제품 만족도",
    statsLead:
      "세 달간의 사용 설문에서, 두피 컨디션과 만족도를 이렇게 답했습니다.",
    statsCaption: "20–59세 여성과 남성, 3개월 사용 후 설문. 개인차가 있을 수 있습니다.",
    stats: [
      { value: "96%", label: "두피 각질이 줄어들었다" },
      { value: "95%", label: "두피 가려움이 개선되었다" },
      { value: "97%", label: "두피 컨디셔닝이 좋아졌다" },
      { value: "93%", label: "과다한 유분이 줄어들었다" },
      { value: "100%", label: "제품 사용에 만족한다" },
      { value: "95%", label: "사용 후 지인에게 추천한 적 있다" },
    ],
    howHeading: "사용 방법",
    howNote:
      "유분과 화학 성분이 많으면 거품이 잘 나지 않습니다. 물로 노폐물을 씻은 뒤 샴푸하세요.",
    howSteps: [
      "미온수로 머리를 적신 뒤, 샴푸를 두피와 모발에 바르고 지문 면으로 부드럽게 마사지합니다.",
      "엄지와 검지로 두피를 감싸 정수리 쪽으로 짜 올라갑니다. (1–2분)",
      "미온수로 헹굽니다.",
      "다시 샴푸를 두피에 바르고 거품을 낸 뒤, 3분 정도 그대로 둡니다.",
      "미온수로 헹구고, 수건으로 물기를 제거한 다음 드라이로 말립니다.",
    ],
    cautionHeading: "주의 사항",
    cautions: [
      "마사지할 때 두피를 비비지 마세요. 다당체는 입자가 커서 자극이 될 수 있습니다.",
      "젖은 모발은 브러싱하지 말고, 완전히 말린 뒤 빗질하세요.",
      "모공 기능을 위해 더블 샴푸를 권합니다.",
    ],
    ingredientsHeading: "전성분",
    ingredients:
      "정제수, 소듐코코일글루타메이트, 포타슘코코일글루타메이트, 글루코오스, 덱스트린, 카프릴릴글라이콜, 베타인, 하이드록시에칠셀룰로오스, 알지닌, 글라이신, 알라닌, 류신, 블래더랙알지추출물, 자이언트켈프추출물, 참미역추출물, 사르가숨필리네들리스추출물, 구주조나무껍질추출물, 삼나무껍질추출물, 쓴쑥추출물, 산백초잎/뿌리추출물",
  },

  "moisture-glow-treatment": {
    kicker: "헤어 & 두피 미스트",
    heading: "건강한 헤어 미스트로, 보석처럼 빛나는 머리결",
    intro:
      "올내추럴 처방으로 모든 모발 타입에 윤기와 힘을 더합니다. 큐티클을 부드럽게 열어 저분자 수분이 손상된 결에 닿도록 돕고, 무화학, 논오일, 논실리콘으로 매일 뿌리기 부담이 적습니다.",
    images: [
      "/products/mist/lifestyle.jpg",
      "/products/mist/studio.jpg",
    ],
    pillarsHeading: "네 가지 케어",
    pillars: [
      {
        title: "올내추럴",
        copy: "모발에 남는 화학 부담을 먼저 덜었습니다.",
      },
      {
        title: "모든 모발 타입",
        copy: "가는 모발부터 굵고 손상된 결까지 뿌리도록 설계했습니다.",
      },
      {
        title: "윤기",
        copy: "푸석한 표면에 수분을 더해, 빛나는 머리결을 돕습니다.",
      },
      {
        title: "모발 강화",
        copy: "저분자 수분이 결에 머물며 힘이 빠진 모발을 가꿔 갑니다.",
      },
    ],
    symptomsHeading: "이런 결이라면, 미스트를 가까이 두세요",
    symptomsLead:
      "하루 사이에 윤기가 달아나는 모발에 맞춰 만들었습니다.",
    symptoms: [
      "모발이 푸석하고 윤기가 없다",
      "손상된 결이 거칠고 힘이 없다",
      "실리콘 코팅 없이 가벼운 윤기를 원한다",
      "엄마와 아이가 같은 미스트를 쓰고 싶다",
    ],
    freeHeading: "무화학, 논오일, 논실리콘",
    freeLead:
      "코팅으로 가리는 미스트가 아니라, 남기지 않는 수분 미스트입니다.",
    freeHighlights: ["무화학", "논오일", "논실리콘"],
    freeItems: [
      {
        id: "chemical",
        title: "무화학",
        copy: "불필요한 합성 성분을 넣지 않았습니다.",
      },
      {
        id: "oil",
        title: "논오일",
        copy: "오일 막을 씌우지 않아, 뿌린 뒤에도 결이 무겁지 않습니다.",
      },
      {
        id: "silicon",
        title: "논실리콘",
        copy: "실리콘 코팅 없이, 수분으로 윤기를 돕습니다.",
      },
    ],
    pointsHeading: "뿌리기만 해도 결이 달라지는 이유",
    pointsLead: "큐티클을 연 다음, 이온과 저분자 수분이 손상된 결에 닿도록 설계했습니다.",
    points: [
      {
        index: "01",
        title: "큐티클을 여는 미스트",
        copy: "분사와 함께 큐티클이 부드럽게 열려, 수분 케어가 결에 닿기 쉽게 합니다.",
      },
      {
        index: "02",
        title: "이온과 저분자 수분의 결합",
        copy: "손상된 표면의 양이온과 미스트의 마이너스 이온, 저분자 수분이 만나 결에 수분이 머물도록 돕습니다.",
      },
      {
        index: "03",
        title: "분사 후 브러싱",
        copy: "뿌린 뒤 빗질하면 미스트가 얇게 퍼지고, 큐티클이 다시 정돈됩니다.",
      },
    ],
    howHeading: "사용 방법",
    howNote:
      "235ml. 젖은 모발과 마른 모발 모두에 뿌릴 수 있습니다.",
    howSteps: [
      "모발에서 20cm 정도 떨어뜨려, 중간부터 끝까지 고르게 분사합니다.",
      "손끝이나 브러시로 결을 따라 빗질해 전체에 퍼지게 합니다.",
      "스타일링 전과 후에도 가볍게 뿌려 윤기를 더할 수 있습니다.",
    ],
    cautionHeading: "주의 사항",
    cautions: [
      "눈과 점막을 피해 분사하세요.",
      "뿌린 뒤에는 브러싱해 결을 정리하세요.",
    ],
    ingredientsHeading: "성분 요약",
    ingredients:
      "무화학, 논오일, 논실리콘 헤어 미스트입니다. 자세한 전성분은 제품 라벨을 확인해 주세요.",
  },

  "scalp-balance-tonic": {
    kicker: "페이스 & 바디 워시",
    heading: "맑고 투명한 피부는 수분으로 지워요",
    intro:
      "보습과 다당체 거품으로 세안과 바디, 아이까지 함께 쓰는 클렌저입니다. 모공 주변 노폐물을 거품이 감싸 씻어내고, 지문이 피부에 직접 닿지 않게 롤링합니다.",
    images: [
      "/products/bubblewash/lifestyle-c.jpg",
      "/products/bubblewash/lifestyle-b.jpg",
      "/products/bubblewash/studio.jpg",
    ],
    pillarsHeading: "네 가지 세정",
    pillars: [
      {
        title: "보습 세정",
        copy: "지우는 세안이 아니라, 수분을 남기는 세안입니다.",
      },
      {
        title: "다당체 거품",
        copy: "입자가 큰 거품이 모공 입구의 노폐물을 감싸 씻어내도록 돕습니다.",
      },
      {
        title: "세안 + 바디 + 아이",
        copy: "얼굴과 바디, 아이가 같은 거품으로 씻을 수 있는 올인원 워시입니다.",
      },
      {
        title: "거품 롤링",
        copy: "지문이 피부에 닿지 않게, 거품만 올려 굴리듯 롤링합니다.",
      },
    ],
    symptomsHeading: "이런 세안이라면, 거품부터 바꿔 보세요",
    symptomsLead:
      "강하게 문질러 지우는 대신, 수분과 거품으로 감싸 씻습니다.",
    symptoms: [
      "세안 후 피부가 당기고 건조하다",
      "모공이 막히고 블랙헤드가 신경 쓰인다",
      "메이크업 유무에 따라 세안 방법이 헷갈린다",
      "얼굴과 바디, 아이가 쓸 클렌저를 하나로 하고 싶다",
    ],
    pointsHeading: "거품이 하는 일",
    pointsLead: "문지르지 않아도, 거품이 노폐물을 감싸 일어나도록 돕습니다.",
    points: [
      {
        index: "01",
        title: "수분으로 지운다",
        copy: "보습 세정이 당김을 덜고 다음 케어가 닿기 쉽게 합니다.",
      },
      {
        index: "02",
        title: "다당체 거품으로 모공",
        copy: "거품이 모공 주변 노폐물과 피지를 감싸 씻어냅니다. 짜거나 박피하는 세안이 아닙니다.",
      },
      {
        index: "03",
        title: "지문이 피부에 닿지 않게",
        copy: "지문으로 문지르면 자극이 됩니다. 거품만 올려 굴리듯 롤링하세요.",
      },
    ],
    howHeading: "사용 방법",
    howNote:
      "세안과 바디, 아이까지 같은 거품으로 쓸 수 있습니다. 비비지 않고 롤링하세요.",
    howGroups: [
      {
        title: "메이크업을 하지 않았을 때",
        steps: [
          "미온수로 얼굴과 바디를 적십니다.",
          "버블 워시를 손에 덜어 풍성한 거품을 냅니다.",
          "지문이 닿지 않도록, 거품만 올려 원을 그리듯 롤링합니다.",
          "미온수로 거품이 남지 않게 헹굽니다.",
        ],
      },
      {
        title: "메이크업을 했을 때, 더블 세안",
        note: "한 번에 지우기보다, 두 번으로 나눠 감싸 씻습니다.",
        steps: [
          "첫 번째 거품으로 메이크업을 감싸 씻어내고, 미온수로 헹굽니다.",
          "두 번째 거품을 내, 지문이 닿지 않게 롤링하며 남은 노폐물을 씻습니다.",
          "미온수로 깨끗이 헹굽니다.",
        ],
      },
    ],
    cautionHeading: "주의 사항",
    cautions: [
      "피부를 비비지 마세요. 다당체는 입자가 커서 마찰이 자극이 될 수 있습니다.",
      "사용 초기에 당기거나 얇은 각질이 일어날 수 있습니다. 불편하면 사용을 멈추고 상담하세요.",
      "눈 안에 들어갔을 때는 물로 충분히 씻어 내세요.",
    ],
    ingredientsHeading: "성분 요약",
    ingredients:
      "수분과 다당체를 중심으로 한 세정 거품입니다. 자세한 전성분은 제품 라벨을 확인해 주세요.",
  },

  "volume-lift-essence": {
    kicker: "스킨 & 바디 로션",
    heading: "오일 NO, 수분 OK",
    intro:
      "오일과 알코올은 순간적으로 부드러워 보여도 피부를 건조하게 만들 수 있습니다. 무오일 보습으로 각질층에 수분을 남기고, 식물 미네랄 항산화와 당 성분의 수분 흡착으로 촉촉함을 이어 갑니다.",
    images: [
      "/products/lotion/lifestyle.jpg",
      "/products/lotion/flat.jpg",
      "/products/lotion/pack.jpg",
    ],
    pillarsHeading: "네 가지 보습",
    pillars: [
      {
        title: "무오일 보습",
        copy: "오일 막으로 가리지 않습니다. 수분이 각질층에 머물도록 돕습니다.",
      },
      {
        title: "각질층 케어",
        copy: "겉만 번들거리게 하지 않고, 각질층이 수분을 붙잡는 힘을 보탭니다.",
      },
      {
        title: "식물 미네랄 항산화",
        copy: "독자 제법의 식물 미네랄이 스킨과 바디의 항산화 케어를 돕습니다.",
      },
      {
        title: "당 성분 수분 흡착",
        copy: "당 성분이 수분을 끌어당겨, 바른 뒤에도 촉촉함이 오래가도록 돕습니다.",
      },
    ],
    symptomsHeading: "오일 보습이 오히려 건조하다면",
    symptomsLead:
      "오일이나 알코올이 많은 로션은, 순간적으로 부드러워 보여도 수분을 잃기 쉽습니다.",
    symptoms: [
      "바르면 번들거리지만 곧 땅긴다",
      "알코올 향이 날아가며 수분이 달아나는 느낌이다",
      "오일 때문에 모공이 막히는 것 같다",
      "샤워 후 바디까지 같은 수분 로션이 필요하다",
    ],
    pointsHeading: "오일 없이 수분을 고르는 이유",
    pointsLead: "막을 씌우는 보습이 아니라, 각질층에 수분을 남기는 보습입니다.",
    points: [
      {
        index: "01",
        title: "오일 NO, 수분 OK",
        copy: "오일 대신 수분과 당 성분으로 보습합니다. 바른 뒤 무겁지 않습니다.",
      },
      {
        index: "02",
        title: "유화제 없는 화장품에 도전",
        copy: "물과 기름을 억지로 섞는 대신, 오일 없이 수분이 자리를 잡도록 만든 처방입니다.",
      },
      {
        index: "03",
        title: "샤워 후 바로",
        copy: "물기가 남은 스킨과 바디에 펴 바르면, 당 성분이 수분을 흡착하기 좋습니다.",
      },
    ],
    scienceKicker: "식물 미네랄",
    scienceHeading: "항산화 보습, 숫자로 보면",
    scienceLead: "수분을 남기는 일과, 산화를 덜어 주는 일을 함께 합니다.",
    scienceCopy: [
      "식물 미네랄은 항산화 케어로 스킨과 바디 컨디션을 오래 건강하게 유지하도록 돕습니다.",
      "비타민 C의 ORP는 사용 후 약 +50mV입니다. 식물 미네랄은 약 −600mV의 환원력을 지닙니다.",
    ],
    scienceFootnote: ORP_FOOTNOTE,
    howHeading: "사용 방법",
    howNote: "실온에 보관하세요. 냉장 보관은 필요하지 않습니다.",
    howSteps: [
      "샤워 후, 물기를 살짝 남긴 스킨과 바디에 적당량을 펴 바릅니다.",
      "두드리기보다, 결을 따라 얇게 펴 바르는 편이 흡착에 좋습니다.",
      "건조한 부위에는 한 겹 더 올립니다.",
    ],
    cautionHeading: "주의 사항",
    cautions: [
      "실온에서 보관하세요.",
      "눈에 들어갔을 때는 물로 충분히 씻어 내세요.",
    ],
    ingredientsHeading: "성분 요약",
    ingredients:
      "무오일 보습에 당 성분과 식물 미네랄을 더했습니다. 자세한 전성분은 제품 라벨을 확인해 주세요.",
  },

  "hydra-calming": {
    kicker: "스칼프 팩",
    heading: "악순환을 멈추고, 턴오버가 제자리를 찾도록",
    intro:
      "아미노산과 당, 다당류로 각질층 수분 균형을 돕습니다. 삼투압 케어로 모공 주변 노폐물 배출을 돕고, 흐트러진 턴오버 리듬이 제자리를 찾도록 설계했습니다.",
    images: [
      "/products/scalppack/lifestyle.jpg",
      "/products/scalppack/stand.jpg",
      "/products/scalppack/set.jpg",
    ],
    pillarsHeading: "네 가지 구성",
    pillars: [
      {
        title: "아미노산",
        copy: "피부와 가까운 아미노산이 두피 각질층 컨디션을 보탭니다.",
      },
      {
        title: "당",
        copy: "당 성분이 수분을 끌어당겨, 팩을 올린 두피가 건조해지지 않게 합니다.",
      },
      {
        title: "다당류",
        copy: "다당류가 수분을 붙잡고, 팩이 두피에 고르게 머물게 합니다.",
      },
      {
        title: "삼투압과 각질층",
        copy: "성분을 억지로 밀어 넣기보다, 삼투압으로 각질층 안팎의 균형을 돕습니다.",
      },
    ],
    symptomsHeading: "문제가 쌓이면 모공은 더 막힙니다",
    symptomsLead:
      "노폐물이 모공을 막고 턴오버가 흐트러지면 같은 고민이 반복됩니다. 팩은 그 고리를 느슨하게 돕습니다.",
    symptoms: [
      "두피 모공이 막히고 답답하다",
      "각질이 일어나며 컨디션이 널뛴다",
      "샴푸만으로는 두피가 개운해지지 않는다",
      "오일과 화학 잔여가 두피에 남는 느낌이다",
    ],
    freeHeading: "화학 성분을 비우고, 여섯 가지를 뺐습니다",
    freeLead:
      "오일, 방부제, 향료, 알코올, 색소, 합성 계면활성제를 넣지 않았습니다.",
    freeHighlights: ["6無", "오일 NO", "화학 NO"],
    freeItems: [...SIX_FREE_ITEMS],
    pointsHeading: "네 가지 솔루션",
    pointsLead: "막을 씌우지 않고, 모공과 턴오버, 미네랄 케어로 두피 환경을 되돌리도록 돕습니다.",
    points: [
      {
        index: "01",
        title: "오일과 화학 NO",
        copy: "오일 막과 불필요한 화학 잔여 없이, 두피가 숨 쉴 자리를 남깁니다.",
      },
      {
        index: "02",
        title: "모공",
        copy: "삼투압 케어가 모공 주변 노폐물 배출을 도와, 막힌 느낌이 덜해지도록 합니다.",
      },
      {
        index: "03",
        title: "턴오버",
        copy: "각질층은 대략 한 달 주기로 새로워집니다. 팩은 그 리듬이 흐트러지지 않도록 돕습니다.",
      },
      {
        index: "04",
        title: "미네랄",
        copy: "식물 미네랄이 항산화 케어로 두피 컨디션을 오래 건강하게 유지하도록 돕습니다.",
      },
    ],
    scienceKicker: "삼투압 + 샴푸",
    scienceHeading: "배설과 세정이 서로를 보탤 때",
    scienceLead: "팩만으로 끝내지 마세요. 샴푸와 짝을 이루도록 만들었습니다.",
    scienceCopy: [
      "삼투압 케어는 각질층 안팎의 농도 차이로 노폐물이 나가기 쉽게 돕습니다. 밀어 넣는 침투보다 비우고 순환하는 쪽에 가깝습니다.",
      "이어서 샴푸하면 팩이 느슨하게 한 노폐물을 거품이 감싸 씻어 내기 좋습니다. 식물 미네랄 ORP는 약 −600mV입니다.",
    ],
    scienceFootnote: ORP_FOOTNOTE,
    howHeading: "사용 방법",
    howNote:
      "샴푸 전에 올리면, 삼투압 케어와 세정이 이어서 작동합니다.",
    howSteps: [
      "미온수로 두피를 적십니다.",
      "클로이 두피 팩을 두피에 펴 바르고, 잠시 그대로 둡니다.",
      "엔클로이 두피 샴푸로 세정한 뒤, 미온수로 헹굽니다.",
    ],
    cautionHeading: "주의 사항",
    cautions: [
      "두피를 세게 비비지 마세요.",
      "눈에 들어갔을 때는 물로 충분히 씻어 내세요.",
    ],
    ingredientsHeading: "성분 요약",
    ingredients:
      "아미노산, 당, 다당류를 중심으로 한 두피 팩입니다. 자세한 전성분은 제품 라벨을 확인해 주세요.",
  },

  "radiance-serum": {
    kicker: "페이스 팩",
    heading: "침투보다 순환. 피부를 비워 다시 채우다",
    intro:
      "성분을 억지로 밀어 넣기보다, 삼투압으로 노폐물 배출과 순환을 돕는 팩입니다. 아미노산과 당, 식물 미네랄, 다당체가 각질층의 보습과 항산화, 턴오버 케어를 함께 합니다.",
    images: [
      "/products/facepack/lifestyle.jpg",
      "/products/facepack/flat.jpg",
      "/products/facepack/display.jpg",
    ],
    pillarsHeading: "네 가지 케어",
    pillars: [
      {
        title: "순환 중심",
        copy: "더 바르는 침투보다, 막힌 것을 비워 피부가 순환하도록 돕습니다.",
      },
      {
        title: "삼투압 배출",
        copy: "각질층 안팎의 균형으로 노폐물이 바깥으로 나가기 쉽게 돕습니다.",
      },
      {
        title: "보습",
        copy: "당과 다당체가 수분을 붙잡아, 팩을 걷은 뒤에도 각질층이 촉촉하도록 합니다.",
      },
      {
        title: "항산화",
        copy: "식물 미네랄이 얼굴 피부의 항산화 케어를 보탭니다.",
      },
    ],
    symptomsHeading: "바를수록 답답하다면, 넣는 케어를 의심해 보세요",
    symptomsLead:
      "성분을 쌓아 올리는 팩과 달리, 비우고 순환하는 쪽으로 설계했습니다.",
    symptoms: [
      "팩을 할수록 피부가 무겁고 막힌 느낌이다",
      "각질층이 건조하고 턴오버가 고르지 않다",
      "오일 팩이 모공을 가리는 것 같다",
      "보습과 항산화를 한 장의 팩으로 하고 싶다",
    ],
    freeHeading: "여섯 가지를 비운 페이스 팩",
    freeLead:
      "얼굴에 올릴 팩일수록, 남기지 않을 것을 먼저 뺐습니다.",
    freeHighlights: ["6無", "침투보다 순환", "삼투압"],
    freeItems: [...SIX_FREE_ITEMS],
    pointsHeading: "팩이 남기는 것",
    pointsLead: "아미노산, 당, 미네랄, 다당체가 각질층을 중심으로 일합니다.",
    points: [
      {
        index: "01",
        title: "아미노산과 당",
        copy: "피부와 가까운 아미노산과, 수분을 끌어당기는 당 성분이 각질층 컨디션을 보탭니다.",
      },
      {
        index: "02",
        title: "미네랄",
        copy: "식물 미네랄이 항산화 케어로, 얼굴결이 생기 있게 보이도록 돕습니다.",
      },
      {
        index: "03",
        title: "다당체",
        copy: "다당체가 수분을 붙잡고, 팩의 보습막이 자극 없이 머물게 합니다.",
      },
      {
        index: "04",
        title: "턴오버와 각질층",
        copy: "대략 한 달 주기의 턴오버가 흔들리지 않도록, 각질층 보습 균형을 돕습니다.",
      },
    ],
    scienceKicker: "삼투압",
    scienceHeading: "밀어 넣지 않고, 나가기 쉽게",
    scienceLead: "침투를 자랑하는 팩과 출발점이 다릅니다.",
    scienceCopy: [
      "성분을 각질 아래로 밀어 넣는 이야기보다, 삼투압으로 노폐물 배출과 순환을 돕는 이야기에 가깝습니다.",
      "아미노산과 당, 미네랄, 다당체가 그 순환 위에 보습과 항산화를 얹습니다.",
    ],
    howHeading: "사용 방법",
    howNote: "세안 후, 화장 전에 올리는 팩입니다.",
    howSteps: [
      "세안 후 물기를 가볍게 닦습니다.",
      "엔클로이 얼굴 팩을 얼굴에 펴 바르고, 잠시 그대로 둡니다.",
      "남은 제형은 가볍게 두드리거나, 미온수로 헹굽니다.",
    ],
    cautionHeading: "주의 사항",
    cautions: [
      "눈 주위와 점막을 피해 바르세요.",
      "사용 중 불편함이 있으면 씻어 내고 사용을 중단하세요.",
    ],
    ingredientsHeading: "성분 요약",
    ingredients:
      "아미노산, 당, 식물 미네랄, 다당체를 중심으로 한 페이스 팩입니다. 자세한 전성분은 제품 라벨을 확인해 주세요.",
  },
};

/**
 * Look up the long-form banner for a product.
 * Returns `undefined` when that product has no story yet — the PDP then
 * falls back to the short placeholder under the gallery.
 *
 * @param {string} productId
 * @returns {ProductBanner | undefined}
 */
export function getProductBanner(productId) {
  return bannersByProductId[productId];
}
