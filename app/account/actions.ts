"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { ok?: boolean; error?: string };

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (full_name.length < 2) return { error: "Пожалуйста, укажите имя." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Войдите снова." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, phone: phone || null })
    .eq("id", user.id);

  if (error) return { error: "Не удалось сохранить профиль." };
  revalidatePath("/account");
  return { ok: true };
}

export type ConfirmResult = { ok: boolean; error?: string };

/** Клиент подтверждает получение доставленного заказа. */
export async function confirmOrder(orderId: string): Promise<ConfirmResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Войдите снова." };

  const { error } = await supabase
    .from("orders")
    .update({ status: "confirmed" })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .eq("status", "delivered");

  if (error) return { ok: false, error: "Не удалось подтвердить заказ." };
  revalidatePath("/account");
  return { ok: true };
}
