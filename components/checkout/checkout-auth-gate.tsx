"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogIn, ShoppingBag, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, cartCount, cartTotal } from "@/lib/cart";
import { formatPrice } from "@/lib/format";

export function CheckoutAuthGate() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const items = useCart((s) => s.items);
  const count = mounted ? cartCount(items) : 0;
  const total = mounted ? cartTotal(items) : 0;

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
        <ShoppingBag className="size-7" />
      </div>
      <h2 className="mt-4 text-xl font-semibold">
        Войдите, чтобы оформить заказ
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {count > 0
          ? `Корзина сохранится: ${count} шт. на ${formatPrice(total)}. `
          : ""}
        Вход и регистрация занимают меньше минуты.
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <Button render={<Link href="/login?next=/checkout" />} size="lg">
          <LogIn className="size-4" /> Войти
        </Button>
        <Button
          render={<Link href="/register?next=/checkout" />}
          variant="outline"
          size="lg"
        >
          <UserPlus className="size-4" /> Зарегистрироваться
        </Button>
      </div>
    </div>
  );
}
