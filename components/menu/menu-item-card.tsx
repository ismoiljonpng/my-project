import { DishImage } from "@/components/dish-image";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { AddToCartButton } from "./add-to-cart-button";

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <DishImage
          src={item.image_url}
          alt={item.name}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {item.is_popular && (
          <Badge className="absolute top-3 left-3 border-transparent bg-primary text-primary-foreground shadow-sm">
            Популярное
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold">{item.name}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold">{formatPrice(item.price)}</span>
        </div>
        <div className="mt-3">
          <AddToCartButton
            item={{
              id: item.id,
              name: item.name,
              price: item.price,
              imageUrl: item.image_url,
            }}
          />
        </div>
      </div>
    </article>
  );
}
