// Long-form PDP storytelling banners, keyed by product id.
// Only products with an entry here get the editorial banner. Others keep
// the short tagline fallback in ProductDetailBanner.

/**
 * @typedef {object} BannerBenefit
 * @property {string} index
 * @property {string} title
 * @property {string} body
 *
 * @typedef {object} BannerFreeItem
 * @property {string} title
 * @property {string} body
 *
 * @typedef {object} BannerPoint
 * @property {string} index
 * @property {string} title
 * @property {string} body
 *
 * @typedef {object} BannerStat
 * @property {string} value
 * @property {string} label
 *
 * @typedef {object} BannerStep
 * @property {string} index
 * @property {string} body
 *
 * @typedef {object} ProductBanner
 * @property {string} eyebrow
 * @property {string} kicker
 * @property {string} headline
 * @property {string} lede
 * @property {string[]} formula
 * @property {string} symptomsEyebrow
 * @property {string} symptomsHeading
 * @property {string} symptomsLede
 * @property {string[]} symptoms
 * @property {string} benefitsHeading
 * @property {BannerBenefit[]} benefits
 * @property {string} freeEyebrow
 * @property {string} freeHeading
 * @property {string} freeLede
 * @property {BannerFreeItem[]} freeFrom
 * @property {string} pointsHeading
 * @property {string} pointsLede
 * @property {BannerPoint[]} points
 * @property {string} scienceEyebrow
 * @property {string} scienceHeading
 * @property {string} scienceLede
 * @property {string[]} science
 * @property {string} orpNote
 * @property {{ label: string, value: string, hint: string }[]} orpCompare
 * @property {string} statsEyebrow
 * @property {string} statsHeading
 * @property {string} statsLede
 * @property {BannerStat[]} stats
 * @property {string} howToHeading
 * @property {string} howToTip
 * @property {BannerStep[]} steps
 * @property {string} cautionHeading
 * @property {string[]} cautions
 * @property {string} ingredientsHeading
 * @property {string} ingredients
 */

