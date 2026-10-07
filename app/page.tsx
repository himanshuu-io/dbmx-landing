import { AstronautCursor } from "@/components/astronaut-cursor";
import { Navbar } from "@/components/navbar";
import { Rule } from "@/components/ui";
import { Hero } from "@/components/sections/hero";
import { Logos } from "@/components/sections/logos";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Features } from "@/components/sections/features";
import { UseCases } from "@/components/sections/use-cases";
import { Benefits } from "@/components/sections/benefits";
import { Security } from "@/components/sections/security";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="overflow-x-clip">
      <AstronautCursor />
      <Navbar />
      <main>
        <Hero />
        <Rule />
        <Logos />
        <Rule />
        <HowItWorks />
        <Rule />
        <Features />
        <Rule />
        <UseCases />
        <Rule />
        <Benefits />
        <Rule />
        <Security />
        <Rule />
        <Faq />
        <Rule />
        <Cta />
        <Rule />
      </main>
      <Footer />
    </div>
  );
}
