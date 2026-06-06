import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Регистрация" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safe = next?.startsWith("/") ? next : "/account";
  const loginHref =
    safe !== "/account" ? `/login?next=${encodeURIComponent(safe)}` : "/login";

  return (
    <div>
      <h1 className="text-2xl font-bold">Регистрация</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Создайте аккаунт, чтобы заказывать и отслеживать доставку.
      </p>
      <div className="mt-6">
        <RegisterForm next={safe} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Уже есть аккаунт?{" "}
        <Link
          href={loginHref}
          className="font-medium text-primary hover:underline"
        >
          Войти
        </Link>
      </p>
    </div>
  );
}
