import LoginPage from "@/components/LoginPage";

export const metadata = {
  title: "로그인, AnnChloe",
  description:
    "일반 구매자 또는 B2B 전용 계정으로 앤클로이에 로그인하세요. 네이버, 카카오, 구글, 이메일을 사용할 수 있습니다.",
};

export default function LoginRoute() {
  return <LoginPage />;
}
