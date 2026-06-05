import { Hammer } from "lucide-react";

/** Аккуратная заглушка раздела на время поэтапной сборки. */
export function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-5 px-4 py-20 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-secondary text-primary">
        <Hammer className="size-8" />
      </div>
      <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
      <p className="max-w-md text-muted-foreground">{description}</p>
    </section>
  );
}
