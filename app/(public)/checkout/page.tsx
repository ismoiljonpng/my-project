import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutAuthGate } from "@/components/checkout/checkout-auth-gate";

export const metadata: Metadata = { title: "Оформление заказа" };

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let content: React.ReactNode;
  if (!user) {
    content = <CheckoutAuthGate />;
  } else {
    const [{ data: locations }, { data: profile }] = await Promise.all([
      supabase
        .from("locations")
        .select("*")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle(),
    ]);
    content = (
      <CheckoutForm
        locations={locations ?? []}
        defaultPhone={profile?.phone ?? ""}
      />
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Оформление заказа
      </h1>
      {content}
    </div>
  );
}
