import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { ORDER_STATUS, shortOrderId } from "@/lib/orders";
import type { Order, OrderItem } from "@/lib/types";

export const metadata: Metadata = { title: "Заказ оформлен" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const supabase = await createClient();

  let order: Order | null = null;
  let items: OrderItem[] = [];

  if (orderId) {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .maybeSingle();
    order = data;
    if (order) {
      const { data: its } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", orderId);
      items = its ?? [];
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
        <CircleCheck className="size-9" />
      </div>
      <h1 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">
        Заказ оформлен!
      </h1>

      {order ? (
        <>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-2 text-muted-foreground">
            Заказ № {shortOrderId(order.id)}
            <Badge className={ORDER_STATUS[order.status].badge}>
              {ORDER_STATUS[order.status].label}
            </Badge>
          </p>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left">
            <ul className="space-y-2 text-sm">
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
              <span className="font-semibold">Итого</span>
              <span className="text-lg font-bold">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Мы свяжемся для подтверждения. Следите за статусом в личном кабинете
            — он обновляется в реальном времени.
          </p>
        </>
      ) : (
        <p className="mt-3 text-muted-foreground">
          Спасибо за заказ! Мы свяжемся с вами для подтверждения.
        </p>
      )}

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button render={<Link href="/account" />} size="lg">
          Отслеживать заказ
        </Button>
        <Button render={<Link href="/menu" />} variant="outline" size="lg">
          Вернуться в меню
        </Button>
      </div>
    </div>
  );
}
