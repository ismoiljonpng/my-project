"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  LayoutDashboard,
  LogOut,
  Store,
  Truck,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/app/(auth)/actions";
import type { Role } from "@/lib/types";

export function UserMenu({
  account,
}: {
  account: { name: string; role: Role };
}) {
  const [, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Аккаунт" />
        }
      >
        <UserIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          {account.name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/account" />}>
          <UserIcon className="size-4" /> Мой кабинет
        </DropdownMenuItem>
        {account.role === "admin" && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <LayoutDashboard className="size-4" /> Админ-панель
          </DropdownMenuItem>
        )}
        {account.role === "courier" && (
          <DropdownMenuItem render={<Link href="/courier" />}>
            <Truck className="size-4" /> Панель курьера
          </DropdownMenuItem>
        )}
        {account.role === "manager" && (
          <DropdownMenuItem render={<Link href="/manager" />}>
            <Store className="size-4" /> Панель точки
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => startTransition(async () => void (await signOut()))}
        >
          <LogOut className="size-4" /> Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
