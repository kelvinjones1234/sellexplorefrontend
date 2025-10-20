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
    <div
      className={`flex flex-col font-bold xs:flex-row items-center gap-y-4 gap-x-4`}
    >
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
        className={`my-3 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 
             text-sm sm:text-base md:text-lg font-medium 
             bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] 
             shadow-md hover:bg-[var(--color-brand-hover)] hover:shadow-lg 
             transition-all duration-300 group`}
      >
        {children || (
          <>
            Get started for free
            <ArrowRight className="w-5 h-5 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </button>
      <Link href="/authentication/signin">
        <div
          className={`my-3 inline-flex items-center justify-center rounded-full px-6 py-3
               text-sm sm:text-base md:text-lg font-medium
               border border-[var(--color-border-default)] 
               text-[var(--color-brand-primary)] bg-[var(--color-bg-surface)] 
               hover:border-[var(--color-brand-primary)] hover:text-[var(--color-brand-primary)] 
               transition-all duration-300 shadow-sm hover:shadow-md`}
        >
          Sign in
        </div>
      </Link>
    </div>
  );
};

export default GetStartedButton;
