import LegalDocument from "@/components/LegalDocument";
import { business } from "@/lib/business";

export const metadata = {
  title: "이용약관 · AnnChloe",
  description: "앤클로이 스토어 이용약관 초안.",
};

export default function TermsPage() {
  return (
    <LegalDocument eyebrow="TERMS" title="이용약관">
      <p>
        이 약관은 {business.companyName}(이하 “몰”)가 운영하는 앤클로이 스토어에서
        판매하는 재화의 주문 조건을 정하기 위한 초안입니다. 공정거래위원회
        전자상거래 표준약관을 참고해 고객사가 상호, 연락처, 절차를 채운 뒤
        게시합니다.
      </p>
      <h2>1. 당사자</h2>
      <p>
        상호: {business.companyName}
        <br />
        대표자: {business.representative}
        <br />
        주소: {business.address}
        <br />
        전화: {business.phoneLabel}
        <br />
        이메일: [고객센터 이메일]
      </p>
      <h2>2. 서비스</h2>
      <p>
        몰은 재화의 정보를 제공하고 주문을 받습니다. 배송 업무는 몰이 직접 하지
        않으며, [고객사]가 주문 정보를 받아 발송합니다.
      </p>
      <h2>3. 주문과 결제</h2>
      <p>
        주문은 카카오 또는 네이버 로그인 후 할 수 있습니다. 결제 금액은 주문
        시점의 상품 가격과 배송비 설정으로 계산됩니다. 결제는 포트원, 카카오페이,
        네이버페이를 통해 진행됩니다. 몰은 카드번호를 저장하지 않습니다.
      </p>
      <h2>4. 청약철회</h2>
      <p>
        교환·환불의 기간, 비용, 접수 방법은 별도의 교환·환불 페이지에 둡니다.
        그 페이지의 빈칸이 채워지기 전에는 이 조항을 확정된 정책으로 보지
        않습니다.
      </p>
      <h2>5. 분쟁</h2>
      <p>
        분쟁은 [관할 법원]을 따릅니다. 관련 법령의 강행 규정은 이 초안보다
        우선합니다.
      </p>
    </LegalDocument>
  );
}
