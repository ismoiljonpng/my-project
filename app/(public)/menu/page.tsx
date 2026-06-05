import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/page-placeholder";

export const metadata: Metadata = { title: "Меню" };

export default function MenuPage() {
  return (
    <PagePlaceholder
      title="Меню"
      description="Полное меню с категориями, фото блюд, ценами и кнопкой «В корзину» появится на этапе 3."
    />
  );
}
