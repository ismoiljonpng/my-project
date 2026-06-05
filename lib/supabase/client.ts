import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/types";

/** Браузерный клиент Supabase (для клиентских компонентов). */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
