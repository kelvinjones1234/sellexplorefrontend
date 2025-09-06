"use client";

import React from "react";
import Image from "next/image";
import { TwitterIcon, InstagramIcon, LinkedinIcon } from "lucide-react";

const GeneralFooter = () => {
  return (
    <section className="bg-[var(--color-primary)] text-white">
      {/* Top Section */}
      <div className="max-w-[1200px] mx-auto container-padding py-12 grid lg:grid-cols-2 gap-10 items-center">
        {/* Text */}
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-semibold leading-snug max-w-[500px]">
            Sellexplore is really easy to use. But, don’t take our word for it,
            watch Praise setup a Sellexplore Store in{" "}
            <span className="text-gray-900">2 minutes.</span>
          </h2>
          <button className="mt-6 px-6 py-3 bg-white text-[var(--color-primary)] font-bold rounded-full hover:opacity-90 transition">
            Ready? Get started →
          </button>
        </div>

        {/* Video/Image */}
        <div className="relative w-full aspect-video rounded-[3rem] bg-white overflow-hidden">
          <Image
            src="/sample-video-thumbnail.jpg"
            alt="Sellexplore demo video"
            fill
            className="object-cover"
          />
          <button className="absolute inset-0 m-auto w-28 h-12 bg-orange-500 text-sm font-medium rounded-full flex items-center justify-center">
            ▶ Play this video
          </button>
        </div>
      </div>

      <hr className="border-gray-900" />

      {/* Footer Links */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-sm">
        {/* Logo + App Section */}
        <div className="col-span-2 sm:col-span-1">
          <h3 className="font-bold text-lg mb-3">Sellexplore</h3>
          <p className="text-[var(--color-text)] mb-4 text-sm">
            Take orders via chat, manage your business & get paid seamlessly
            with Sellexplore
          </p>
        </div>

        {/* Products */}
        <div>
          <h4 className="font-semibold mb-3">PRODUCTS</h4>
          <ul className="space-y-2 text-[var(--color-text)]">
            <li>Store Links</li>
            <li>Orders & Customers</li>
            <li>Payments & Invoices</li>
            <li>Invoice Links</li>
            <li>Find with Sellexplore</li>
            <li>Deliveries</li>
          </ul>
        </div>

        {/* Learn */}
        <div>
          <h4 className="font-semibold mb-3">LEARN</h4>
          <ul className="space-y-2 text-[var(--color-text)]">
            <li>Why Sellexplore</li>
            <li>About</li>
            <li>Pricing</li>
            <li>Blog</li>
            <li>Help Articles</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[var(--color-text)] text-sm">
          <p>© 2025 Sellexplore Inc.</p>
          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-white">
              <TwitterIcon />
            </a>
            <a href="#" className="hover:text-white">
              <InstagramIcon />
            </a>
            <a href="#" className="hover:text-white">
              <LinkedinIcon />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralFooter;
