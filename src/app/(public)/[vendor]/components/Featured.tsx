"use client";

import { ShoppingCart } from "lucide-react";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import type { FeaturedProduct } from "../page";

export default function Featured({
  products,
}: {
  products: FeaturedProduct[];
}) {
  if (!products?.length) {
    return <p className="text-center py-8">No featured products available.</p>;
  }

  return (
    <div className="max-w-[1200px] px-4 mx-auto">
      <div className="flex justify-between items-center my-4">
        <h2 className="text-[var(--color-primary)] text-sm md:text-lg font-semibold">
          Featured items
        </h2>
        <div className="w-[12rem] md:w-[20rem] my-[1rem]">
          <FloatingLabelSelect
            name=""
            value=""
            onChange={(e) => console.log("Category filter:", e.target.value)}
            placeholder="Filter by category"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const price = product.price ? Number(product.price) : 0;
          const discountPrice = product.discount_price
            ? Number(product.discount_price)
            : null;

          // Safe discount calculation
          let discountPercent: number | null = null;
          if (price > 0 && discountPrice !== null && discountPrice < price) {
            discountPercent = Math.round(
              ((price - discountPrice) / price) * 100
            );
          }

          const thumbnail =
            product.images.find((img) => img.is_thumbnail)?.image ||
            product.images[0]?.image ||
            "/placeholder.png";

          return (
            <div
              key={product.id}
              className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border-secondary)] overflow-hidden group relative"
            >
              <div className="relative">
                {discountPercent !== null && (
                  <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
                <img
                  src={thumbnail}
                  alt={product.name}
                  className="w-full h-[12rem] sm:h-[15rem] object-cover"
                />
                <button className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-white rounded-full shadow text-[var(--color-primary)] transition">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 px-2">
                <h3 className="font-medium text-[var(--color-body)] text-sm truncate">
                  {product.name}
                </h3>
                <div className="mt-2 flex flex-col">
                  <span className="text-[var(--color-primary)] font-semibold text-sm">
                    NGN {(discountPrice ?? price).toLocaleString()}
                  </span>
                  {discountPrice !== null && (
                    <span className="text-[var(--color-body)] line-through text-xs">
                      NGN {price.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.options?.length > 0 && (
                  <button className="mt-3 text-xs font-medium text-[var(--color-primary)] bg-[var(--color-border-secondary)] px-3 py-1 rounded-full hover:bg-indigo-100">
                    Has Options
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
