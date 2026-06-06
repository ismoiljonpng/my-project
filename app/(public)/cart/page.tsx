import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = { title: "Корзина" };

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Корзина
      </h1>
      <CartView />
    </div>
  );
}
