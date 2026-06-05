import { Flame, MapPin, Truck, Wallet } from "lucide-react";
import { Reveal } from "@/components/reveal";

const FEATURES = [
  {
    icon: Truck,
    title: "Своя доставка",
    text: "Не зависим от агрегаторов — привозим сами, быстрее и без накруток в цене.",
  },
  {
    icon: Wallet,
    title: "Честные цены",
    text: "Цена в меню — это и есть цена. Оплата курьеру при получении: наличными или картой.",
  },
  {
    icon: MapPin,
    title: "10 точек в городе",
    text: "Готовим в ближайшей к вам точке, поэтому блюда приезжают по-настоящему горячими.",
  },
  {
    icon: Flame,
    title: "Готовим каждый день",
    text: "Плов из казана, самса из тандыра, свежий хлеб — только из свежих продуктов.",
  },
];

export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Почему AL-ABBOS</h2>
        <p className="mt-3 text-muted-foreground">
          Мы запустили свой сайт и доставку, чтобы каждый заказ доходил вовремя и
          без путаницы.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.06}>
            <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="grid size-12 place-items-center rounded-xl bg-secondary text-primary">
                <f.icon className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
