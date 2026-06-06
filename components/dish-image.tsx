import Image from "next/image";
import { UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Фото блюда/акции с аккуратным фолбэком, когда image_url пуст
 * (владелец загрузит реальные фото через админку → Storage).
 * Размещать внутри контейнера с position: relative и заданной высотой.
 */
export function DishImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className,
}: {
  src?: string | null;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      className="pattern-east flex size-full items-center justify-center bg-gradient-to-br from-secondary to-accent"
      aria-hidden
    >
      <UtensilsCrossed className="size-10 text-primary/45" />
    </div>
  );
}
