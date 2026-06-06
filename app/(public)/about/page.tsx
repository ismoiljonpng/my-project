import type { Metadata } from "next";
import { Heart, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { getSiteContent } from "@/lib/queries";
import { Reveal } from "@/components/reveal";

type About = {
  title: string;
  lead: string;
  paragraphs: string[];
  values: { title: string; text: string }[];
};

const FALLBACK: About = {
  title: "О сети AL-ABBOS",
  lead: "Мы готовим настоящую узбекскую кухню в Челябинске и верим, что хорошая еда начинается с гостеприимства.",
  paragraphs: [
    "AL-ABBOS вырос из небольшой семейной чайханы в сеть из десяти точек по городу. Рецепты плова, лагмана и самсы мы бережно храним и готовим так же, как готовили дома наши бабушки и дедушки.",
    "Мы запустили собственный сайт и доставку, чтобы каждый житель Челябинска мог заказать свежие блюда без переплат агрегаторам — и получить их горячими из ближайшей точки.",
  ],
  values: [
    {
      title: "Гостеприимство",
      text: "Встречаем каждого гостя как дорогого — щедро и по-домашнему.",
    },
    {
      title: "Свежесть",
      text: "Готовим небольшими партиями из свежих продуктов каждый день.",
    },
    {
      title: "Честность",
      text: "Прозрачные цены и своя доставка без скрытых комиссий.",
    },
  ],
};

const VALUE_ICONS: LucideIcon[] = [Heart, Sparkles, ShieldCheck];

export const metadata: Metadata = {
  title: "О нас",
  description:
    "История сети узбекской кухни AL-ABBOS в Челябинске и наши ценности.",
};

export default async function AboutPage() {
  const about = (await getSiteContent<About>("about")) ?? FALLBACK;

  return (
    <div>
      <section className="pattern-east border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
              {about.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">
              {about.lead}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="space-y-5 text-lg leading-relaxed text-foreground/90">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </Reveal>
      </div>

      {about.values.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {about.values.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <Reveal key={v.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{v.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {v.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
