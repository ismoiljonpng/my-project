import { createClient } from "@/lib/supabase/server";

// Серверные хелперы чтения публичных данных. Каждый возвращает { data, error }
// — страницы сами показывают состояния loading / empty / error.

export async function getCategories() {
  const supabase = await createClient();
  return supabase
    .from("menu_categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
}

export async function getMenuItems() {
  const supabase = await createClient();
  return supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order");
}

export async function getPopularItems(limit = 8) {
  const supabase = await createClient();
  return supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .eq("is_popular", true)
    .order("sort_order")
    .limit(limit);
}

export async function getActivePromotions() {
  const supabase = await createClient();
  return supabase
    .from("promotions")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
}

export async function getActiveBanners() {
  const supabase = await createClient();
  return supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
}

export async function getLocations() {
  const supabase = await createClient();
  return supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
}

export async function getActiveVacancies() {
  const supabase = await createClient();
  return supabase
    .from("vacancies")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
}

export async function getSiteContent<T = unknown>(
  key: string,
): Promise<T | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return null;
  return data.value as T;
}
