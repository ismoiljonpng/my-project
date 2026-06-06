"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useCart, cartTotal, cartCount } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { createOrder } from "@/app/(public)/checkout/actions";
import type { Location } from "@/lib/types";

export function CheckoutForm({
  locations,
  defaultPhone,
}: {
  locations: Location[];
  defaultPhone: string;
}) {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [pending, startTransition] = useTransition();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(defaultPhone);
  const [locationId, setLocationId] = useState(locations[0]?.id ?? "");
  const [comment, setComment] = useState("");
  const [payment, setPayment] = useState<"cash" | "card">("cash");

  const total = cartTotal(items);
  const count = cartCount(items);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border p-12 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
          <ShoppingCart className="size-7" />
        </div>
        <p className="font-semibold">Корзина пуста</p>
        <p className="text-sm text-muted-foreground">
          Добавьте блюда из меню, чтобы оформить заказ.
        </p>
        <Button render={<Link href="/menu" />}>Перейти в меню</Button>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const res = await createOrder({
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        location_id: locationId,
        delivery_address: address,
        phone,
        comment,
        payment_method: payment,
      });
      if (res.ok) {
        clear();
        toast.success("Заказ оформлен! Мы свяжемся для подтверждения.");
        router.push(`/checkout/success?order=${res.orderId}`);
      } else if (res.needAuth) {
        router.push("/login?next=/checkout");
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_360px]"
    >
      <div className="space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="address">Адрес доставки</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            autoComplete="street-address"
            placeholder="Улица, дом, подъезд, квартира"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="location">Готовить с точки</Label>
          <select
            id="location"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            required
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {locations.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} — {l.address}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Выберите ближайшую точку — оттуда привезём заказ горячим.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="comment">Комментарий к заказу</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Например: домофон не работает, позвоните заранее (необязательно)"
          />
        </div>

        <div className="space-y-2">
          <Label>Способ оплаты</Label>
          <RadioGroup
            value={payment}
            onValueChange={(v) => setPayment(String(v) as "cash" | "card")}
            className="grid gap-2 sm:grid-cols-2"
          >
            {(
              [
                { value: "cash", label: "Наличными при получении" },
                { value: "card", label: "Картой курьеру" },
              ] as const
            ).map((opt) => (
              <Label
                key={opt.value}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-medium transition-colors",
                  payment === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent",
                )}
              >
                <RadioGroupItem value={opt.value} />
                {opt.label}
              </Label>
            ))}
          </RadioGroup>
          <p className="text-xs text-muted-foreground">
            Онлайн-оплату подключим позже. Пока — оплата при получении.
          </p>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-20">
        <h2 className="text-lg font-semibold">Ваш заказ</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between gap-3">
              <span className="text-muted-foreground">
                {it.name} × {it.qty}
              </span>
              <span className="font-medium tabular-nums">
                {formatPrice(it.price * it.qty)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4">
          <span className="font-semibold">Итого ({count} шт.)</span>
          <span className="text-xl font-bold">{formatPrice(total)}</span>
        </div>
        <Button
          type="submit"
          size="lg"
          className="mt-5 w-full"
          disabled={pending}
        >
          {pending ? (
            "Оформляем…"
          ) : (
            <>
              Подтвердить заказ <ArrowRight className="size-4" />
            </>
          )}
        </Button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Нажимая кнопку, вы соглашаетесь на обработку заказа.
        </p>
      </aside>
    </form>
  );
}
