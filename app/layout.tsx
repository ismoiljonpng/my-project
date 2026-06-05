import type { Metadata } from "next";
import { Unbounded, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AL-ABBOS — узбекская кухня и доставка в Челябинске",
    template: "%s · AL-ABBOS",
  },
  description:
    "Сеть кафе узбекской кухни «AL-ABBOS»: настоящий плов, лагман, шашлык, самса и быстрая доставка из 10 точек по Челябинску.",
  keywords: [
    "узбекская кухня",
    "плов",
    "доставка еды",
    "Челябинск",
    "AL-ABBOS",
    "лагман",
    "шашлык",
  ],
  openGraph: {
    title: "AL-ABBOS — узбекская кухня и доставка в Челябинске",
    description:
      "Настоящая узбекская кухня и собственная доставка из 10 точек по Челябинску.",
    type: "website",
    locale: "ru_RU",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${unbounded.variable} ${manrope.variable}`}
    >
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
