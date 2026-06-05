import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Акции" };

export default function PromotionsPage() {
  return (
    <PagePlaceholder
      title="Акции"
      description="Актуальные акции и скидки из базы данных появятся на этапе 3."
    />
  );
}
