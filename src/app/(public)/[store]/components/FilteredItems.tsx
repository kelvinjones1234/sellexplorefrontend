"use client";

import { ShoppingCart, Plus, Minus } from "lucide-react";
import React, { useState, useMemo, useCallback, memo } from "react";
import { FilteredProductResponse } from "../../types";
import { useCart } from "@/context/CartContext";
import OptionModal from "@/app/(public)/components/OptionModal";

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
  onOpenModal?: (product: Product) => void; // Optional, but passed from Navbar
}

// Memoized ProductCard component to prevent unnecessary re-renders
const ProductCard = memo(
  ({
    product,
    totalQuantity,
    onOpenModal,
    onOpenOptionModal,
    onHandleCartClick,
    onUpdateQuantity,
    getCartItemForProduct,
  }: {
    product: Product;
    totalQuantity: number;
    onOpenModal?: (product: Product) => void;
    onOpenOptionModal: (product: Product) => void;
    onHandleCartClick: (product: Product) => void;
    onUpdateQuantity: (cartItemId: string, quantity: number) => void;
    getCartItemForProduct: (product: Product) => any;
  }) => {
    // Memoize expensive calculations
    const calculations = useMemo(() => {
      const originalPrice = product.oldPrice ?? product.price;
      const salePrice = product.oldPrice ? product.price : product.price;
      let discountPercent: number | null = null;
      if (product.oldPrice && product.oldPrice > product.price) {
        discountPercent = Math.round(
          ((originalPrice - salePrice) / originalPrice) * 100
        );
      }
      let badge: string | null = product.discount;
      if (!badge && discountPercent !== null) {
        badge = `${discountPercent}% OFF`;
      }
      const thumbnail =
        product.images?.find((img) => img.thumbnail)?.image ||
        product.images?.[0]?.image ||
        product.image ||
        "/placeholder.png";
      const hasOptions = !!(product.options?.length ?? 0);

      return {
        originalPrice,
        salePrice,
        discountPercent,
        badge,
        thumbnail,
        hasOptions,
      };
    }, [product]);

    const cartItem = useMemo(
      () => getCartItemForProduct(product),
      [product, getCartItemForProduct]
    );

    const handleDecrease = useCallback(() => {
      if (cartItem) {
        onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
      } else if (calculations.hasOptions) {
        onOpenOptionModal(product);
      }
    }, [
      cartItem,
      calculations.hasOptions,
      onUpdateQuantity,
      onOpenOptionModal,
      product,
    ]);

    const handleIncrease = useCallback(() => {
      if (cartItem) {
        onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1);
      } else if (calculations.hasOptions) {
        onOpenOptionModal(product);
      } else {
        onHandleCartClick(product);
      }
    }, [
      cartItem,
      calculations.hasOptions,
      onUpdateQuantity,
      onOpenOptionModal,
      onHandleCartClick,
      product,
    ]);

    const handleImageClick = useCallback(() => {
      onOpenModal?.(product); // Optional chaining since it might not be passed
    }, [product, onOpenModal]);

    const handleCartButtonClick = useCallback(() => {
      onHandleCartClick(product);
    }, [product, onHandleCartClick]);

    return (
      <div className="bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border-default)] overflow-hidden group relative hover:shadow-sm transition">
        <div className="relative">
          {calculations.badge && (
            <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
              {calculations.badge}
            </span>
          )}
          <img
            src={calculations.thumbnail}
            alt={product.name}
            className="w-full h-[12rem] sm:h-[15rem] object-cover cursor-pointer"
            onClick={handleImageClick}
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="py-4 px-2">
          <h3
            className="font-medium text-[var(--color-body)] text-sm truncate"
            title={product.name}
          >
            {product.name}
          </h3>
          <div className="flex flex-col mt-2">
            <span className="text-[var(--color-brand-primary)] font-semibold text-sm">
              NGN {product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-[var(--color-body)] line-through text-xs">
                NGN {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-[.7rem] text-[var(--color-text-muted)] leading-relaxed">
              Options: <span>{product.options?.length || "None"}</span>
            </div>

            {totalQuantity > 0 ? (
              <div className="flex items-center border border-[var(--color-border-strong)] rounded-full">
                <button
                  onClick={handleDecrease}
                  className="p-1 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-l-full transition"
                  aria-label={`Decrease quantity for ${product.name}`}
                >
                  <Minus size={14} />
                </button>
                <span className="px-2 text-sm text-[var(--color-brand-primary)] min-w-[2rem] text-center">
                  {totalQuantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-1 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-r-full transition"
                  aria-label={`Increase quantity for ${product.name}`}
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleCartButtonClick}
                className="border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] rounded-full h-8 w-8 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] transition"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

const FilteredItems: React.FC<FilteredItemsProps> = ({
  products,
  isLoading,
  error,
  onOpenModal,
}) => {
  const { cart, addToCart, updateQuantity } = useCart();

  // Modal states (OptionModal only; DetailModal lifted to Navbar)
  const [optionModalProduct, setOptionModalProduct] = useState<Product | null>(
    null
  );
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  // Memoize cart quantities
  const productQuantities = useMemo(() => {
    const quantities = new Map<number, number>();

    if (!products.results || products.results.length === 0) {
      return quantities;
    }

    products.results.forEach((product) => {
      const totalQuantity = cart
        .filter((item) => item.id === product.id)
        .reduce((total, item) => total + item.quantity, 0);
      quantities.set(product.id, totalQuantity);
    });

    return quantities;
  }, [cart, products.results]);

  // Memoized callback functions
  const openOptionModal = useCallback((product: Product) => {
    setOptionModalProduct(product);
    setIsOptionModalOpen(true);
  }, []);

  const closeOptionModal = useCallback(() => {
    setOptionModalProduct(null);
    setIsOptionModalOpen(false);
  }, []);

  const handleCartClick = useCallback(
    (product: Product) => {
      const hasOptions = !!(product.options?.length ?? 0);

      if (hasOptions) {
        openOptionModal(product);
      } else {
        const originalPrice = product.oldPrice ?? product.price;
        const discountPrice = product.oldPrice ? product.price : null;
        const thumbnail =
          product.images?.find((img) => img.thumbnail)?.image ||
          product.images?.[0]?.image ||
          product.image ||
          "/placeholder.png";

        if (isNaN(originalPrice) || originalPrice <= 0) {
          console.error(
            `Invalid price for product ${product.name}:`,
            product.price
          );
          return;
        }

        addToCart({
          id: product.id,
          name: product.name,
          price: originalPrice,
          discount_price: discountPrice,
          selectedOption: "default",
          image: thumbnail,
        });
      }
    },
    [addToCart, openOptionModal]
  );

  const getCartItemForProduct = useCallback(
    (product: Product) => {
      const hasOptions = !!(product.options?.length ?? 0);
      if (!hasOptions) {
        return cart.find(
          (item) => item.id === product.id && item.selectedOption === "default"
        );
      }
      return cart.find((item) => item.id === product.id);
    },
    [cart]
  );

  const optionModalPrice = useMemo(() => {
    if (!optionModalProduct) return 0;
    return Number(optionModalProduct.price ?? 0);
  }, [optionModalProduct]);

  // Forward the onOpenModal from props (for DetailModal)
  const forwardOpenModal = useCallback(
    (product: Product) => {
      onOpenModal?.(product);
    },
    [onOpenModal]
  );

  return (
    <div className="max-w-[1200px] px-4 mx-auto py-[2.5rem]">
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-[var(--color-bg-primary)] rounded-2xl border border-[var(--color-border-secondary)] overflow-hidden animate-pulse"
            >
              {/* Image skeleton */}
              <div className="w-full h-[12rem] sm:h-[15rem] bg-[var(--color-border-default)]" />

              <div className="py-4 px-2 space-y-3">
                {/* Title skeleton */}
                <div className="h-4 bg-[var(--color-border-default)] rounded w-3/4" />
                {/* Price skeleton */}
                <div className="h-4 bg-[var(--color-border-default)] rounded w-1/2" />
                {/* Cart button skeleton */}
                <div className="flex justify-end mt-3">
                  <div className="h-8 w-8 rounded-full bg-[var(--color-border-default)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : products.count === 0 ? (
        <div className="text-center py-12">
          <div className="text-[var(--color-text-secondary)] mb-4">
            <ShoppingCart size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-[var(--color-text-secondary)] text-lg">
            No products found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              totalQuantity={productQuantities.get(product.id) || 0}
              onOpenModal={forwardOpenModal}
              onOpenOptionModal={openOptionModal}
              onHandleCartClick={handleCartClick}
              onUpdateQuantity={updateQuantity}
              getCartItemForProduct={getCartItemForProduct}
            />
          ))}
        </div>
      )}

      {/* Option Modal (kept here for cart actions) */}
      {isOptionModalOpen && optionModalProduct && (
        <OptionModal
          isOpen={isOptionModalOpen}
          onClose={closeOptionModal}
          options={optionModalProduct.options || []}
          price={optionModalPrice}
          product={optionModalProduct}
        />
      )}
    </div>
  );
};

export default FilteredItems;
