import HeroSection from "@/app/(general)/components/landing/HeroSection";
import HowItWorksSection from "@/app/(general)/components/landing/HowItWorks";
import SellerPainPoint from "@/app/(general)/components/landing/SellerPainPoint";
import Pricing from "./components/landing/Pricing";
import React from "react";
import OrangePattern from "./components/landing/OrangePattern";
import GeneralFooter from "./components/landing/GeneralFooter";
import FeatureSlider from "./components/landing/FeatureSlider";

const HomePage = () => {
  return (
    <div>
      <section className="hero-section section z-[-20]">
        <HeroSection />
      </section>
      <section className="mt-[8rem]">
        <FeatureSlider />
      </section>
      <section className="seller-pain-point">
        <SellerPainPoint />
      </section>
      <section>
        <HowItWorksSection />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section>
        <OrangePattern />
      </section>
      <section>
        <GeneralFooter />
      </section>
    </div>
  );
};

export default HomePage;
