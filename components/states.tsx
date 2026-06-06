import { CircleAlert, Inbox, type LucideIcon } from "lucide-react";

/** Состояние ошибки загрузки данных. */
export function ErrorState({
  title = "Не удалось загрузить",
  description = "Попробуйте обновить страницу чуть позже.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
        <CircleAlert className="size-6" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

/** Пустое состояние (нет данных). */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-xl bg-secondary text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
