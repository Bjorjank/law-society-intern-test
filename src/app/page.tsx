import { AnniversaryBanner } from "@/components/anniversary-banner";
import { CareerBanner } from "@/components/career-banner";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { LegalSupport } from "@/components/legal-support";
import { NewsCarousel } from "@/components/news-carousel";
import { RoadTo2027 } from "@/components/road-to-2027";
import { StatutoryFunctions } from "@/components/statutory-functions";

export default function Home() {
  return (
    <main id="top">
      <Header />
      <Hero />
      <StatutoryFunctions />
      <AnniversaryBanner />
      <RoadTo2027 />
      <LegalSupport />
      <NewsCarousel />
      <CareerBanner />
      <Footer />
    </main>
  );
}
