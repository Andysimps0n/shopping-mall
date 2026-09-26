import { business } from "./business";

/**
 * Customer-center FAQs. Answers only restate what the storefront
 * already says on checkout, terms, and refund pages. Do not add
 * delivery days, refund windows, or fees that those pages left blank.
 */
export const faqCategories = [
  { id: "all", label: "전체" },
  { id: "order", label: "주문/결제" },
  { id: "shipping", label: "배송" },
  { id: "returns", label: "교환/환불" },
  { id: "product", label: "상품" },
  { id: "member", label: "회원" },
];

export const faqs = [
  {
    id: "guest-order",
    category: "order",
    question: "비회원도 주문할 수 있나요?",
    answer:
      "주문은 카카오 또는 네이버로 로그인한 뒤에 할 수 있습니다. 비회원 결제는 없습니다.",
  },
  {
    id: "pay-methods",
    category: "order",
    question: "어떤 결제 수단을 쓰나요?",
    answer:
      "카카오페이와 네이버페이로 결제합니다. 몰은 카드번호를 저장하지 않습니다.",
  },
  {
    id: "pay-failed",
    category: "order",
    question: "결제가 실패하거나 취소되면 어떻게 되나요?",
    answer:
      "결제가 완료되지 않으면 장바구니와 입력한 배송지는 그대로 남아 있습니다. 같은 화면에서 다시 결제할 수 있습니다.",
  },
  {
    id: "who-ships",
    category: "shipping",
    question: "배송은 누가 하나요?",
    answer:
      "몰은 상품 정보를 보여 주고 주문을 받습니다. 배송은 몰이 직접 하지 않으며, 고객사가 주문 정보를 받아 발송합니다.",
  },
  {
    id: "track-ship",
    category: "shipping",
    question: "배송 조회는 어떻게 하나요?",
    answer:
      "발송 안내는 주문 내역에서 확인하는 것을 기준으로 합니다. 택배 조회 절차는 고객사 정책이 확정된 뒤에 안내합니다.",
  },
  {
    id: "return-how",
    category: "returns",
    question: "교환·환불은 어떻게 접수하나요?",
    answer: `교환·환불 접수 채널과 기간은 교환·환불 페이지의 초안을 따릅니다. 확정 전에는 고객센터 ${business.phoneLabel}로 문의해 주세요.`,
  },
  {
    id: "cancel-in-app",
    category: "returns",
    question: "화면에서 직접 결제를 취소할 수 있나요?",
    answer:
      "몰 화면에서 고객이 직접 취소하는 기능은 아직 없습니다. 결제 취소는 카카오페이 또는 네이버페이 결제 수단으로 진행됩니다.",
  },
  {
    id: "ingredients",
    category: "product",
    question: "제품 성분은 어디서 보나요?",
    answer:
      "각 제품 상세 페이지의 전성분 탭에서 확인할 수 있습니다.",
  },
  {
    id: "how-login",
    category: "member",
    question: "로그인은 어떻게 하나요?",
    answer:
      "프로필에서 네이버 또는 카카오로 로그인합니다. 로그인한 계정으로 주문과 주문 내역을 볼 수 있습니다.",
  },
  {
    id: "logout-where",
    category: "member",
    question: "로그아웃은 어디서 하나요?",
    answer: "프로필의 계정 관리 화면 아래에서 로그아웃할 수 있습니다.",
  },
];

export function filterFaqs(categoryId, query) {
  const needle = query.trim().toLowerCase();

  return faqs.filter((item) => {
    const inCategory = categoryId === "all" || item.category === categoryId;
    if (!inCategory) return false;
    if (!needle) return true;
    return (
      item.question.toLowerCase().includes(needle) ||
      item.answer.toLowerCase().includes(needle)
    );
  });
}
