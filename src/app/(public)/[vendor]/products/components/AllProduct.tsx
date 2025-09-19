"use client";

import React, { useState, useEffect, useMemo } from "react";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { ShoppingCart } from "lucide-react";
import { apiClient } from "@/app/(public)/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Product } from "@/app/(public)/types";
import DetailModal from "../../components/DetailModal";

interface AllProductsProps {
  categories: Category[];
  initialProducts: Product[];
  initialCategory?: string;
}

const AllProducts: React.FC<AllProductsProps> = ({
  categories,
  initialProducts,
  initialCategory,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory ?? "__all__"
  );
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(false);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dropdown options
  const categoryOptions = useMemo(
    () => [
      { value: "__all__", label: "All categories" },
      ...categories.map((cat) => ({
        value: cat.slug,
        label: cat.name,
      })),
    ],
    [categories]
  );

  // Capitalize words helper
  const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  // Compute label for header
  const categoryLabel = useMemo(() => {
    if (selectedCategory === "__all__") {
      return "All Products";
    }
    const found = categories.find((c) => c.slug === selectedCategory);
    return found ? `${capitalizeWords(found.name)}` : "Products";
  }, [selectedCategory, categories]);

  // 🔹 Update selectedCategory when URL query changes
  useEffect(() => {
    const urlCategory = searchParams.get("category") ?? "__all__";
    setSelectedCategory(urlCategory);
  }, [searchParams]);

  // 🔹 Refetch products when selectedCategory changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters =
          selectedCategory !== "__all__" ? { category: selectedCategory } : {};
        const response = await apiClient.getProductsByCat(filters);
        setProducts(response.results);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // 🔹 Update URL immediately when dropdown changes
  const handleCategoryChange = (val: string | number) => {
    const newCategory = val as string;

    const params = new URLSearchParams(searchParams.toString());
    if (newCategory === "__all__") {
      params.delete("category");
    } else {
      params.set("category", newCategory);
    }

    router.push(`/products?${params.toString()}`);
  };

  // 🔹 Modal handlers
  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1200px] px-4 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[var(--color-primary)] text-sm md:text-lg font-semibold">
          {categoryLabel}
        </h2>
        <div className="w-[12rem] md:w-[20rem] my-[1rem]">
          <FloatingLabelSelect
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Filter by category"
            options={categoryOptions}
          />
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-center py-6">Loading...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const price = Number(product.price);
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
                  {(product.options?.length ?? 0) > 0 && (
                    <button className="mt-3 text-xs font-medium text-[var(--color-primary)] bg-[var(--color-border-secondary)] px-3 py-1 rounded-full hover:bg-indigo-100">
                      Has Options
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center py-6">No products found.</p>
      )}

      {/* Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default AllProducts;