/** @type {Record<string, ProductBanner>} */
export const productBanners = {
  "silk-repair-shampoo": {
    eyebrow: "SCALP CARE",
    kicker: "엔클로이 두피 샴푸",
    headline: "두피가 숨 쉴 자리를\n다시 만듭니다",
    lede: "아미노산 세정으로 자극은 덜고, 매일의 샴푸가 두피 환경을 정돈합니다.",
    formula: [
      "엔클로이 두피 샴푸는 아미노산 계열 세정 성분으로, 두피 자극을 덜면서 유분을 씻어냅니다. 인체를 구성하는 성분과 가까운 아미노산과 당, 미네랄이 두피의 턴오버를 돕고, 다당류가 세정력을 부드럽게 보완합니다.",
      "막힌 모공을 맑게 비워 모발이 두피에 자리 잡을 수 있는 환경을 조성하는 데일리 샴푸입니다.",
    ],
    symptomsEyebrow: "CHECKLIST",
    symptomsHeading: "이런 두피라면,\n세정을 다시 살펴보세요",
    symptomsLede:
      "아래와 같은 느낌이 반복된다면, 지금 쓰는 샴푸를 바꿔 볼 시점일 수 있습니다.",
    symptoms: [
      "두피와 모발이 매우 건조하고 윤기와 찰기가 없다",
      "두피가 가렵고 뾰루지가 생긴다",
      "샴푸 후에도 머리카락이 금방 가라앉는다",
      "두피가 붉고 아프다",
      "어깨 라인에 하얀 각질이 내려앉는다",
      "머리카락이 가늘고 힘이 없다",
      "두피가 기름지고 냄새가 난다",
    ],
    benefitsHeading: "네 가지로 정리한 케어",
    benefits: [
      {
        index: "01",
        title: "두피 진정 · 보호",
        body: "매일의 세정이 자극으로 남지 않도록, 두피 컨디션을 차분히 다룹니다.",
      },
      {
        index: "02",
        title: "항산화 식물 미네랄",
        body: "독자 제법으로 추출한 식물 미네랄이 두피 환경에 항산화 케어를 더합니다.",
      },
      {
        index: "03",
        title: "두피 보습",
        body: "아미노산과 다당류가 수분감을 붙잡아, 씻은 뒤에도 당김을 덜어 줍니다.",
      },
      {
        index: "04",
        title: "화학 성분 배제",
        body: "오일 · 방부제 · 향료 · 알코올 · 색소 · 합성 계면활성제를 넣지 않았습니다.",
      },
    ],
    freeEyebrow: "6 FREE",
    freeHeading: "넣지 않은 여섯 가지",
    freeLede:
      "두피에 부담이 될 수 있는 성분은 처음부터 빼는 쪽을 택했습니다.",
    freeFrom: [
      {
        title: "무오일",
        body: "피부 알레르기와 모공 막힘을 부를 수 있는 오일은 한 방울도 넣지 않았습니다.",
      },
      {
        title: "무방부제",
        body: "방부제를 배제하고, 두피가 받는 부담을 줄이는 처방을 지향합니다.",
      },
      {
        title: "무향료",
        body: "합성 향료 없이, 세정 본연의 사용감에 집중합니다.",
      },
      {
        title: "무알코올",
        body: "장기간 사용 시 수분 증발과 장벽 약화를 부를 수 있는 알코올을 넣지 않았습니다.",
      },
      {
        title: "무색소",
        body: "타르계를 비롯한 합성 색소는 사용하지 않습니다.",
      },
      {
        title: "무합성계면활성제",
        body: "SLS처럼 자극이 큰 합성 계면활성제 대신, 아미노산 계열 세정 성분을 씁니다.",
      },
    ],
    pointsHeading: "샴푸 하나로 이어지는 루틴",
    pointsLede: "보습, 항산화, 올인원. 세 가지를 한 병에 담았습니다.",
    points: [
      {
        index: "01",
        title: "샴푸만으로 보습",
        body: "아미노산과 다당류가 대기 중 수분을 붙잡아 모발에 수분감을 남깁니다. 린스 없이도 결이 가라앉지 않도록 설계했습니다.",
      },
      {
        index: "02",
        title: "항산화 케어",
        body: "독자 제법으로 추출한 식물 미네랄은 강력한 항산화 물질로, 오래 쓰는 데일리 케어에 맞춰져 있습니다.",
      },
      {
        index: "03",
        title: "올인원 세정",
        body: "헤어는 물론 세안과 바디까지 부담 없이 쓸 수 있는 All Light, All in One 샴푸입니다.",
      },
    ],
    scienceEyebrow: "PLANT MINERAL",
    scienceHeading: "식물 미네랄의\n항산화 이야기",
    scienceLede: "피부 노화만 생각하셨나요. 두피도 같은 공기가 닿습니다.",
    science: [
      "두피를 건강하게 유지하는 확실한 방법 중 하나는 항산화 케어입니다. 야생 식물에서 추출한 식물 미네랄은 산화되기 쉬운 두피 환경에 항산화 부스터로 작용하도록 설계되었습니다.",
      "대표적인 산화 방지제인 아스코르빈산나트륨(비타민 C)의 ORP는 약 +50mV 전후입니다. 식물 미네랄은 최고 −600mV 수준의 환원력을 가지며, 페이스 팩에도 쓰이는 에너지입니다.",
    ],
    orpNote:
      "ORP는 산화·환원력을 나타내는 단위(mV)입니다. 플러스는 산화력, 마이너스는 환원력이 강함을 뜻합니다.",
    orpCompare: [
      {
        label: "비타민 C",
        value: "+50mV",
        hint: "ORP 전후",
      },
      {
        label: "식물 미네랄",
        value: "−600mV",
        hint: "강한 환원력",
      },
    ],
    statsEyebrow: "3 MONTHS",
    statsHeading: "사용 후 피부 변화와\n제품 만족도",
    statsLede: "20–59세 여성·남성, 3개월 사용 후 설문 평가.",
    stats: [
      { value: "96%", label: "두피 각질이 줄었다" },
      { value: "95%", label: "두피 가려움이 개선되었다" },
      { value: "97%", label: "두피 컨디셔닝이 좋아졌다" },
      { value: "93%", label: "과다한 유분이 줄었다" },
      { value: "100%", label: "제품 사용에 만족한다" },
      { value: "95%", label: "지인에게 추천한 적 있다" },
    ],
    howToHeading: "더블 샴푸로 쓰는 법",
    howToTip:
      "두피나 모발에 노폐물·유분·잔여 성분이 많으면 거품이 잘 나지 않습니다. 미온수로 충분히 적신 뒤 샴푸하세요.",
    steps: [
      {
        index: "01",
        body: "미온수로 모발을 적신 뒤, 손바닥에 샴푸를 따라 두피와 모발에 바릅니다. 손끝으로 문지르지 말고, 손가락 지면으로 두피를 부드럽게 압박하며 마사지합니다.",
      },
      {
        index: "02",
        body: "엄지와 검지로 두피를 감싸 안고, 정수리 쪽으로 1–2분 천천히 짜 올라갑니다.",
      },
      {
        index: "03",
        body: "미온수로 헹굽니다.",
      },
      {
        index: "04",
        body: "한 번 더 샴푸를 덜어 두피에 바르고 거품을 낸 뒤, 약 3분 그대로 둡니다.",
      },
      {
        index: "05",
        body: "미온수로 깨끗이 헹군 다음, 타월로 물기를 제거하고 드라이로 말립니다.",
      },
    ],
    cautionHeading: "주의사항",
    cautions: [
      "마사지할 때 두피를 비비지 마세요. 각질 입자가 커서, 비비면 자극이 될 수 있습니다.",
      "젖은 모발은 브러시하지 말고, 완전히 말린 뒤 빗질하세요. 큐티클을 지키는 습관입니다.",
      "모공 케어를 위해 더블 샴푸를 권합니다.",
    ],
    ingredientsHeading: "성분",
    ingredients:
      "정제수, 소듐코코일글루타메이트, 포타슘코코일글루타메이트, 글루코오스, 덱스트린, 카프릴릴글라이콜, 베타인, 하이드록시에칠셀룰로오스, 알지닌, 글라이신, 알라닌, 류신, 블래더랙엘지추출물, 자이언트켈프추출물, 점미역추출물, 사르가숨필리덴둘라추출물, 구주가죽무껍질추출물, 삼나무껍질추출물, 쓴쑥추출물, 산백초잎/뿌리추출물",
  },
};

export function getProductBanner(productId) {
  return productBanners[productId] ?? null;
}
