// Long-form PDP storytelling banners, keyed by product id.
//
// Only products that have a banner entry get the editorial story under the
// gallery image. Other PDPs keep the short placeholder. Adding a new product
// banner later means appending another key here — the UI already knows how
// to render whatever this file returns.

/**
 * @typedef {object} BannerPillar
 * @property {string} title
 * @property {string} copy
 *
 * @typedef {object} BannerFreeItem
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
 * @typedef {object} ProductBanner
 * @property {string} kicker
 * @property {string} heading
 * @property {string} intro
 * @property {BannerPillar[]} pillars
 * @property {string} symptomsHeading
 * @property {string} symptomsLead
 * @property {string[]} symptoms
 * @property {string} freeHeading
 * @property {string} freeLead
 * @property {string[]} freeHighlights
 * @property {BannerFreeItem[]} freeItems
 * @property {string} pointsHeading
 * @property {string} pointsLead
 * @property {BannerPoint[]} points
 * @property {string} scienceKicker
 * @property {string} scienceHeading
 * @property {string} scienceLead
 * @property {string[]} scienceCopy
 * @property {string} scienceFootnote
 * @property {string} statsHeading
 * @property {string} statsLead
 * @property {string} statsCaption
 * @property {BannerStat[]} stats
 * @property {string} howHeading
 * @property {string} howNote
 * @property {string[]} howSteps
 * @property {string} cautionHeading
 * @property {string[]} cautions
 * @property {string} ingredientsHeading
 * @property {string} ingredients
 */

