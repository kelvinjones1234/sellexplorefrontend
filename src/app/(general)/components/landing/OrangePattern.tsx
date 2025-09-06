import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const OrangePattern = () => {
  return (
    <section className="">
      <div className="relative w-full">
        <Image
          src="/patternimage.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center py-[4rem] justify-between h-full text-black max-w-[1200] mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center md:items-start justify-center">
            <h1 className="text-[clamp(2rem,6.5vw,3.5rem)] leading-[clamp(2.2rem,7vw,4rem)] font-semibold text-center md:text-start">
              Get started in <br />
              <span className="text-[var(--color-primary)]">5 minutes</span>
            </h1>
            <p className="text-center md:text-start py-4 max-w-[500px]">
              Don’t move your customers away from WhatsApp, X or Instagram.
              Simplify sales and management with Sellexplore.
            </p>
            <button
              className={`bg-[var(--color-primary)] my-3 hover:bg-[var(--color-primary-hover)] gap-3 px-6 py-4 inline-flex rounded-full text-sm md:text-lg sm:text-base text-white transition-all duration-300 shadow-md hover:shadow-lg items-center justify-center group no-color-transition`}
            >
              Get started for free
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
          <div className="">
            <Image
              src="/patternimage.png"
              alt="Background"
              height={400}
              width={400}
              className="object-fit"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrangePattern;
