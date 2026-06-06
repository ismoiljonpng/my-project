import type { Metadata } from "next";
import { BadgePercent } from "lucide-react";
import { getActivePromotions } from "@/lib/queries";
import { PromotionCard } from "@/components/promotions/promotion-card";
import { EmptyState, ErrorState } from "@/components/states";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Акции",
  description: "Актуальные акции и скидки AL-ABBOS в Челябинске.",
};

export default async function PromotionsPage() {
  const { data, error } = await getActivePromotions();
  const promos = data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Акции и скидки
        </h1>
        <p className="mt-3 text-muted-foreground">
          Выгодные предложения недели. Скидки применяются автоматически при
          оформлении заказа.
        </p>
      </header>

      {error ? (
        <ErrorState description="Не получилось загрузить акции. Обновите страницу чуть позже." />
      ) : promos.length === 0 ? (
        <EmptyState
          icon={BadgePercent}
          title="Пока без акций"
          description="Скоро здесь появятся выгодные предложения — заглядывайте позже."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {promos.map((promo, i) => (
            <Reveal key={promo.id} delay={i * 0.05}>
              <PromotionCard promo={promo} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
