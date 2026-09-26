import { notFound } from "next/navigation";
import AccountFeaturePage from "@/components/AccountFeaturePage";
import AddressBookPage from "@/components/AddressBookPage";
import { ACCOUNT_FEATURES } from "@/lib/accountFeatures";

export async function generateMetadata({ params }) {
  const { feature } = await params;
  const item = ACCOUNT_FEATURES[feature];
  if (!item) {
    return { title: "페이지를 찾을 수 없습니다, AnnChloe" };
  }
  return {
    title: `${item.title} · AnnChloe`,
  };
}

export default async function AccountFeatureRoute({ params }) {
  const { feature } = await params;
  if (!ACCOUNT_FEATURES[feature]) {
    notFound();
  }
  if (feature === "address") {
    return <AddressBookPage />;
  }
  return <AccountFeaturePage featureId={feature} />;
}
