"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductShowcaseSection() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [visibleCards, setVisibleCards] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [canSlideNext, setCanSlideNext] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Food & Drinks",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format",
      description:
        "From gourmet burgers to refreshing beverages, showcase your culinary creations with appetizing photos and detailed descriptions.",
    },
    {
      id: 2,
      title: "Fashion Items",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&auto=format",
      description:
        "Display your clothing collections, accessories, and fashion items with style. Perfect for boutiques and fashion retailers.",
    },
    {
      id: 3,
      title: "Electronics",
      image:
        "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop&auto=format",
      description:
        "From iPhones to earbuds, smartwatches and laptops. Use Catlog to give your customers an easy way to browse and place orders without endless questions.",
    },
    {
      id: 4,
      title: "Home & Decor",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format",
      description:
        "Beautiful furniture, home accessories, and decor items. Create stunning catalogs for interior design and home goods.",
    },
    {
      id: 5,
      title: "Beauty & Wellness",
      image:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&auto=format",
      description:
        "Cosmetics, skincare, wellness products, and beauty accessories. Perfect for salons and beauty retailers.",
    },
  ];

  // Handle responsiveness
  useEffect(() => {
    const updateSlider = () => {
      if (!sliderRef.current) return;

      const containerWidth = sliderRef.current.offsetWidth;
      const minCardWidth = 350;
      const newVisibleCards = Math.floor(containerWidth / minCardWidth) || 1;
      const newCardWidth = containerWidth / newVisibleCards;

      setVisibleCards(newVisibleCards);
      setCardWidth(newCardWidth);

      const maxIndex = slides.length - newVisibleCards;
      setCanSlideNext(currentIndex < maxIndex);
    };

    updateSlider();
    window.addEventListener("resize", updateSlider);
    return () => window.removeEventListener("resize", updateSlider);
  }, [currentIndex, slides.length]);

  const prev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const next = () => {
    if (!canSlideNext) return;

    setCurrentIndex((prev) => {
      const containerWidth = sliderRef.current!.offsetWidth;
      const maxIndex =
        slides.length - Math.floor(containerWidth / cardWidth);
      const newIndex = Math.min(prev + 1, maxIndex);

      setCanSlideNext(newIndex < maxIndex);
      return newIndex;
    });
  };

  useEffect(() => {
    if (!sliderRef.current) return;
    const containerWidth = sliderRef.current.offsetWidth;
    const maxIndex = slides.length - Math.floor(containerWidth / cardWidth);
    setCanSlideNext(currentIndex < maxIndex);
  }, [currentIndex, cardWidth, slides.length]);

  return (
    <section className="relative py-20 bg-[var(--card-bg-5)] mt-[15rem] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30"></div>

      <div className="relative z-10 mx-auto-">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[clamp(2rem,6.5vw,3.5rem)] font-semibold leading-tight">
            What you can sell <br />
            <span className="text-[var(--color-primary)]">with Sellexplore</span>
          </h1>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden" ref={sliderRef}>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`,
              width: `${slides.length * cardWidth}px`,
            }}
          >
            {slides.map((slide) => (
              <div
                key={slide.id}
                className="flex-shrink-0 px-4 py-6"
                style={{ width: `${cardWidth}px` }}
              >
                <div className="h-full rounded-[32px] shadow-md bg-white flex flex-col overflow-hidden">
                  <div className="relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-60 object-cover rounded-t-[32px]"
                    />
                    <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                      {slide.title}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1 bg-[var(--color-surface)] ">
                    <p className="text-sm mb-4">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {slides.length > visibleCards && (
          <>
            <button
              onClick={prev}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition disabled:opacity-50"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <button
              onClick={next}
              disabled={!canSlideNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white rounded-full p-2 shadow-md hover:bg-[var(--color-primary-dark)] transition disabled:opacity-50"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots */}
        {slides.length > visibleCards && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({
              length: Math.ceil(slides.length - visibleCards + 1),
            }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentIndex
                    ? "bg-[var(--color-primary)]"
                    : "bg-gray-300"
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  const containerWidth = sliderRef.current!.offsetWidth;
                  const maxIndex =
                    slides.length - Math.floor(containerWidth / cardWidth);
                  setCanSlideNext(index < maxIndex);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

