import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import { getLocations, getSiteContent } from "@/lib/queries";
import { LocationCard } from "@/components/contacts/location-card";
import { LocationsMap } from "@/components/contacts/locations-map";
import { EmptyState, ErrorState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Адреса 10 кафе AL-ABBOS в Челябинске, телефоны, часы работы и карта с маршрутами.",
};

export default async function ContactsPage() {
  const { data, error } = await getLocations();
  const note = await getSiteContent<{ text: string }>("contacts_note");
  const locations = data ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Контакты
        </h1>
        <p className="mt-3 text-muted-foreground">
          {note?.text ??
            "Звоните по общему номеру или постройте маршрут до ближайшей точки."}
        </p>
        <div className="mt-5">
          <Button render={<a href={SITE.phoneHref} />} size="lg">
            <Phone className="size-4" /> {SITE.phone}
          </Button>
        </div>
      </header>

      {error ? (
        <ErrorState description="Не получилось загрузить точки. Обновите страницу чуть позже." />
      ) : locations.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Точки не найдены"
          description="Администратор добавит адреса в админ-панели."
        />
      ) : (
        <div className="space-y-8">
          <LocationsMap locations={locations} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <LocationCard key={loc.id} loc={loc} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
