"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface GetStartedButtonProps {
  color?: string; // background color class
  height?: string; // height class e.g. "py-3"
  weight?: string; // font weight class e.g. "font-bold"
  children?: React.ReactNode;
  width?: string; // width class e.g. "w-full"
}

const GetStartedButton = ({
  color = "bg-[#FF6F00]",
  height = "py-3",
  weight = "font-semibold",
  children,
  width = "w-auto",
}: GetStartedButtonProps) => {
  const handleScrollToPricing = () => {
    setTimeout(() => {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  return (
    <div className={`flex flex-col font-bold xs:flex-row items-center gap-y-4 gap-x-4`}>
      <style jsx>{`
        .no-color-transition {
          transition: none !important;
        }
        [data-theme] .no-color-transition,
        [data-theme] .no-color-transition * {
          transition: none !important;
        }
      `}</style>
      <button
        onClick={handleScrollToPricing}
        className={`bg-[var(--color-primary)] my-3 hover:bg-[var(--color-primary-hover)] gap-3 px-6 py-4 inline-flex rounded-full text-sm md:text-lg sm:text-base text-white transition-all duration-300 shadow-md hover:shadow-lg items-center justify-center group no-color-transition`}
      >
        {children || (
          <>
            Get started for free
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </>
        )}
      </button>
      <Link href="/authentication/signin">
        <div
          className={`px-6 py-4 inline border my-3 border-[var(--color-border)]  rounded-full text-sm md:text-lg sm:text-base text-[var(--color-text)] bg-[var(--color-bg-secondary)] transition-all duration-300 items-center justify-center no-color-transition`}
        >
          Sign in
        </div>
      </Link>
    </div>
  );
};

export default GetStartedButton;
