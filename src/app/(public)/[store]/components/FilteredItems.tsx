import { ShoppingCart } from "lucide-react";
import React from "react";
import { FilteredProductResponse } from "../../types";

export interface ProductOption {
  id: number;
  name: string;
  image?: string | null;
}

// Image object (main + thumbnails)
export interface ProductImage {
  image: string;
  thumbnail?: boolean;
}

// Main product shape
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string; // legacy single image
  hasOptions?: boolean;
  oldPrice?: number;
  discount?: string;
  images?: ProductImage[];
  options?: ProductOption[];
}

interface FilteredItemsProps {
  products: FilteredProductResponse<Product>;
  isLoading?: boolean;
  error?: string | null;
}

interface FilteredItemsProps {
  products: FilteredProductResponse<Product>;
  isLoading?: boolean;
  error?: string | null;
}

const FilteredItems: React.FC<FilteredItemsProps> = ({
  products,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className="max-w-[1200px] px-4 mx-auto py-[2.5rem]">
        <p className="text-center text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1200px] px-4 mx-auto py-[2.5rem]">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  if (products.count === 0) {
    return (
      <div className="max-w-[1200px] px-4 mx-auto py-[2.5rem]">
        <p className="text-center text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] px-4 mx-auto py-[2.5rem]">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-3">
        {products.results.map((product) => {
          const thumb =
            product.images?.find((img) => img.thumbnail) || product.images?.[0];

          return (
            <div
              key={product.id}
              className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border-secondary)] overflow-hidden group relative"
            >
              <div className="relative">
                {product.discount && (
                  <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {product.discount}
                  </span>
                )}

                <img
                  src={thumb?.image || product.image || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-[9.5rem] sm:h-[12rem] object-cover"
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
                    NGN {product.price.toLocaleString()}
                  </span>
                  {product.oldPrice && (
                    <span className="text-[var(--color-body)] line-through text-xs">
                      NGN {product.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {product.options && product.options.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.options.map((opt) => (
                      <span
                        key={opt.id}
                        className="text-xs font-medium text-[var(--color-primary)] bg-[var(--color-border-secondary)] px-3 py-1 rounded-full hover:bg-indigo-100"
                      >
                        {opt.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilteredItems;
