"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { StoreConfig } from "../../types";

export default function Hero({
  initialConfig,
}: {
  initialConfig: StoreConfig | null;
}) {
  if (!initialConfig) return null;

  const [current, setCurrent] = useState(0);

  const images = [
    initialConfig.background_image_one,
    initialConfig.background_image_two,
    initialConfig.background_image_three,
  ].filter(Boolean) as string[];

  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return ( 
    <div className="relative w-full h-[80vh] overflow-hidden">
      {images.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt="Hero background"
            fill
            className="object-cover"
            priority={index === current}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      <div
        className={`relative z-10 flex flex-col items-${initialConfig.position} justify-center h-full px-8 text-white`}
      >
        {initialConfig.headline && (
          <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary)]">
            {initialConfig.headline}
          </h1>
        )}
        {initialConfig.subheading && (
          <p className="text-lg mb-6 text-[var(--color-secondary)]">
            {initialConfig.subheading}
          </p>
        )}
        <div className="flex gap-4">
          {initialConfig.button_one && (
            <button className="px-6 py-2 rounded-lg text-white bg-[var(--color-primary)]">
              {initialConfig.button_one}
            </button>
          )}
          {initialConfig.button_two && (
            <button className="px-6 py-2 rounded-lg text-white bg-[var(--color-secondary)]">
              {initialConfig.button_two}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
