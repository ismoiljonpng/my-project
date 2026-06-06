"use server";

import { createClient } from "@/lib/supabase/server";

export type CheckoutInput = {
  items: { id: string; qty: number }[];
  location_id: string;
  delivery_address: string;
  phone: string;
  comment?: string;
  payment_method: "cash" | "card";
};

export type CheckoutResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string; needAuth?: boolean };

export async function createOrder(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Войдите, чтобы оформить заказ.", needAuth: true };
  }
  if (!input.items?.length) {
    return { ok: false, error: "Корзина пуста." };
  }
  if (!input.location_id) {
    return { ok: false, error: "Выберите точку, откуда готовить заказ." };
  }
  if (input.delivery_address.trim().length < 5) {
    return { ok: false, error: "Укажите адрес доставки." };
  }
  if (input.phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "Укажите корректный номер телефона." };
  }

  const { data, error } = await supabase.rpc("place_order", {
    p_location_id: input.location_id,
    p_delivery_address: input.delivery_address,
    p_phone: input.phone,
    p_comment: input.comment ?? null,
    p_payment_method: input.payment_method,
    p_items: input.items,
  });

  if (error || !data) {
    return {
      ok: false,
      error: "Не удалось оформить заказ. Проверьте данные и попробуйте снова.",
    };
  }
  return { ok: true, orderId: data as unknown as string };
}
