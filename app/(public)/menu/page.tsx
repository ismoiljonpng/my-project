import type { Metadata } from "next";
import { UtensilsCrossed } from "lucide-react";
import { getCategories, getMenuItems } from "@/lib/queries";
import { MenuBrowser } from "@/components/menu/menu-browser";
import { EmptyState, ErrorState } from "@/components/states";

export const metadata: Metadata = {
  title: "Меню",
  description:
    "Меню AL-ABBOS: плов, лагман, шашлык, самса, манты и напитки. Заказывайте с доставкой по Челябинску.",
};

export default async function MenuPage() {
  const [catsRes, itemsRes] = await Promise.all([
    getCategories(),
    getMenuItems(),
  ]);

  const error = catsRes.error || itemsRes.error;
  const categories = catsRes.data ?? [];
  const items = itemsRes.data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Меню
        </h1>
        <p className="mt-3 text-muted-foreground">
          Готовим из свежих продуктов каждый день. Соберите корзину — привезём
          из ближайшей к вам точки.
        </p>
      </header>

      {error ? (
        <ErrorState description="Не получилось загрузить меню. Обновите страницу чуть позже." />
      ) : items.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="Меню пока пустует"
          description="Блюда скоро появятся — администратор добавит их в админ-панели."
        />
      ) : (
        <MenuBrowser categories={categories} items={items} />
      )}
    </div>
  );
}
