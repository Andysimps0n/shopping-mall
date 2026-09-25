import { brand } from "./brand";

// 상호·주소·전화는 브랜드 가이드에 있는 값이다.
// 대표자, 사업자등록번호, 통신판매업 신고번호는 고객사 확인 전이라 빈칸으로 둔다.
export const business = {
  companyName: brand.companyName,
  representative: "[대표자명]",
  businessNumber: "[사업자등록번호]",
  mailOrderNumber: "[통신판매업 신고번호]",
  address: brand.companyAddress,
  phoneLabel: brand.companyTelLabel,
  phoneHref: brand.companyTelHref,
  placeholderNote: "대괄호 항목은 고객사 정보 확인 후 기재합니다.",
};

export const legalLinks = [
  { href: "/terms", label: "이용약관" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/refund", label: "교환·환불" },
];
