"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart, type CartItem } from "@/lib/cart";

export function AddToCartButton({ item }: { item: Omit<CartItem, "qty"> }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const qty = useCart((s) => s.items.find((i) => i.id === item.id)?.qty ?? 0);
  const add = useCart((s) => s.add);
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);

  // До гидрации показываем кнопку «В корзину» (совпадает с серверным рендером).
  if (!mounted || qty === 0) {
    return (
      <Button
        className="w-full"
        onClick={() => {
          add(item);
          toast.success(`«${item.name}» — в корзине`);
        }}
      >
        <ShoppingCart className="size-4" /> В корзину
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => dec(item.id)}
        aria-label="Убрать одну порцию"
      >
        <Minus className="size-4" />
      </Button>
      <span className="min-w-8 text-center font-semibold tabular-nums">
        {qty}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => inc(item.id)}
        aria-label="Добавить ещё порцию"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
