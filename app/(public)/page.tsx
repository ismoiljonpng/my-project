import { Hero } from "@/components/sections/hero";
import { PromoStrip } from "@/components/sections/promo-strip";
import { PopularDishes } from "@/components/sections/popular-dishes";
import { WhyUs } from "@/components/sections/why-us";
import { LocationsTeaser } from "@/components/sections/locations-teaser";
import { CtaBand } from "@/components/sections/cta-band";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PromoStrip />
      <PopularDishes />
      <WhyUs />
      <LocationsTeaser />
      <CtaBand />
    </>
  );
}
