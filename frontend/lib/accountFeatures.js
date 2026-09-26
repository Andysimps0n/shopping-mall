import { profileCopy } from "./auth";
import { business } from "./business";

export const ACCOUNT_FEATURES = {
  password: {
    title: profileCopy.password,
    body: "카카오·네이버로 로그인한 경우 비밀번호는 해당 서비스에서 바꿉니다. 이메일 로그인의 비밀번호 변경은 아직 준비 중입니다.",
  },
  photo: {
    title: profileCopy.photo,
    body: profileCopy.featureSoon,
  },
  address: {
    title: profileCopy.address,
    body: "저장한 배송지는 주문할 때 골라 쓸 수 있습니다.",
  },
  leave: {
    title: profileCopy.leave,
    body: `회원 탈퇴는 아직 준비 중입니다. 급한 일은 고객센터 ${business.phoneLabel}로 연락해 주세요.`,
  },
};
