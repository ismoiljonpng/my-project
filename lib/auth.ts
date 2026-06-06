import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Role } from "@/lib/types";

/** Текущий пользователь и его профиль (или null). */
export async function getAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { supabase, user: null, profile: null as Profile | null };
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return { supabase, user, profile: (profile as Profile | null) ?? null };
}

type AuthCtx = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  user: User;
  profile: Profile | null;
};

/** Требует входа; иначе редиректит на /login?next=… */
export async function requireUser(nextPath: string): Promise<AuthCtx> {
  const ctx = await getAuth();
  if (!ctx.user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return ctx as AuthCtx;
}

/** Требует одну из ролей; иначе на главную. */
export async function requireRole(
  roles: Role[],
  nextPath: string,
): Promise<AuthCtx & { role: Role }> {
  const ctx = await requireUser(nextPath);
  const role = (ctx.profile?.role ?? "client") as Role;
  if (!roles.includes(role)) {
    redirect("/");
  }
  return { ...ctx, role };
}
