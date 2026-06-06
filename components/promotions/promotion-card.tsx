import { CalendarClock } from "lucide-react";
import { DishImage } from "@/components/dish-image";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { Promotion } from "@/lib/types";

export function PromotionCard({ promo }: { promo: Promotion }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden">
        <DishImage
          src={promo.image_url}
          alt={promo.title}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {promo.discount && (
          <Badge className="absolute top-3 left-3 border-transparent bg-primary text-base text-primary-foreground shadow-sm">
            {promo.discount}
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{promo.title}</h3>
        {promo.description && (
          <p className="mt-2 text-sm text-muted-foreground">
            {promo.description}
          </p>
        )}
        {promo.ends_at && (
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock className="size-4" /> Действует до{" "}
            {formatDate(promo.ends_at)}
          </p>
        )}
      </div>
    </article>
  );
}
