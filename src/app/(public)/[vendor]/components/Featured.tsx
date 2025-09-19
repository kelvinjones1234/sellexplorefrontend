"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { FeaturedProduct, Category } from "../../types";
import DetailModal from "./DetailModal";

export default function Featured({
  products,
  categories,
}: {
  products: FeaturedProduct[];
  categories: Category[];
}) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Modal state
  const [selectedProduct, setSelectedProduct] =
    useState<FeaturedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!products?.length) {
    return <p className="text-center py-8">No featured products available.</p>;
  }

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    })),
  ];

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);

    if (val === "all") {
      router.push("/products");
    } else {
      router.push(`/products?category=${val}`);
    }
  };

  const openModal = (product: FeaturedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1200px] px-4 mx-auto">
      {/* Header with category filter */}
      <div className="flex justify-between items-center my-4">
        <h2 className="text-[var(--color-primary)] text-sm md:text-lg font-semibold">
          Featured items
        </h2>
        <div className="w-[12rem] md:w-[20rem] my-[1rem]">
          <FloatingLabelSelect
            name="category"
            value={selectedCategory}
            onChange={(val) => handleCategoryChange(val as string)}
            placeholder="Filter by category"
            options={categoryOptions}
          />
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => {
          const price = product.price ? Number(product.price) : 0;
          const discountPrice = product.discount_price
            ? Number(product.discount_price)
            : null;

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
              onClick={() => openModal(product)}
              className="cursor-pointer bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border-secondary)] overflow-hidden group relative hover:shadow-lg transition"
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </div>
  );
}
