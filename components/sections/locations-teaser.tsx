import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { getLocations } from "@/lib/queries";

export async function LocationsTeaser() {
  const { data } = await getLocations();
  const locations = data ?? [];
  if (locations.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                Рядом с вами
              </p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                {locations.length} точек по Челябинску
              </h2>
              <p className="mt-3 text-muted-foreground">
                Готовим в ближайшей к вам точке — поэтому блюда приезжают
                горячими. Постройте маршрут или закажите доставку.
              </p>
              <Button render={<Link href="/contacts" />} className="mt-6">
                <MapPin className="size-4" /> Смотреть на карте
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {locations.slice(0, 8).map((l) => (
                <span
                  key={l.id}
                  className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground"
                >
                  {l.name.replace("AL-ABBOS на ", "")}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
