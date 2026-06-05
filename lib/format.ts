const priceFormatter = new Intl.NumberFormat("ru-RU", {
  maximumFractionDigits: 0,
});

/** Цена в рублях: 1500 → «1 500 ₽» (неразрывный пробел). */
export function formatPrice(value: number): string {
  return `${priceFormatter.format(value)} ₽`;
}

/** Дата и время: «5 июня, 14:30». */
export function formatDateTime(value: string | number | Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

/** Дата: «5 июня 2026». */
export function formatDate(value: string | number | Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

/** Только время: «14:30». */
export function formatTime(value: string | number | Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
