import { brand } from "./brand";

// Next.js는 process.env.NEXT_PUBLIC_* 를 빌드 때 문자열로 바꿔 넣는다.
// process.env[이름] 처럼 동적으로 읽으면 브라우저에 값이 안 넘어가니
// 아래처럼 변수 이름을 코드에 그대로 적어야 한다.
function publicEnv(value) {
  return (value ?? "").trim();
}

const phoneLabel = brand.companyTelLabel;
const phoneHref = brand.companyTelHref;

// 상호·주소·전화는 브랜드 가이드에 있는 값이다.
// 대표자, 사업자등록번호, 통신판매업 신고번호는 고객사 확인 전이라 빈칸으로 둔다.
export const business = {
  companyName: brand.companyName,
  representative: "[대표자명]",
  businessNumber: "[사업자등록번호]",
  mailOrderNumber: "[통신판매업 신고번호]",
  address: brand.companyAddress,
  phoneLabel,
  phoneHref,
  placeholderNote: "대괄호 항목은 고객사 정보 확인 후 기재합니다.",
  // 카카오·이메일·상담시간은 아직 미정이라 환경변수로만 받는다.
  // 빈 값은 화면에 그리지 않는다. 플레이스홀더 문구를 두지 말 것.
  inquiry: {
    kakaoChannelUrl: publicEnv(process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL),
    email: publicEnv(process.env.NEXT_PUBLIC_INQUIRY_EMAIL),
    hours: publicEnv(process.env.NEXT_PUBLIC_INQUIRY_HOURS),
    phoneLabel,
    phoneHref,
  },
};

export const inquiry = business.inquiry;

export const legalLinks = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/refund", label: "교환·환불" },
];
