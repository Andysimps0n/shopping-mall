import LegalDocument from "@/components/LegalDocument";
import { business } from "@/lib/business";

export const metadata = {
  title: "교환·환불 · AnnChloe",
  description: "앤클로이 스토어 교환·환불 정책 초안.",
};

export default function RefundPage() {
  return (
    <LegalDocument eyebrow="RETURNS" title="교환·환불">
      <p>
        고객사 스마트스토어의 교환·환불 정책을 이 자리에 옮깁니다. 아래 문장은
        정책 원문이 아니며, 반품 배송비와 접수 방법은 고객사 확인 후에만
        확정합니다.
      </p>
      <h2>접수</h2>
      <p>
        교환·환불 접수: [접수 채널, 예를 들어 고객센터 {business.phoneLabel} 또는
        이메일]
        <br />
        접수 가능 기간: [고객사 정책]
      </p>
      <h2>배송비</h2>
      <p>반품 배송비: [금액 또는 조건]. 이 숫자를 임의로 적지 않았습니다.</p>
      <h2>제한</h2>
      <p>
        [개봉, 사용, 고객 귀책 등 청약철회가 제한되는 경우를 고객사 정책 원문대로
        적습니다.]
      </p>
      <h2>환불</h2>
      <p>
        결제 취소는 카카오페이 또는 네이버페이 결제 수단으로 진행됩니다. 몰
        화면에서 고객이 직접 취소하는 기능은 아직 없습니다.
      </p>
    </LegalDocument>
  );
}
