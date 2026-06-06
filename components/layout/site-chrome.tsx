import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import type { Role } from "@/lib/types";

/** Каркас публичных страниц и кабинета клиента: шапка (с учётом входа) + подвал. */
export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let account: { name: string; role: Role } | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .maybeSingle();
    account = {
      name: profile?.full_name || user.email || "Профиль",
      role: (profile?.role ?? "client") as Role,
    };
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader account={account} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
