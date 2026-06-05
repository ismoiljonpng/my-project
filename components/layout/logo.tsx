import Link from "next/link";
import { Soup } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/site";

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${SITE.brand} — на главную`}
      className={cn("group flex items-center gap-2.5", className)}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm ring-1 ring-primary/20 transition-transform duration-300 group-hover:-rotate-6">
        <Soup className="size-5" aria-hidden />
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-lg font-extrabold tracking-tight">
            {SITE.brand}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            {SITE.tagline}
          </span>
        </span>
      )}
    </Link>
  );
}
