import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { MenuItemCard } from "@/components/menu/menu-item-card";
import { Reveal } from "@/components/reveal";
import { getPopularItems } from "@/lib/queries";

export async function PopularDishes() {
  const { data } = await getPopularItems(8);
  const items = data ?? [];
  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          align="left"
          eyebrow="Хиты"
          title="Популярные блюда"
          description="То, что у нас заказывают чаще всего."
          className="mb-0"
        />
        <Button
          render={<Link href="/menu" />}
          variant="outline"
          className="hidden sm:inline-flex"
        >
          Всё меню <ArrowRight className="size-4" />
        </Button>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.04}>
            <MenuItemCard item={item} />
          </Reveal>
        ))}
      </div>
      <div className="mt-8 sm:hidden">
        <Button render={<Link href="/menu" />} variant="outline" className="w-full">
          Всё меню <ArrowRight className="size-4" />
        </Button>
      </div>
    </section>
  );
}
