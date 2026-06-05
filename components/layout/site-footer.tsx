import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Logo } from "./logo";
import { NAV_LINKS, SITE } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Готовим настоящую узбекскую кухню и привозим её горячей из ближайшей
            к вам точки в {SITE.city}е. Без агрегаторов — честно и вовремя.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={SITE.socials.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Send className="size-5" />
            </a>
            <a
              href={SITE.socials.vk}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ВКонтакте"
              className="grid size-10 place-items-center rounded-xl border border-border bg-background text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <MessageCircle className="size-5" />
            </a>
          </div>
        </div>

        <nav aria-label="Разделы сайта">
          <h3 className="text-sm font-semibold">Разделы</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-semibold">Контакты</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href={SITE.phoneHref}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Phone className="size-4 text-primary" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="size-4 text-primary" /> {SITE.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 text-primary" /> {SITE.hours}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> {SITE.city}, 10 точек
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {SITE.brand}. Узбекская кухня в {SITE.city}е.
          </p>
          <p>Оплата при получении — наличными или картой курьеру.</p>
        </div>
      </div>
    </footer>
  );
}
