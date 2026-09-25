import LegalDocument from "@/components/LegalDocument";
import { business } from "@/lib/business";

export const metadata = {
  title: "개인정보처리방침 · AnnChloe",
  description: "앤클로이 스토어 개인정보처리방침 초안.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument eyebrow="PRIVACY" title="개인정보처리방침">
      <p>
        {business.companyName}는 앤클로이 스토어 주문에 필요한 개인정보만
        처리합니다. 아래는 개인정보보호위원회 작성 안내를 참고한 초안이며,
        보유 기간과 보호책임자 자리는 고객사가 채웁니다.
      </p>
      <h2>1. 수집 항목</h2>
      <ul>
        <li>소셜 로그인: 카카오 또는 네이버 식별자, 이름, 이메일</li>
        <li>배송지: 받는 사람, 연락처, 우편번호, 주소, 배송 메모</li>
        <li>주문 내역: 상품, 수량, 결제 금액, 주문 상태</li>
      </ul>
      <h2>2. 이용 목적</h2>
      <p>회원 식별, 주문 접수, 고객사 발송을 위한 주문 정보 전달, 고객 문의.</p>
      <h2>3. 결제 정보</h2>
      <p>
        카드번호 등 결제수단 정보는 몰이 저장하지 않습니다. 결제 처리는
        포트원과 카카오페이, 네이버페이가 수행합니다.
      </p>
      <h2>4. 처리 위탁</h2>
      <ul>
        <li>포트원: 결제 중개</li>
        <li>카카오페이: 결제</li>
        <li>네이버페이: 결제</li>
        <li>[호스팅/데이터베이스 수탁사]: 서비스 운영</li>
      </ul>
      <h2>5. 보유 기간</h2>
      <p>
        [회원 탈퇴 시까지 / 전자상거래법에 따른 주문·결제 기록 보존 기간].
        확정 전입니다.
      </p>
      <h2>6. 권리</h2>
      <p>
        정보주체는 자신의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.
        연락처: {business.phoneLabel} / [개인정보 보호책임자 이름, 이메일]
      </p>
    </LegalDocument>
  );
}
