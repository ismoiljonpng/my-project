"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/states";
import type { MenuCategory, MenuItem } from "@/lib/types";
import { MenuItemCard } from "./menu-item-card";

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function MenuBrowser({
  categories,
  items,
}: {
  categories: MenuCategory[];
  items: MenuItem[];
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      items.filter((it) => {
        const matchesQuery =
          !q ||
          it.name.toLowerCase().includes(q) ||
          (it.description?.toLowerCase().includes(q) ?? false);
        const matchesCat = activeCat === "all" || it.category_id === activeCat;
        return matchesQuery && matchesCat;
      }),
    [items, q, activeCat],
  );

  const visibleCategories = categories.filter((c) =>
    filtered.some((it) => it.category_id === c.id),
  );
  const uncategorized = filtered.filter((it) => !it.category_id);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 mb-10 border-b border-border/60 bg-background/85 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск блюда…"
              className="pl-9"
              aria-label="Поиск блюда"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Pill active={activeCat === "all"} onClick={() => setActiveCat("all")}>
              Все
            </Pill>
            {categories.map((c) => (
              <Pill
                key={c.id}
                active={activeCat === c.id}
                onClick={() => setActiveCat(c.id)}
              >
                {c.name}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Ничего не найдено"
          description="Попробуйте изменить запрос или выбрать другую категорию."
        />
      ) : (
        <div className="space-y-12">
          {visibleCategories.map((c) => {
            const catItems = filtered.filter((it) => it.category_id === c.id);
            return (
              <section key={c.id} id={c.slug} className="scroll-mt-36">
                <h2 className="mb-5 text-2xl font-bold">{c.name}</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {catItems.map((it) => (
                    <MenuItemCard key={it.id} item={it} />
                  ))}
                </div>
              </section>
            );
          })}
          {uncategorized.length > 0 && (
            <section>
              <h2 className="mb-5 text-2xl font-bold">Прочее</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {uncategorized.map((it) => (
                  <MenuItemCard key={it.id} item={it} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
