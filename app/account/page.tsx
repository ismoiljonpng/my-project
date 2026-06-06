import type { Metadata } from "next";
import { Package } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/account/profile-form";
import { ActiveOrder } from "@/components/account/active-order";
import { OrderHistoryCard } from "@/components/account/order-history-card";
import { EmptyState } from "@/components/states";
import type { OrderItem } from "@/lib/types";

export const metadata: Metadata = { title: "Личный кабинет" };

const ACTIVE_STATUSES = new Set([
  "new",
  "accepted",
  "cooking",
  "ready",
  "courier_assigned",
  "picked_up",
  "delivering",
  "delivered",
]);

export default async function AccountPage() {
  const { supabase, user, profile } = await requireUser("/account");

  const { data: ordersRaw } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const orders = ordersRaw ?? [];

  const itemsByOrder = new Map<string, OrderItem[]>();
  if (orders.length > 0) {
    const { data: itemsRaw } = await supabase
      .from("order_items")
      .select("*")
      .in(
        "order_id",
        orders.map((o) => o.id),
      );
    for (const it of itemsRaw ?? []) {
      const arr = itemsByOrder.get(it.order_id) ?? [];
      arr.push(it);
      itemsByOrder.set(it.order_id, arr);
    }
  }

  const withItems = orders.map((o) => ({
    ...o,
    items: itemsByOrder.get(o.id) ?? [],
  }));
  const active = withItems.filter((o) => ACTIVE_STATUSES.has(o.status));
  const past = withItems.filter((o) => !ACTIVE_STATUSES.has(o.status));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        Личный кабинет
      </h1>
      <p className="mt-1 text-muted-foreground">
        Здравствуйте, {profile?.full_name || "гость"}!
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="order-2 space-y-8 lg:order-1">
          <section>
            <h2 className="mb-4 text-xl font-bold">Активные заказы</h2>
            {active.length === 0 ? (
              <EmptyState
                icon={Package}
                title="Активных заказов нет"
                description="Загляните в меню и сделайте заказ — статус будет обновляться здесь в реальном времени."
              />
            ) : (
              <div className="space-y-5">
                {active.map((o) => (
                  <ActiveOrder key={o.id} initial={o} />
                ))}
              </div>
            )}
          </section>

          {past.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">История заказов</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {past.map((o) => (
                  <OrderHistoryCard key={o.id} order={o} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="order-1 lg:order-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-20">
            <h2 className="mb-4 text-lg font-semibold">Профиль</h2>
            <ProfileForm
              fullName={profile?.full_name ?? ""}
              phone={profile?.phone ?? ""}
              email={user.email ?? ""}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
