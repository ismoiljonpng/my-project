/** Единые данные бренда и навигации. Меняешь здесь — меняется по всему сайту. */
export const SITE = {
  brand: "AL-ABBOS",
  tagline: "узбекская кухня",
  city: "Челябинск",
  description:
    "Сеть кафе узбекской кухни AL-ABBOS: настоящий плов, лагман, шашлык, самса и быстрая доставка из 10 точек по Челябинску.",
  phone: "+7 (351) 211-00-11",
  phoneHref: "tel:+73512110011",
  email: "hello@al-abbos.ru",
  hours: "Ежедневно, 10:00 – 23:00",
  socials: {
    telegram: "https://t.me/alabbos",
    vk: "https://vk.com/alabbos",
  },
} as const;

export const NAV_LINKS = [
  { href: "/menu", label: "Меню" },
  { href: "/promotions", label: "Акции" },
  { href: "/contacts", label: "Контакты" },
  { href: "/about", label: "О нас" },
  { href: "/careers", label: "Вакансии" },
] as const;
