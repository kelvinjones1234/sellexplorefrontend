"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";

import { Product } from "@/app/(public)/types";          // ← unified type
import OptionModal from "@/app/(public)/components/OptionModal";
import DetailModal from "../../components/DetailModal";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

import { ProductCard } from "../../components/ProductCard";


// ---------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------
const Main: React.FC<{
  product: Product;
  recommended: Product[];
}> = ({ product, recommended }) => {
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();

  // ---------- image carousel ----------
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // ---------- modals ----------
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [optionModalProduct, setOptionModalProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // ---------- product helpers ----------
  const price = Number(product.price) || 0;
  const discountPrice = product.discount_price ? Number(product.discount_price) : null;
  const effectivePrice = discountPrice ?? price;
  const discountPercent =
    price > 0 && discountPrice !== null && discountPrice < price
      ? Math.round(((price - discountPrice) / price) * 100)
      : null;

  const hasOptions = product.options.length > 0;

  // ---------- cart helpers ----------
  const getCartItems = useCallback(
    (p: Product) => cart.filter((i) => i.id === p.id),
    [cart]
  );

  const getTotalQuantity = useCallback(
    (productId: number) =>
      cart.filter((i) => i.id === productId).reduce((s, i) => s + i.quantity, 0),
    [cart]
  );

  const totalQuantity = getTotalQuantity(product.id);

  // ---------- image navigation ----------
  const nextImage = () => {
    setCurrentImageIndex((i) =>
      i === product.images.length - 1 ? 0 : i + 1
    );
  };
  const prevImage = () => {
    setCurrentImageIndex((i) =>
      i === 0 ? product.images.length - 1 : i - 1
    );
  };

  // ---------- modals ----------
  const openOptionModal = (p: Product) => {
    setOptionModalProduct(p);
    setIsOptionModalOpen(true);
  };
  const closeOptionModal = () => {
    setOptionModalProduct(null);
    setIsOptionModalOpen(false);
  };

  const openDetailModal = (p: Product) => {
    setSelectedProduct(p);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => {
    setSelectedProduct(null);
    setIsDetailModalOpen(false);
  };

  // ---------- add to cart (no options) ----------
  const handleAddToCart = (p: Product) => {
    if (p.options.length > 0) {
      openOptionModal(p);
      return;
    }

    const priceNum = Number(p.price);
    const discountNum = p.discount_price ? Number(p.discount_price) : null;

    if (isNaN(priceNum) || priceNum <= 0) {
      console.error("Invalid price", p);
      return;
    }

    addToCart({
      id: p.id,
      name: p.name,
      price: priceNum,
      discount_price: discountNum,
      selectedOption: "default",
      image:
        p.images.find((i) => i.is_thumbnail)?.image ||
        p.images[0]?.image ||
        "/placeholder.png",
    });
  };

  // ---------- main product +/- ----------
  const handleIncrement = () => {
    const line = getCartItems(product)[0];
    if (line) {
      updateQuantity(line.cartItemId, line.quantity + 1);
    } else if (hasOptions) {
      openOptionModal(product);
    } else {
      handleAddToCart(product);
    }
  };

  const handleDecrement = () => {
    const line = getCartItems(product)[0];
    if (line) {
      updateQuantity(line.cartItemId, line.quantity - 1);
    } else if (hasOptions) {
      openOptionModal(product);
    }
  };

  // ---------- recommended quantities ----------
  const recommendedQuantities = useMemo(() => {
    const map = new Map<number, number>();
    recommended.forEach((p) => map.set(p.id, getTotalQuantity(p.id)));
    return map;
  }, [recommended, getTotalQuantity]);

  // ---------- option modal price ----------
  const optionModalPrice = useMemo(() => {
    if (!optionModalProduct) return 0;
    return Number(optionModalProduct.discount_price ?? optionModalProduct.price ?? 0);
  }, [optionModalProduct]);

  // -----------------------------------------------------------------
  // RENDER
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] mt-[10rem]">
      {/* ────── MAIN PRODUCT ────── */}
      <div className="w-full">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row gap-x-12">
          {/* LEFT – IMAGES */}
          <div className="relative bg-[var(--color-bg)] py-6 flex-1 lg:w-1/2">
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-6 top-1/2 -translate-y-1/2 z-10 bg-[var(--color-bg)] backdrop-blur-sm p-3 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-6 top-1/2 -translate-y-1/2 z-10 bg-[var(--color-bg)] backdrop-blur-sm p-3 rounded-full shadow-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            <div className="rounded-2xl overflow-hidden shadow-sm">
              <img
                src={product.images[currentImageIndex]?.image || "/placeholder.png"}
                alt={product.name}
                className="w-full h-[350px] lg:h-[500px] object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-start overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex
                        ? "border-[var(--color-primary)]"
                        : "border-[var(--color-border-default)]"
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT – DETAILS */}
          <div className="py-6 space-y-6 flex-1 lg:w-1/2">
            <div className="space-y-1 lg:space-y-2 text-[var(--color-text)]">
              <h1 className="text-lg font-semibold capitalize text-[var(--color-text-secondary)]">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-[var(--color-brand-primary)]">
                  NGN {effectivePrice.toLocaleString()}
                </span>
                {discountPrice !== null && (
                  <>
                    <span className="text-base text-[var(--color-text-secondary)] line-through">
                      NGN {price.toLocaleString()}
                    </span>
                    <span className="bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] text-xs px-2 py-1 rounded-lg">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Extra info */}
            <div className="space-y-4">
              {product.colors && (
                <div className="text-sm font-medium text-[var(--color-text)]">
                  Color - {product.colors.join(", ")}
                </div>
              )}
              {product.length && (
                <div className="text-sm font-medium text-[var(--color-text)]">
                  Length - {product.length}
                </div>
              )}
              <p className="text-xs text-[var(--color-text-secondary)]">
                Can be made in other color combinations
              </p>
            </div>

            <div className="flex gap-3">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                {product.quantity ?? 0} IN STOCK
              </span>
              <span className="bg-purple-100 text-purple-800 capitalize text-xs font-medium px-3 py-1 rounded-full">
                {product.category?.name ?? "—"}
              </span>
            </div>

            {product.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Description
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Options preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Options
                </h3>
                <button
                  onClick={() => openOptionModal(product)}
                  className="text-[var(--color-brand-primary)] text-xs font-medium hover:text-[var(--color-brand-hover)] transition"
                >
                  See Options
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-[var(--color-border-default)] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                    <div className="bg-gray-300 rounded-sm"></div>
                    <div className="bg-gray-400 rounded-sm"></div>
                    <div className="bg-gray-500 rounded-sm"></div>
                    <div className="bg-gray-600 rounded-sm"></div>
                  </div>
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    Options
                  </span>
                </div>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  {product.options.length} Options
                </span>
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:block pt-6">
              {totalQuantity > 0 ? (
                <div className="w-full flex justify-center">
                  <div className="inline-flex items-center border border-[var(--color-border-strong)] rounded-full justify-center">
                    <button
                      onClick={handleDecrement}
                      className="p-3 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-l-full transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 text-sm text-[var(--color-brand-primary)] font-semibold">
                      {totalQuantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="p-3 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-r-full transition"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] py-4 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add To Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ────── MOBILE STICKY CTA ────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-[var(--color-border-default)] bg-[var(--color-bg)]/95 backdrop-blur-md">
        <div className="p-6">
          {totalQuantity > 0 ? (
            <div className="flex justify-center w-full">
              <div className="flex items-center border border-[var(--color-brand-primary)] rounded-full justify-center">
                <button
                  onClick={handleDecrement}
                  className="p-3 text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-l-full transition"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 text-sm text-[var(--color-brand-primary)] font-semibold">
                  {totalQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-3 text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-r-full transition"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleAddToCart(product)}
              className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] py-4 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              Add To Cart
            </button>
          )}
        </div>
      </div>

      {/* ────── RECOMMENDED PRODUCTS ────── */}
      {recommended.length > 0 && (
        <div className="max-w-[1200px] mx-auto mt-20 mb-12">
          <h2 className="text-lg font-semibold text-[var(--color-text-secondary)] mb-6">
            Recommended Items
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommended.map((rec) => (
              <ProductCard
                key={rec.id}
                product={rec}
                totalQuantity={recommendedQuantities.get(rec.id) ?? 0}
                onOpenDetail={openDetailModal}
                onOpenOptions={openOptionModal}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={updateQuantity}
                getCartItems={getCartItems}
              />
            ))}
          </div>
        </div>
      )}

      {/* ────── MODALS ────── */}
      <OptionModal
        isOpen={isOptionModalOpen}
        onClose={closeOptionModal}
        options={optionModalProduct?.options ?? []}
        price={optionModalPrice}
        product={optionModalProduct ?? product}
      />

      {isDetailModalOpen && selectedProduct && (
        <DetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Main;