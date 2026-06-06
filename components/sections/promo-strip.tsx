import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { PromotionCard } from "@/components/promotions/promotion-card";
import { Reveal } from "@/components/reveal";
import { getActivePromotions } from "@/lib/queries";

export async function PromoStrip() {
  const { data } = await getActivePromotions();
  const promos = (data ?? []).slice(0, 3);
  if (promos.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          align="left"
          eyebrow="Выгодно"
          title="Акции недели"
          description="Свежие предложения — скидки применяются автоматически."
          className="mb-0"
        />
        <Button
          render={<Link href="/promotions" />}
          variant="outline"
          className="hidden sm:inline-flex"
        >
          Все акции <ArrowRight className="size-4" />
        </Button>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promos.map((promo, i) => (
          <Reveal key={promo.id} delay={i * 0.05}>
            <PromotionCard promo={promo} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
