import { HeroHeader } from "./components/HeroHeader";
import { ScrollingText } from "./components/ScrollingText";
import { HeroImage } from "./components/HeroImage";
import { CTASection } from "./components/CTASection";
import { RedeemSection } from "./components/RedeemSection";
import { MenuTiles } from "./components/MenuTiles";
import { Footer } from "./components/Footer";
import { MobileNav } from "./components/MobileNav";

export default function Home() {
  return (
    <div className="pb-24 md:pb-8 bg-[#f00]">
      <HeroHeader />

      <main className="w-full bg-[#f4ead5]">
        <ScrollingText />
        <HeroImage />
        <CTASection />
        <MenuTiles />
        <RedeemSection />
        <Footer />
      </main>

      <MobileNav />
    </div>
  );
}
