"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, CircleSlash } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ORDER_FLOW,
  ORDER_STATUS,
  PAYMENT_LABEL,
  shortOrderId,
  statusStep,
} from "@/lib/orders";
import { formatDateTime, formatPrice } from "@/lib/format";
import { confirmOrder } from "@/app/account/actions";
import type { Order, OrderItem } from "@/lib/types";

export function ActiveOrder({
  initial,
}: {
  initial: Order & { items: OrderItem[] };
}) {
  const [order, setOrder] = useState(initial);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`order-${initial.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${initial.id}`,
        },
        (payload) =>
          setOrder((prev) => ({ ...prev, ...(payload.new as Order) })),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [initial.id]);

  const step = statusStep(order.status);
  const cancelled = order.status === "cancelled";

  function handleConfirm() {
    startTransition(async () => {
      const res = await confirmOrder(order.id);
      if (res.ok) {
        setOrder((p) => ({ ...p, status: "confirmed" }));
        toast.success("Спасибо! Заказ завершён.");
      } else {
        toast.error(res.error ?? "Не удалось подтвердить заказ.");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Заказ № {shortOrderId(order.id)}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(order.created_at)}
          </p>
        </div>
        <Badge className={ORDER_STATUS[order.status].badge}>
          {ORDER_STATUS[order.status].label}
        </Badge>
      </div>

      {cancelled ? (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
          <CircleSlash className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Заказ отменён</p>
            {order.cancel_reason && (
              <p className="text-muted-foreground">
                Причина: {order.cancel_reason}
              </p>
            )}
          </div>
        </div>
      ) : (
        <ol className="mt-5 space-y-3">
          {ORDER_FLOW.map((s, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <li key={s} className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-medium",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : current
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    current
                      ? "font-semibold text-foreground"
                      : done
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {ORDER_STATUS[s].label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-5 border-t border-border pt-4">
        <ul className="space-y-1.5 text-sm">
          {order.items.map((it) => (
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
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {PAYMENT_LABEL[order.payment_method]}
          </span>
          <span className="font-bold">{formatPrice(order.total)}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Доставка: {order.delivery_address}
        </p>
      </div>

      {order.status === "delivered" && (
        <Button className="mt-5 w-full" disabled={pending} onClick={handleConfirm}>
          {pending ? "Подтверждаем…" : "Подтвердить получение"}
        </Button>
      )}
    </div>
  );
}
