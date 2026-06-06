"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, type ProfileState } from "@/app/account/actions";

export function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [state, action, pending] = useActionState(
    updateProfile,
    {} as ProfileState,
  );

  useEffect(() => {
    if (state.ok) toast.success("Профиль сохранён.");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Имя</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={fullName}
          required
          autoComplete="name"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={phone}
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Почта</Label>
        <Input id="email" value={email} disabled readOnly />
        <p className="text-xs text-muted-foreground">
          Почта используется для входа и не меняется здесь.
        </p>
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Сохраняем…" : "Сохранить"}
      </Button>
    </form>
  );
}
