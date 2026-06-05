import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// В Next.js 16 middleware называется «proxy» (proxy.ts в корне).
// Здесь — обновление сессии Supabase и оптимистичная защита кабинетов.
// Точную проверку роли делают серверные layout'ы соответствующих разделов.

const PROTECTED_PREFIXES = ["/account", "/admin", "/courier", "/manager"];

export async function proxy(request: NextRequest) {
  // Пока Supabase не подключён — пропускаем всё, чтобы dev работал.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Все маршруты, кроме статики и файлов с расширением
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
