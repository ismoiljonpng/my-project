import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#b3450a] px-6 py-14 text-primary-foreground sm:px-12">
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Проголодались? Это быстро.
            </h2>
            <p className="mt-3 text-primary-foreground/90">
              Соберите корзину из любимых блюд — мы приготовим и привезём из
              ближайшей точки.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                render={<Link href="/menu" />}
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Заказать сейчас <ArrowRight className="size-4" />
              </Button>
              <Button
                render={<a href={SITE.phoneHref} />}
                size="lg"
                variant="outline"
                className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
              >
                <Phone className="size-4" /> {SITE.phone}
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
