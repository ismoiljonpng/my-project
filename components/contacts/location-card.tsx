import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Location } from "@/lib/types";

export function LocationCard({ loc }: { loc: Location }) {
  const route =
    loc.lat != null && loc.lng != null
      ? `https://yandex.ru/maps/?rtext=~${loc.lat},${loc.lng}&rtt=auto`
      : `https://yandex.ru/maps/?text=${encodeURIComponent(`Челябинск, ${loc.address}`)}`;

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="font-semibold">{loc.name}</h3>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        <li className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> {loc.address}
        </li>
        {loc.phone && (
          <li className="flex items-start gap-2">
            <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
            <a
              href={`tel:${loc.phone.replace(/[^\d+]/g, "")}`}
              className="transition-colors hover:text-foreground"
            >
              {loc.phone}
            </a>
          </li>
        )}
        {loc.work_hours && (
          <li className="flex items-start gap-2">
            <Clock className="mt-0.5 size-4 shrink-0 text-primary" />{" "}
            {loc.work_hours}
          </li>
        )}
      </ul>
      <Button
        render={
          <a href={route} target="_blank" rel="noopener noreferrer" />
        }
        variant="outline"
        size="sm"
        className="mt-4 w-full"
      >
        <Navigation className="size-4" /> Построить маршрут
      </Button>
    </article>
  );
}
