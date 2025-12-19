// components/Hero.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useStoreConfig } from "@/context/StoreContext";

const ALIGNMENT_CLASSES: Record<string, string> = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
  start: "items-start",
  end: "items-end",
};

export default function Hero() {
  const config = useStoreConfig();
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Null safety check
  if (!config) {
    console.error("[Hero] Store configuration is missing");
    return null;
  }

  const images = useMemo(() => {
    return [
      config.background_image_one,
      config.background_image_two,
      config.background_image_three,
    ].filter(Boolean) as string[];
  }, [config]);

  const alignmentClass = useMemo(() => {
    return ALIGNMENT_CLASSES[config.position || "center"] || "items-center";
  }, [config.position]);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) {
    console.warn("[Hero] No images configured");
    return null;
  }

  return (
    <div className="relative w-full h-[80vh] overflow-hidden bg-gray-900">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Hero background ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            onLoad={() => index === 0 && setIsLoaded(true)}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      <div
        className={`relative z-10 flex flex-col ${alignmentClass} justify-center h-full px-8 text-white max-w-7xl mx-auto transition-opacity duration-500 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {config.headline && (
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
            {config.headline}
          </h1>
        )}

        {config.subheading && (
          <p className="text-lg md:text-xl mb-6 text-gray-100 drop-shadow-md max-w-2xl">
            {config.subheading}
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          {config.button_one && (
            <button className="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium shadow-lg">
              {config.button_one}
            </button>
          )}

          {config.button_two && (
            <button className="px-6 py-3 rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition-colors font-medium shadow-lg">
              {config.button_two}
            </button>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all ${
                index === current
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75 w-2"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}