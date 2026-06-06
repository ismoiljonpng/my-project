import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatPrice } from "@/lib/format";
import { ORDER_STATUS, shortOrderId } from "@/lib/orders";
import type { Order, OrderItem } from "@/lib/types";

export function OrderHistoryCard({
  order,
}: {
  order: Order & { items: OrderItem[] };
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium">№ {shortOrderId(order.id)}</p>
          <p className="text-xs text-muted-foreground">
            {formatDateTime(order.created_at)}
          </p>
        </div>
        <Badge className={ORDER_STATUS[order.status].badge}>
          {ORDER_STATUS[order.status].label}
        </Badge>
      </div>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        {order.items.map((it) => (
          <li key={it.id}>
            {it.name} × {it.qty}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex justify-between border-t border-border pt-3">
        <span className="text-sm text-muted-foreground">Итого</span>
        <span className="font-semibold">{formatPrice(order.total)}</span>
      </div>
    </div>
  );
}
