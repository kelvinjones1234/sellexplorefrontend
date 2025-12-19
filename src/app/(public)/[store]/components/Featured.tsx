"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { Product, Category } from "../../types";
import DetailModal from "./DetailModal";
import OptionModal from "../../components/OptionModal";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ProductCard } from "./ProductCard";

interface FeaturedProps {
  products: Product[];
  categories: Category[];
}

const Featured = ({ products, categories }: FeaturedProps) => {
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionModalProduct, setOptionModalProduct] = useState<Product | null>(null);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  // Early return: no products
  if (!products || products.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-4">
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-3">
            <Heart className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            No featured products available
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Check back later for new arrivals
          </p>
        </div>
      </div>
    );
  }

  // Category dropdown options
  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "" },
      ...categories.map((cat) => ({
        value: cat.slug,
        label: cat.name,
      })),
    ],
    [categories]
  );

  // Total quantity per product in cart
  const productQuantities = useMemo(() => {
    const map = new Map<number, number>();
    products.forEach((p) => {
      const total = cart
        .filter((item) => item.id === p.id)
        .reduce((sum, item) => sum + item.quantity, 0);
      map.set(p.id, total);
    });
    return map;
  }, [cart, products]);

  // Navigation on category change
  const handleCategoryChange = useCallback(
    (val: string) => {
      setSelectedCategory(val);
      if (val === "all") {
        router.push("/products");
      } else {
        router.push(`/category/${val}`);
      }
    },
    [router]
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

  // Add to cart (non-option product)
  const handleCartClick = useCallback(
    (product: Product) => {
      const hasOptions = product.options.length > 0;
      if (hasOptions) {
        openOptionModal(product);
      } else {
        const price = Number(product.price);
        const discountPrice = product.discount_price
          ? Number(product.discount_price)
          : null;

        if (isNaN(price) || price <= 0) {
          console.error(`Invalid price for ${product.name}`);
          return;
        }

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
      }
    },
    [addToCart, openOptionModal]
  );

  // Helper: get cart items for a product
  const getCartItems = useCallback(
    (product: Product) => cart.filter((item) => item.id === product.id),
    [cart]
  );

  // Price for OptionModal
  const optionModalPrice = useMemo(() => {
    if (!optionModalProduct) return 0;
    return Number(optionModalProduct.discount_price ?? optionModalProduct.price ?? 0);
  }, [optionModalProduct]);

  return (
    <div className="w-full max-w-[1200px] mx-auto p-4 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-[var(--color-brand-primary)] text-lg md:text-2xl font-semibold">
          Featured Items
        </h2>
        <div className="w-full sm:w-[12rem] md:w-[20rem]">
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

export default Featured;