"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Category } from "../../types";
import React from "react";

export default function Categories({ categories }: { categories: Category[] }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (!categories?.length) return null;

  return (
    <section className="my-[1rem] px-4">
      <div className="flex items-center justify-between mb-6 max-w-[1200px] mx-auto">
        <h2 className="text-sm md:text-lg font-semibold text-[var(--color-brand-primary)]">
          Categories
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-border-secondary)] hover:bg-[var(--color-brand-primary)] transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-border-secondary)] hover:bg-[var(--color-brand-primary)] transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-5 scrollbar-hide snap-x snap-mandatory no-scrollbar"
        >
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="relative min-w-[180px] sm:min-w-[220px] aspect-[3/4] flex-shrink-0 snap-start rounded-2xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={cat.image || "/placeholder.png"}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
              <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-semibold text-sm sm:text-base text-center">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
