"use client";

import FloatingLabelSelect from "@/app/component/fields/Selection";
import { ShoppingCart } from "lucide-react";
import React from "react";

const AllProducts = () => {
  const products = [
    {
      id: 1,
      name: "Polka Dot Mix Dress",
      price: 36500,
      image:
        "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=600&h=800&fit=crop",
      hasOptions: true,
    },
    {
      id: 2,
      name: "Two Piece Trouser Set",
      price: 38500,
      image:
        "https://images.unsplash.com/photo-1542060748-10c28b62716f?w=600&h=800&fit=crop",
      hasOptions: true,
    },
    {
      id: 3,
      name: "Asymmetric Swing Dress",
      price: 38500,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
      hasOptions: true,
    },
    {
      id: 4,
      name: "Babydoll Pearl Dress",
      price: 39000,
      oldPrice: 39500,
      discount: "2% OFF",
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
      hasOptions: true,
    },
  ];

  return (
    <div className="max-w-[1200px] px-4 mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[var(--color-primary)] text-sm md:text-lg font-semibold">
          Featured items
        </h2>
        <div className="w-[12rem] md:w-[20rem] my-[1rem]">
          <FloatingLabelSelect
            name={""}
            value={""}
            onChange={function (e: React.ChangeEvent<HTMLSelectElement>): void {
              throw new Error("Function not implemented.");
            }}
            placeholder="Filter by category"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border-secondary)]  overflow-hidden group relative"
          >
            {/* Image wrapper */}
            <div className="relative">
              {product.discount && (
                <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {product.discount}
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[12rem] sm:h-[15rem] object-cover"
              />
              <button className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-white  rounded-full shadow text-[var(--color-primary)] transition">
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>

            {/* Product Info */}
            <div className="py-4 px-2">
              <h3 className="font-medium text-[var(--color-body)] text-sm truncate">
                {product.name}
              </h3>
              <div className="mt-2 flex flex-col">
                <span className="text-[var(--color-primary)] font-semibold text-sm">
                  NGN {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-[var(--color-body)] line-through text-xs">
                    NGN {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.hasOptions && (
                <button className="mt-3 text-xs font-medium text-[var(--color-primary)] bg-[var(--color-border-secondary)] px-3 py-1 rounded-full hover:bg-indigo-100">
                  Has Options
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
