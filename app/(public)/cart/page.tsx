import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Корзина" };

export default function CartPage() {
  return (
    <PagePlaceholder
      title="Корзина"
      description="Корзина и оформление заказа появятся на этапе 4."
    />
  );
}
