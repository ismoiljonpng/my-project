"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; info?: string };

function safeNext(value: FormDataEntryValue | null): string {
  const next = String(value ?? "");
  return next.startsWith("/") ? next : "/account";
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    return { error: "Введите почту и пароль." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: "Неверная почта или пароль." };
  }
  redirect(next);
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (full_name.length < 2) return { error: "Пожалуйста, укажите имя." };
  if (!email) return { error: "Укажите электронную почту." };
  if (password.length < 6) return { error: "Пароль — минимум 6 символов." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, phone } },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    return {
      error: msg.includes("already") || msg.includes("registered")
        ? "Эта почта уже зарегистрирована. Войдите."
        : "Не удалось зарегистрироваться. Попробуйте позже.",
    };
  }

  if (data.session) {
    redirect(next);
  }
  return {
    info: "Мы отправили письмо для подтверждения. Перейдите по ссылке из письма и войдите.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
