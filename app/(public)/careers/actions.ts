"use server";

import { createClient } from "@/lib/supabase/server";

export type ApplyState = { ok: boolean; error?: string };

export async function submitApplication(
  _prev: ApplyState,
  formData: FormData,
): Promise<ApplyState> {
  const full_name = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const rawVacancy = String(formData.get("vacancy_id") ?? "").trim();
  const vacancy_id = rawVacancy.length > 0 ? rawVacancy : null;

  if (full_name.length < 2) {
    return { ok: false, error: "Пожалуйста, укажите имя." };
  }
  if (phone.replace(/\D/g, "").length < 10) {
    return { ok: false, error: "Укажите корректный номер телефона." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("job_applications").insert({
    full_name,
    phone,
    message: message.length > 0 ? message : null,
    vacancy_id,
  });

  if (error) {
    return { ok: false, error: "Не удалось отправить отклик. Попробуйте позже." };
  }
  return { ok: true };
}
