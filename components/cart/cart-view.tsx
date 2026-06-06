"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DishImage } from "@/components/dish-image";
import { useCart, cartTotal, cartCount } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

const FREE_DELIVERY_FROM = 1500;

function Row({
  id,
  name,
  price,
  imageUrl,
  qty,
}: {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  qty: number;
}) {
  const inc = useCart((s) => s.inc);
  const dec = useCart((s) => s.dec);
  const remove = useCart((s) => s.remove);

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-border">
        <DishImage src={imageUrl} alt={name} sizes="80px" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{formatPrice(price)}</p>
        <div className="mt-2 flex w-fit items-center gap-1 rounded-lg border border-border p-0.5">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => dec(id)}
            aria-label="Меньше"
          >
            <Minus className="size-4" />
          </Button>
          <span className="min-w-8 text-center text-sm font-semibold tabular-nums">
            {qty}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => inc(id)}
            aria-label="Больше"
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="font-semibold">{formatPrice(price * qty)}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => remove(id)}
          aria-label={`Удалить ${name}`}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export function CartView() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);

  if (!mounted) {
    return (
      <div className="h-64 animate-pulse rounded-2xl border border-border bg-card" />
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
        <div className="grid size-16 place-items-center rounded-2xl bg-secondary text-primary">
          <ShoppingCart className="size-8" />
        </div>
        <h2 className="text-xl font-semibold">Корзина пуста</h2>
        <p className="max-w-sm text-muted-foreground">
          Добавьте блюда из меню — и оформите доставку из ближайшей точки.
        </p>
        <Button render={<Link href="/menu" />} size="lg" className="mt-2">
          Перейти в меню <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  const total = cartTotal(items);
  const count = cartCount(items);
  const freeDelivery = total >= FREE_DELIVERY_FROM;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="divide-y divide-border rounded-2xl border border-border bg-card px-5">
        {items.map((it) => (
          <Row key={it.id} {...it} />
        ))}
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-20">
        <h2 className="text-lg font-semibold">Итого</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">
              Блюда ({count} шт.)
            </dt>
            <dd className="font-medium">{formatPrice(total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Доставка</dt>
            <dd className="font-medium">
              {freeDelivery ? (
                <span className="text-teal">Бесплатно</span>
              ) : (
                `от ${formatPrice(FREE_DELIVERY_FROM)} — бесплатно`
              )}
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-border pt-4">
          <span className="font-semibold">К оплате</span>
          <span className="text-xl font-bold">{formatPrice(total)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Оплата при получении — наличными или картой курьеру.
        </p>
        <Button
          render={<Link href="/checkout" />}
          size="lg"
          className="mt-5 w-full"
        >
          Оформить заказ <ArrowRight className="size-4" />
        </Button>
        <Button
          variant="ghost"
          className="mt-2 w-full text-muted-foreground"
          onClick={() => clear()}
        >
          Очистить корзину
        </Button>
      </aside>
    </div>
  );
}
