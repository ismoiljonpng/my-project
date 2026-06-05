import Link from "next/link";
import { ArrowRight, MapPin, Soup } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroAurora } from "@/components/backgrounds/hero-aurora";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <HeroAurora />
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur">
            <Soup className="size-4 text-primary" /> Настоящая узбекская кухня ·{" "}
            {SITE.city}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Вкус Востока с доставкой по Челябинску
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-pretty text-muted-foreground">
            Плов из казана, горячая самса из тандыра, наваристый лагман. Готовим
            как дома и привозим из ближайшей к вам точки — без агрегаторов и
            переплат.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              render={<Link href="/menu" />}
              size="lg"
              className="w-full sm:w-auto"
            >
              Смотреть меню <ArrowRight className="size-4" />
            </Button>
            <Button
              render={<Link href="/promotions" />}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Акции и скидки
            </Button>
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-teal" /> 10 точек рядом · доставка от
            60 минут
          </p>
        </div>
      </div>
    </section>
  );
}
