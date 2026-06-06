import type { OrderStatus, PaymentMethod } from "@/lib/types";

/** Порядок статусов (движение только вперёд, кроме отмены). */
export const ORDER_FLOW: OrderStatus[] = [
  "new",
  "accepted",
  "cooking",
  "ready",
  "courier_assigned",
  "picked_up",
  "delivering",
  "delivered",
  "confirmed",
];

type StatusMeta = { label: string; badge: string };

export const ORDER_STATUS: Record<OrderStatus, StatusMeta> = {
  new: {
    label: "Новый",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  accepted: {
    label: "Принят",
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  },
  cooking: {
    label: "Готовится",
    badge:
      "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  },
  ready: {
    label: "Готов",
    badge: "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
  },
  courier_assigned: {
    label: "Назначен курьер",
    badge:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  },
  picked_up: {
    label: "Курьер забрал",
    badge:
      "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-300",
  },
  delivering: {
    label: "В пути",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  },
  delivered: {
    label: "Доставлен",
    badge: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  },
  confirmed: {
    label: "Завершён",
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
  cancelled: {
    label: "Отменён",
    badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  },
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: "Наличными при получении",
  card: "Картой курьеру",
  online: "Онлайн-оплата",
};

/** Индекс статуса в цепочке (для прогресса). −1 для отменённого/неизвестного. */
export function statusStep(status: OrderStatus): number {
  return ORDER_FLOW.indexOf(status);
}

/** Короткий номер заказа из uuid. */
export function shortOrderId(id: string): string {
  return id.slice(0, 8).toUpperCase();
}
