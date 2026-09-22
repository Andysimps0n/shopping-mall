// Brand-page copy, taken from the AnnChloe catalog PDF and tightened
// for the web. Keep claims faithful to the source — do not invent
// medical guarantees or survey numbers that the PDF did not include.

/**
 * @typedef {object} BrandHighlight
 * @property {string} value  큰 숫자·짧은 표어
 * @property {string} label  아래 설명
 *
 * @typedef {object} BrandPillar
 * @property {string} index  표시용 번호 (01, 02, 03)
 * @property {string} title
 * @property {string} copy
 *
 * @typedef {object} BrandFreeItem
 * @property {string} id     아이콘을 고르는 키
 * @property {string} title  예: 무오일
 * @property {string} copy
 *
 * @typedef {object} BrandStat
 * @property {string} value
 * @property {string} label
 */

export const brand = {
  eyebrow: "BRAND",
  kicker: "AnnChloe Total Beauty",
  headingLine: "오직 천연만을 고집하는",
  heading: "앤클로이 화장품은 특별합니다",
  lead:
    "앤클로이는 살롱의 손길에서 시작된 뷰티 브랜드입니다. 무늬만 천연인 처방이 아니라, 빼야 할 여섯 가지를 뺀 퍼펙트 천연으로 헤어, 두피, 피부의 순환을 지킵니다.",

  /** @type {BrandHighlight[]} */
  highlights: [
    { value: "6無", label: "빼야 할 여섯 가지" },
    { value: "0%", label: "화학 성분" },
    { value: "천연", label: "퍼펙트 내추럴" },
  ],

  lineupImage: "/brand/lineup-hero.jpg",
  lineupAlt:
    "앤클로이 모이스춰 로션, 헤어 미스트, 두피 샴푸, 버블 워시, EGF 앰플, 스칼프 팩, 페이스 팩 라인업",

  storyKicker: "PHILOSOPHY",
  storyHeading: "앤클로이의 이유 있는 선택",
  storyLead:
    "어떻게 하면 피부 속 깊이 영양분을 넣을 수 있을까. 앤클로이는 이 질문을 내려놓았습니다. 피부는 원래 무엇이든 쉽게 들여보내지 않도록 장벽으로 막혀 있습니다. 억지로 넣으려면 보호막을 깨야 합니다.",
  storyCopy:
    "그래서 침투보다 순환에 포커스를 맞춥니다. 삼투압으로 배출을 돕고, 각질층을 건강하게 되돌려 28일 턴오버 리듬이 스스로 살아나게 하는 것이 앤클로이가 생각하는 건강한 피부입니다.",

  /** @type {BrandPillar[]} */
  pillars: [
    {
      index: "01",
      title: "침투가 아니라 순환",
      copy: "유효 성분을 억지로 밀어 넣지 않습니다. 막힌 모공을 비우고 배출 리듬을 살려, 피부와 두피가 본래의 순환을 되찾도록 돕습니다.",
    },
    {
      index: "02",
      title: "장벽을 지키는 도전",
      copy: "오일을 넣지 않으면 유화제도 넣을 필요가 없습니다. 방부제와 합성 계면활성제 없는 화장품으로, 각질층이 튼튼한 피부를 지키는 것이 앤클로이의 도전입니다.",
    },
    {
      index: "03",
      title: "입소문으로 자란 신뢰",
      copy: "즉각적인 효과를 내세우는 과대 광고가 아니라, 민감하고 문제성 피부를 가진 분들이 인정한 사용감과 입소문으로 천천히 성장해 왔습니다.",
    },
  ],

  freeKicker: "PERFECT NATURAL",
  freeHeading: "완벽한 천연을 실현했습니다",
  freeLead:
    "화학 성분을 배제해 두피와 피부에 부담을 덜었습니다. 여섯 가지를 빼는 6無가 앤클로이 처방의 출발점입니다.",

  /** @type {BrandFreeItem[]} */
  freeItems: [
    {
      id: "oil",
      title: "무오일",
      copy: "피부 알레르기와 모공 막힘을 부를 수 있는 오일은 한 방울도 넣지 않았습니다.",
    },
    {
      id: "preservative",
      title: "무방부제",
      copy: "피부 상재균의 활동을 떨어뜨리는 방부제를 넣지 않았습니다.",
    },
    {
      id: "alcohol",
      title: "무알코올",
      copy: "알코올은 자극이 되고 수분을 데려가 피부 장벽을 약하게 만들 수 있어 배제했습니다.",
    },
    {
      id: "surfactant",
      title: "무합성계면활성제",
      copy: "강한 알칼리성 합성 계면활성제 대신, 아미노산계 세정 성분을 사용합니다.",
    },
    {
      id: "color",
      title: "무색소",
      copy: "타르계 합성 색소가 줄 수 있는 자극을 피하기 위해 색소를 넣지 않습니다.",
    },
    {
      id: "fragrance",
      title: "무향료",
      copy: "합성 향료는 두피와 피부, 몸 전체에 부담이 될 수 있어 넣지 않았습니다.",
    },
  ],

  challengeKicker: "OUR CHALLENGE",
  challengeHeading: "알고 계신가요? 앤클로이의 도전",
  challengeLead:
    "화장품에 오일을 넣지 않으면 유화제를 넣을 필요가 없습니다. 방부제와 유화제 없는 화장품으로 건강한 피부를 지켜 내는 일이, 앤클로이가 말하는 정의로운 도전입니다.",
  challengeCopy:
    "피부 장벽인 각질층이 튼튼하면 자극에 덜 흔들리고, 쉽게 노화되지 않습니다. 그러나 유화제가 들어 있는 클렌저, 샴푸, 화장품을 오래 써 온 피부는 이 장벽이 약해지기 쉽습니다. 건강한 피부 가꾸기의 첫걸음은, 유화제 없는 화장품을 쓰는 것입니다.",

  /** @type {BrandPillar[]} */
  challengeItems: [
    {
      index: "01",
      title: "오일이 없으면 유화제도 없다",
      copy: "물과 기름을 억지로 섞지 않습니다. 오일 프리 처방은 합성 계면활성제를 빼는 출발점이기도 합니다.",
    },
    {
      index: "02",
      title: "각질층이 곧 보호막",
      copy: "장벽이 살아 있으면 자외선, 세균, 외부 자극에 덜 흔들립니다. 깨진 각질층은 민감함과 유수분 불균형으로 이어질 수 있습니다.",
    },
    {
      index: "03",
      title: "원인을 먼저 줄인다",
      copy: "유효 성분을 더 넣는 일보다, 장벽을 약하게 만들 수 있는 유화제와 오일을 빼는 일이 먼저입니다.",
    },
  ],

  mineralKicker: "PLANT MINERAL",
  mineralHeading: "식물 미네랄의 항산화 케어",
  mineralLead:
    "턴오버가 살아난 다음에는 항산화입니다. 독자적인 제법으로 추출한 식물 미네랄은 산화되는 피부와 두피에 강한 환원력으로 작동합니다.",
  mineralCopy:
    "산화 방지제로 자주 쓰는 비타민 C의 ORP는 약 +50mV 전후입니다. 앤클로이가 쓰는 야생 식물 미네랄은 최고 −600mV의 환원력을 가집니다. 피부 노화만 막을 것이 아니라, 두피도 함께 챙기자는 것이 앤클로이의 생각입니다.",
  mineralFootnote:
    "ORP는 산화 또는 환원력을 나타내는 단위(mV)입니다. 플러스는 산화력이, 마이너스는 환원력이 강한 것을 뜻합니다.",
  mineralPhoto: "/products/shampoo.jpg",
  mineralPhotoAlt: "앤클로이 두피 샴푸",
  mineralCompare: [
    { label: "야생 식물 미네랄", value: "−600 mV", note: "환원력 강" },
    { label: "비타민 C (아스코르빈산 Na)", value: "+50 mV", note: "대표 산화 방지제" },
  ],

  approachKicker: "OUR APPROACH",
  approachHeading: "건강한 피부와 두피를 위한 전제조건",
  approachLead:
    "문제성 피부와 두피는 유효 성분을 더 넣는 것만으로 해결되지 않습니다. 원인을 줄이고, 본래의 리듬을 되찾는 일이 먼저입니다.",

  /** @type {BrandPillar[]} */
  approachItems: [
    {
      index: "01",
      title: "배출과 순환",
      copy: "피부와 두피는 무엇이든 흡수하라고 만들어진 기관이 아닙니다. 노폐물이 나갈 길을 여는 것이 순기능에 가깝습니다.",
    },
    {
      index: "02",
      title: "보호막이 되는 각질층",
      copy: "각질층이 튼튼하면 외부 자극에 덜 흔들립니다. 화학 물질과 오일은 이 보호막을 약하게 만들 수 있습니다.",
    },
    {
      index: "03",
      title: "막히지 않은 모공",
      copy: "모공이 열려 있어야 숨 쉬는 피부와 두피가 됩니다. 오일 베이스 처방은 모공을 막는 큰 원인 중 하나입니다.",
    },
    {
      index: "04",
      title: "28일 턴오버 리듬",
      copy: "손상된 각질층을 되돌리고 막힌 모공을 열어, 약 28일 주기로 이어지는 턴오버가 다시 흐르게 하는 것이 목표입니다.",
    },
  ],

  vialKicker: "STERILE CARE",
  vialHeading: "멸균 화장품과 바이알 용기의 비밀",
  vialLead:
    "큰 용기에 담긴 화장품은 대부분 방부제를 포함합니다. 파라벤이 부담스러워 천연 방부제를 고르셨더라도, 피부에 직접 바르는 기초라면 이야기가 달라집니다.",
  vialCopy:
    "앤클로이는 합성 방부제와 천연 방부제 모두 피부 상재균의 활동을 방해할 수 있다고 생각합니다. 그래서 기초 제품은 소형 바이알에 담고, 충진 후 멸균 처리해 무방부제를 실현합니다.",
  vialPhoto: "/products/facepack.jpg",
  vialPhotoAlt: "앤클로이 페이스 팩 바이알",

  quoteKicker: "WORD OF MOUTH",
  quote:
    "즉각적인 효과를 내세우는 과대 광고가 아니라, 민감하고 문제성 피부를 가진 분들이 인정한 사용감과 입소문으로 천천히 성장해 왔습니다.",
  quoteCredit: "입소문으로 자란 앤클로이",

  forHeading: "이런 분들께 더 권합니다",
  forItems: [
    "피부 유수분 밸런스가 무너졌어요",
    "365일 트러블로 힘들어요",
    "피부가 예민하고 가려워요",
    "하얀 각질처럼 결이 늘 거칠어요",
    "발라도 속당김이 가시지 않아요",
    "온 가족이 쓸 수 있는 안심 제품을 찾고 있어요",
  ],

  statsHeading: "앤클로이 제품 사용 후 만족도",
  statsLead: "과대 광고가 아닌, 고객이 남긴 사용감입니다.",
  statsCaption: "* 앤클로이 고객 후기 기준, 자체 피부 변화와 사용감",

  /** @type {BrandStat[]} */
  stats: [
    { value: "100%", label: "저자극 만족도" },
    { value: "98%", label: "속당김 완화" },
    { value: "97%", label: "피부결 진정" },
    { value: "94%", label: "트러블 개선" },
  ],

  companyName: "(주)앤클로이 토탈뷰티",
  companyAddress: "경상북도 포항시 남구 대이로 45 (이수빌딩 9층)",
  companyTelLabel: "054.241.3336",
  companyTelHref: "tel:0542413336",
  companyCta: "컬렉션 보기",
  companyCtaHref: "/#collection",
};

