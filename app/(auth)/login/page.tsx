import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Вход" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safe = next?.startsWith("/") ? next : "/account";
  const registerHref =
    safe !== "/account"
      ? `/register?next=${encodeURIComponent(safe)}`
      : "/register";

  return (
    <div>
      <h1 className="text-2xl font-bold">Вход</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Рады видеть снова. Войдите в свой аккаунт.
      </p>
      <div className="mt-6">
        <LoginForm next={safe} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Нет аккаунта?{" "}
        <Link
          href={registerHref}
          className="font-medium text-primary hover:underline"
        >
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}
