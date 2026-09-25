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