// ---------------------------------------------------------------------------
// Editorial /brand page (2026 redesign).
//
// Same claim rules as above: every sentence is grounded in the catalog PDF
// copy already present in this file. No new certifications, tests, or
// numbers. Photos are not in yet — components render neutral placeholders,
// and `placeholderLabel` is the small label inside each frame.
// ---------------------------------------------------------------------------

export const brandPage = {
  nav: {
    wordmark: "ANNCHLOE",
    links: [
      { label: "Brand", href: "#brand-statement" },
      { label: "Principles", href: "#principles" },
      { label: "Products", href: "#products" },
    ],
    contact: { label: "Contact", href: "#contact" },
  },

  hero: {
    eyebrow: "SALON BORN",
    // \n marks the intended line break; rendered with white-space: pre-line.
    title: "살롱의 경험에서 시작한\n투명한 케어.",
    description:
      "앤클로이는 살롱의 손길에서 시작된 뷰티 브랜드입니다.\n빼야 할 여섯 가지를 뺀 처방으로 순환을 지킵니다.",
    ctaLabel: "브랜드 원칙 보기",
    ctaHref: "#principles",
    placeholderLabel: "Hero Image",
  },

  statement: {
    eyebrow: "BRAND STATEMENT",
    sentence:
      "무늬만 천연이 아니라, 빼야 할 여섯 가지를 뺀 퍼펙트 천연. 침투가 아니라 순환으로 헤어, 두피, 피부를 돌봅니다.",
  },

  origin: {
    eyebrow: "SALON ORIGIN",
    heading: "살롱에서 시작했습니다",
    paragraphs: [
      "앤클로이는 살롱의 손길에서 시작된 뷰티 브랜드입니다. 매일 두피와 모발을 만지는 자리에서, 제품이 남기고 가는 것들을 가장 가까이에서 보아 왔습니다.",
      "즉각적인 효과를 내세우는 과대 광고가 아니라, 민감하고 문제성 피부를 가진 분들이 인정한 사용감과 입소문으로 천천히 성장해 왔습니다.",
    ],
    placeholderLabel: "Salon Archive",
  },

  observation: {
    eyebrow: "OBSERVATION ARCHIVE",
    heading: "우리는 먼저 관찰했습니다.",
    items: [
      {
        index: "01",
        title: "두피에 남는 무거움",
        copy: "오일 베이스 처방은 모공을 막는 큰 원인 중 하나입니다. 씻어낸 뒤에도 남는 무거움을 먼저 기록했습니다.",
      },
      {
        index: "02",
        title: "반복되는 자극",
        copy: "방부제, 알코올, 합성 계면활성제는 피부 장벽과 상재균의 리듬을 흔들 수 있습니다. 자극이 반복되는 지점을 살폈습니다.",
      },
      {
        index: "03",
        title: "복잡한 사용 단계",
        copy: "단계를 더하는 케어보다, 원인을 빼는 케어가 먼저라고 판단했습니다. 그래서 처방에서 여섯 가지를 뺐습니다.",
      },
    ],
  },

  principles: {
    eyebrow: "PRODUCT PRINCIPLES",
    heading: "제품이 지키는 원칙",
    rows: [
      {
        term: "아미노산계 세정",
        detail:
          "강한 알칼리성 합성 계면활성제 대신 아미노산계 세정 성분을 사용합니다. 두피 보호막을 지키는 클린 세정이 기준입니다.",
      },
      {
        term: "6無 지향",
        detail:
          "무오일 · 무방부제 · 무알코올 · 무합성계면활성제 · 무색소 · 무향료. 여섯 가지를 빼는 것이 처방의 출발점입니다.",
      },
      {
        term: "무방부제의 방식",
        detail:
          "기초 제품은 소형 바이알에 담고 충진 후 멸균 처리합니다. 합성이든 천연이든, 방부제에 기대지 않는 구조를 택했습니다.",
      },
      {
        term: "성분과 사용법 공개",
        detail:
          "전성분과 사용 방법을 각 제품 상세 페이지에 그대로 공개합니다. 확인되지 않은 인증이나 수치는 싣지 않습니다.",
      },
    ],
  },

  ritual: {
    eyebrow: "RITUAL",
    heading: "사용의 리듬",
    placeholderLabel: "Ritual Image",
    steps: [
      {
        number: "01",
        title: "비우기",
        copy: "아미노산계 세정으로 노폐물을 부드럽게 씻어냅니다.",
      },
      {
        number: "02",
        title: "채우기",
        copy: "오일 없이 수분을 채워 결을 정돈합니다.",
      },
      {
        number: "03",
        title: "지키기",
        copy: "식물 미네랄의 환원력으로 산화되는 두피와 피부를 돌봅니다.",
      },
    ],
  },

  family: {
    eyebrow: "PRODUCT FAMILY",
    heading: "제품군",
    linkLabel: "자세히 보기",
    placeholderLabel: "Product Image",
  },

  transparency: {
    eyebrow: "TRANSPARENCY",
    heading: "확인할 수 있는 것만 말합니다",
    rows: [
      {
        term: "전성분",
        detail: "각 제품 상세 페이지의 INFORMATION 표에서 전성분을 공개합니다.",
      },
      {
        term: "사용 방법",
        detail: "제품별 사용 단계와 주의 사항을 상세 페이지에 그대로 싣습니다.",
      },
      {
        term: "제조 · 판매",
        detail:
          "(주)앤클로이 토탈뷰티 · 경상북도 포항시 남구 대이로 45 (이수빌딩 9층)",
      },
    ],
    closingSentence: "성분과 사용법을 직접 확인해 보세요.",
    ctaLabel: "컬렉션 보기",
    ctaHref: "/#collection",
  },
};
