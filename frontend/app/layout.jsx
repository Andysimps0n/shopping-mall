import { Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import "./globals.css";

// Elegant high-contrast serif for the AnnChloe wordmark (matches reference logo).
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: "Ann Chloe · 앤클로에",
  description:
    "Ann Chloe Beauty People — 살롱이 큐레이션한 헤어, 두피, 스킨 케어 컬렉션.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className={playfair.variable}>
      <body>
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
