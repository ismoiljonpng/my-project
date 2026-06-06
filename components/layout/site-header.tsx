"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingCart,
  Store,
  Truck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE } from "@/lib/site";
import { useCart, cartCount } from "@/lib/cart";
import { signOut } from "@/app/(auth)/actions";
import type { Role } from "@/lib/types";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

const ROLE_LINK: Partial<
  Record<Role, { href: string; label: string; icon: typeof Truck }>
> = {
  admin: { href: "/admin", label: "Админ-панель", icon: LayoutDashboard },
  courier: { href: "/courier", label: "Панель курьера", icon: Truck },
  manager: { href: "/manager", label: "Панель точки", icon: Store },
};

export function SiteHeader({
  account,
}: {
  account: { name: string; role: Role } | null;
}) {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => setMounted(true), []);
  const count = mounted ? cartCount(items) : 0;
  const roleLink = account ? ROLE_LINK[account.role] : undefined;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav
          className="ml-4 hidden items-center gap-1 lg:flex"
          aria-label="Основная навигация"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                isActive(pathname, link.href) && "bg-accent text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />

          <Button
            render={<Link href="/cart" />}
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={count ? `Корзина, товаров: ${count}` : "Корзина"}
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] leading-5 font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </Button>

          {account ? (
            <div className="hidden sm:block">
              <UserMenu account={account} />
            </div>
          ) : (
            <Button
              render={<Link href="/login" />}
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
              aria-label="Войти"
            >
              <User className="size-5" />
            </Button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Открыть меню"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="text-left font-display tracking-tight">
                  {SITE.brand}
                </SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-1 px-2"
                aria-label="Мобильная навигация"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={
                      isActive(pathname, link.href) ? "page" : undefined
                    }
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                      isActive(pathname, link.href) &&
                        "bg-accent text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="my-2 h-px bg-border" />

                {account ? (
                  <>
                    <p className="truncate px-3 py-1 text-xs text-muted-foreground">
                      {account.name}
                    </p>
                    <Link
                      href="/account"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <User className="size-5" /> Мой кабинет
                    </Link>
                    {roleLink && (
                      <Link
                        href={roleLink.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        <roleLink.icon className="size-5" /> {roleLink.label}
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        startTransition(async () => void (await signOut()));
                      }}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-base font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="size-5" /> Выйти
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <User className="size-5" /> Войти
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
