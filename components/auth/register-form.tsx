"use client";

import { useActionState, useEffect } from "react";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp, type AuthState } from "@/app/(auth)/actions";

export function RegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signUp, {} as AuthState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  if (state.info) {
    return (
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
          <MailCheck className="size-7" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">Почти готово</h2>
        <p className="mt-2 text-sm text-muted-foreground">{state.info}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Имя</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          autoComplete="name"
          placeholder="Как к вам обращаться"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          name="phone"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Почта</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          placeholder="Минимум 6 символов"
        />
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Создаём аккаунт…" : "Зарегистрироваться"}
      </Button>
    </form>
  );
}