/** @type {Record<string, ProductBanner>} */
const bannersByProductId = {
  "silk-repair-shampoo": {
    kicker: "아미노산 두피 샴푸",
    heading: "두피를 자극 없이 비우고,\n모발이 설 자리를 만들다",
    intro:
      "앤클로이 두피 샴푸는 아미노산계 세정 성분으로, 두피 자극을 덜면서 기름때를 씻어냅니다. 인체를 구성하는 성분과 가까운 아미노산과 당, 그리고 다당류가 두피의 턴오버를 돕고, 아미노산계의 약한 세정력을 보완합니다. 막힌 모공을 맑게 비워, 모발이 두피에서 잘 자랄 수 있는 환경을 만듭니다.",
    pillars: [
      {
        title: "두피 진정 · 보호",
        copy: "예민해진 두피를 달래며, 매일의 세정에도 부담이 적도록 설계했습니다.",
      },
      {
        title: "항산화 식물 미네랄",
        copy: "독자 제법으로 추출한 식물 미네랄이 두피의 항산화 케어를 돕습니다.",
      },
      {
        title: "두피 보습",
        copy: "아미노산과 다당류가 수분을 잡아, 씻은 뒤에도 두피와 모발에 촉촉함을 남깁니다.",
      },
      {
        title: "화학성분 제로",
        copy: "합성 계면활성제, 방부제, 향료, 알코올, 색소, 오일을 넣지 않았습니다.",
      },
    ],
    symptomsHeading: "이런 신호가 있다면,\n지금 쓰는 샴푸를 점검해 보세요",
    symptomsLead:
      "두피에서 아래와 같은 증상이 반복된다면, 사용 중인 샴푸를 바꿔 볼 시점입니다.",
    symptoms: [
      "두피와 모발이 매우 건조하고, 윤기와 찰랑거림이 없다",
      "두피가 가렵고 뾰루지가 생긴다",
      "샴푸 후 머리카락이 금방 축축해진다",
      "두피가 붉고 아프다",
      "어깨 라인에 하얀 각질이 내려앉는다",
      "머리카락이 가늘고 힘이 없다",
      "두피가 기름지고 냄새가 난다",
    ],
    freeHeading: "화학 성분을 비우고,\n천연에 가까운 처방을 지향합니다",
    freeLead:
      "넣을 것을 더하기보다, 두피에 부담이 될 수 있는 여섯 가지를 먼저 뺐습니다.",
    freeHighlights: ["6無", "화학성분 0%", "천연 지향"],
    freeItems: [
      {
        title: "무오일",
        copy: "피부 알레르기나 모공 막힘을 부를 수 있는 오일은 한 방울도 넣지 않았습니다.",
      },
      {
        title: "무방부제",
        copy: "생체 활성을 떨어뜨릴 수 있는 방부제를 배제했습니다.",
      },
      {
        title: "무향료",
        copy: "감작을 일으킬 수 있는 합성 향료를 넣지 않아, 두피와 바디 모두에 부담을 덜었습니다.",
      },
      {
        title: "무알코올",
        copy: "장기 사용 시 피부를 자극하고 수분을 날릴 수 있는 알코올을 배제했습니다.",
      },
      {
        title: "무색소",
        copy: "모발 손상·알레르기를 유발할 수 있는 합성 색소를 넣지 않았습니다.",
      },
      {
        title: "무합성계면활성제",
        copy: "SLS처럼 강한 알칼리성 합성 계면활성제 대신, 아미노산계 세정 성분을 사용합니다.",
      },
    ],
    pointsHeading: "앤클로이 샴푸로\n건강해지는 두피",
    pointsLead: "피부 턴오버를 도와, 장벽이 제 역할을 하도록 케어합니다.",
    points: [
      {
        index: "01",
        title: "샴푸만으로 보습",
        copy: "아미노산과 다당류가 대기 중 수분을 흡수해, 린스 없이도 모발에 수분이 남도록 돕습니다.",
      },
      {
        index: "02",
        title: "강력한 항산화",
        copy: "독자 제법으로 추출한 식물 미네랄이 항산화 케어로, 두피를 오래 건강하게 유지하도록 돕습니다.",
      },
      {
        index: "03",
        title: "샴푸 하나로 올인원",
        copy: "샴푸는 물론 바디워시도 겸할 수 있습니다. 온 가족이 쓰는 All Light, All in One 처방입니다.",
      },
    ],
    scienceKicker: "식물 미네랄",
    scienceHeading: "항산화로 두피의 시간을 돌보다",
    scienceLead: "피부 노화만 막으셨나요. 두피도 함께 돌봐 주세요.",
    scienceCopy: [
      "두피를 젊게 유지하는 가장 확실한 방법 중 하나는 항산화 케어입니다. 야생 식물에서 추출한 식물 미네랄이, 산화되는 두피에 항산화 부스터로 작용하도록 설계했습니다.",
      "대표적인 산화 방지제 아스코르빈산나트륨(비타민 C)의 ORP는 사용 후 약 +50mV입니다. 식물 미네랄은 약 −600mV의 환원력을 지니며, 강한 환원력의 슈퍼 에너지로 웨이스팩에 가장 많이 함유되어 있습니다.",
    ],
    scienceFootnote:
      "ORP는 산화 또는 환원력을 나타내는 단위(mV)입니다. 플러스는 산화력이, 마이너스는 환원력이 강한 것을 뜻합니다.",
    statsHeading: "사용 후 피부 변화와\n제품 만족도",
    statsLead:
      "세 달간의 사용 설문에서, 두피 컨디션과 만족도를 이렇게 답했습니다.",
    statsCaption: "20–59세 여성·남성, 3개월 사용 후 설문 평가. 개인차가 있을 수 있습니다.",
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
      "두피나 모발에 유분·화학 성분이 많으면 거품이 잘 나지 않습니다. 물로 노폐물을 충분히 씻은 뒤 샴푸하세요.",
    howSteps: [
      "미온수로 머리를 적신 다음, 샴푸를 손바닥에 따라 두피와 모발에 바르고, 손가락 지문 면으로 아주 부드럽게 두피를 눌러 마사지합니다.",
      "엄지와 검지로 두피를 감싸 안고, 정수리 쪽으로 힘을 주며 짜 올라갑니다. (1–2분)",
      "미온수로 헹굽니다.",
      "다시 한 번 샴푸를 손에 따라 두피에 바르고 거품을 낸 뒤, 3분 정도 그대로 둡니다.",
      "미온수로 깨끗이 헹구고, 수건으로 물기를 제거한 다음 드라이로 말립니다.",
    ],
    cautionHeading: "주의 사항",
    cautions: [
      "마사지할 때 두피를 비비지 마세요. 다당체는 입자가 커서, 비비면 자극이 될 수 있습니다.",
      "젖은 모발은 브러싱하지 말고, 완전히 말린 뒤 빗질하세요. (모발 큐티클 보호)",
      "모공 기능을 위해 더블 샴푸를 권합니다.",
    ],
    ingredientsHeading: "전성분",
    ingredients:
      "정제수, 소듐코코일글루타메이트, 포타슘코코일글루타메이트, 글루코오스, 덱스트린, 카프릴릴글라이콜, 베타인, 하이드록시에칠셀룰로오스, 알지닌, 글라이신, 알라닌, 류신, 블래더랙알지추출물, 자이언트켈프추출물, 참미역추출물, 사르가숨필리네들리스추출물, 구주조나무껍질추출물, 삼나무껍질추출물, 쓴쑥추출물, 산백초잎/뿌리추출물",
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
