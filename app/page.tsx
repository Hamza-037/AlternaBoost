import { HeaderV2 } from "@/components/landing/HeaderV2";
import { HeroV2 } from "@/components/landing/HeroV2";
import { FeaturesV2 } from "@/components/landing/FeaturesV2";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeaderV2 />
      <HeroV2 />
      <FeaturesV2 />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
