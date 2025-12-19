
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { apiClient } from "@/app/(public)/api";
import { useRouter, useParams } from "next/navigation";
import { Product,Category } from "@/app/(public)/types";
import DetailModal from "../../components/DetailModal";
import OptionModal from "@/app/(public)/components/OptionModal";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "../../components/ProductCard";


// ======================================================
// MAIN PRODUCTS COMPONENT
// ======================================================
interface ProductsProps {
  categories: Category[];
  initialProducts: Product[];
}

const Main: React.FC<ProductsProps> = ({ categories, initialProducts }) => {
  const router = useRouter();
  const params = useParams();
  const { cart, addToCart, updateQuantity } = useCart();

  const currentCategory = (params?.slug as string) ?? "__all__";

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionModalProduct, setOptionModalProduct] = useState<Product | null>(null);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  // Category dropdown options
  const categoryOptions = useMemo(
    () => [
      { value: "__all__", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat.slug,
        label: cat.name,
      })),
    ],
    [categories]
  );

  const categoryLabel = useMemo(() => {
    if (currentCategory === "__all__") return "All Products";
    const cat = categories.find((c) => c.slug === currentCategory);
    return cat ? cat.name : "Products";
  }, [currentCategory, categories]);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters =
          currentCategory !== "__all__" ? { category: currentCategory } : {};
        const response = await apiClient.getProductsByCat(filters);
        setProducts(response.results);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentCategory]);

  // Navigation on category change
  const handleCategoryChange = useCallback(
    (val: string | number) => {
      const newCategory = val as string;
      if (newCategory === "__all__") {
        window.location.href = "/products";
      } else {
        window.location.href = `/category/${newCategory}`;
      }
    },
    []
  );

  // Detail Modal
  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  }, []);

  // Option Modal
  const openOptionModal = useCallback((product: Product) => {
    setOptionModalProduct(product);
    setIsOptionModalOpen(true);
  }, []);

  const closeOptionModal = useCallback(() => {
    setOptionModalProduct(null);
    setIsOptionModalOpen(false);
  }, []);

  // Add to cart (no options)
  const handleCartClick = useCallback(
    (product: Product) => {
      if (product.options.length > 0) {
        openOptionModal(product);
        return;
      }

      const price = Number(product.price);
      const discountPrice = product.discount_price ? Number(product.discount_price) : null;

      if (isNaN(price) || price <= 0) return;

      addToCart({
        id: product.id,
        name: product.name,
        price,
        discount_price: discountPrice,
        selectedOption: "default",
        image:
          product.images.find((img) => img.is_thumbnail)?.image ||
          product.images[0]?.image ||
          "/placeholder.png",
      });
    },
    [addToCart, openOptionModal]
  );

  // Helper: get all cart items for a product
  const getCartItems = useCallback(
    (product: Product) => cart.filter((item) => item.id === product.id),
    [cart]
  );

  // Total quantity per product
  const productQuantities = useMemo(() => {
    const map = new Map<number, number>();
    products.forEach((p) => {
      const total = getCartItems(p).reduce((sum, i) => sum + i.quantity, 0);
      map.set(p.id, total);
    });
    return map;
  }, [products, getCartItems]);

  // Option modal price
  const optionModalPrice = useMemo(() => {
    if (!optionModalProduct) return 0;
    return Number(optionModalProduct.discount_price ?? optionModalProduct.price ?? 0);
  }, [optionModalProduct]);

  // -----------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------
  return (
    <div className="max-w-[1200px] px-4 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center my-4">
        <h2 className="text-[var(--color-text-secondary)] text-sm md:text-md font-semibold">
          {categoryLabel}
        </h2>
        <div className="w-[12rem] md:w-[20rem]">
          <FloatingLabelSelect
            name="category"
            value={currentCategory}
            onChange={handleCategoryChange}
            placeholder="Filter by category"
            options={categoryOptions}
          />
        </div>
      </div>

      {/* Loading / Empty / Grid */}
      {loading ? (
        <p className="text-center py-12 text-[var(--color-text-secondary)]">
          Loading products...
        </p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              totalQuantity={productQuantities.get(product.id) ?? 0}
              onOpenDetail={openModal}
              onOpenOptions={openOptionModal}
              onAddToCart={handleCartClick}
              onUpdateQuantity={updateQuantity}
              getCartItems={getCartItems}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--color-text-secondary)]">
          No products available in this category.
        </div>
      )}

      {/* Modals */}
      {isModalOpen && selectedProduct && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={selectedProduct}
        />
      )}

      {isOptionModalOpen && optionModalProduct && (
        <OptionModal
          isOpen={isOptionModalOpen}
          onClose={closeOptionModal}
          options={optionModalProduct.options}
          price={optionModalPrice}
          product={optionModalProduct}
        />
      )}
    </div>
  );
};

export default Main;