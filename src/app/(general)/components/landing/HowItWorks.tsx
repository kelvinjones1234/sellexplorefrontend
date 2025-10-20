"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function ProductShowcaseSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canSlidePrev, setCanSlidePrev] = useState(false);
  const [canSlideNext, setCanSlideNext] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Food & Drinks",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=800&fit=crop&auto=format",
      description:
        "From gourmet burgers to refreshing beverages, showcase your culinary creations with appetizing photos and detailed descriptions.",
    },
    {
      id: 2,
      title: "Fashion Items",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop&auto=format",
      description:
        "Display your clothing collections, accessories, and fashion items with style. Perfect for boutiques and fashion retailers.",
    },
    {
      id: 3,
      title: "Electronics",
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&h=800&fit=crop&auto=format",
      description:
        "From iPhones to earbuds, smartwatches and laptops. Use Catlog to give your customers an easy way to browse and place orders without endless questions.",
    },
    {
      id: 4,
      title: "Home & Decor",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop&auto=format",
      description:
        "Beautiful furniture, home accessories, and decor items. Create stunning catalogs for interior design and home goods.",
    },
    {
      id: 5,
      title: "Beauty & Wellness",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=800&fit=crop&auto=format",
      description:
        "Cosmetics, skincare, wellness products, and beauty accessories. Perfect for salons and beauty retailers.",
    },
  ];

  // Handle scroll buttons visibility
  useEffect(() => {
    const updateScrollButtons = () => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanSlidePrev(scrollLeft > 0);
      setCanSlideNext(scrollLeft < scrollWidth - clientWidth - 1);
    };

    updateScrollButtons();
    scrollRef.current?.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      scrollRef.current?.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-20 bg-[var(--card-bg-5)] mt-[15rem] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>

      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="text-center mb-12 px-2">
          <h1 className="text-[clamp(2rem,6.5vw,3.5rem)] font-semibold leading-tight">
            What you can sell <br />
            <span className="text-[var(--color-brand-primary)]">
              with Sellexplore
            </span>
          </h1>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900"></h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canSlidePrev}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 text-[var(--color-text-secondary)]" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canSlideNext}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex justify-start px-4 overflow-x-auto space-x-5 scrollbar-hide snap-x snap-mandatory no-scrollbar"
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative min-w-[180px] sm:min-w-[220px] aspect-[3/4] flex-shrink-0 snap-start rounded-2xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />
              <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white font-semibold text-sm sm:text-base text-center">
                {slide.title}
              </h3>
              <p className="absolute inset-0 flex items-center justify-center text-white text-sm sm:text-base text-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {slide.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
