
"use client";
import React from "react";
import {
  X,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Share,
  Plus,
  Minus,
} from "lucide-react";
import { FeaturedProduct } from "../../types";
import OptionModal from "../../components/OptionModal";
import { useCart } from "@/context/CartContext";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: FeaturedProduct | null;
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isOptionModalOpen, setIsOptionModalOpen] = React.useState(false);

  if (!isOpen || !product) return null;

  const displayProduct = product;

  const price = Number(displayProduct.price) || 0;
  const discountPrice = displayProduct.discount_price
    ? Number(displayProduct.discount_price)
    : null;

  const effectivePrice = discountPrice ?? price;

  const discountPercent =
    price > 0 && discountPrice !== null && discountPrice < price
      ? Math.round(((price - discountPrice) / price) * 100)
      : null;

  const hasOptions = displayProduct.options[0]?.options?.length > 0;

  // Calculate total quantity of this product in the cart (sum across all options)
  const getTotalProductQuantity = () => {
    return cart
      .filter((item) => item.id === displayProduct.id)
      .reduce((total, item) => total + item.quantity, 0);
  };

  // Get the cart item for a product (for products without options or first option for products with options)
  const getCartItemForProduct = () => {
    if (!hasOptions) {
      return cart.find(
        (item) =>
          item.id === displayProduct.id && item.selectedOption === "default"
      );
    }
    // For products with options, return the first matching cart item
    return cart.find((item) => item.id === displayProduct.id);
  };

  const totalQuantity = getTotalProductQuantity();
  const cartItem = getCartItemForProduct();

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === displayProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayProduct.images.length - 1 : prev - 1
    );
  };

  const openOptionModal = () => {
    setIsOptionModalOpen(true);
  };

  const closeOptionModal = () => {
    setIsOptionModalOpen(false);
  };

  const handleAddToCart = () => {
    if (hasOptions) {
      openOptionModal();
    } else {
      addToCart({
        id: displayProduct.id,
        name: displayProduct.name,
        price: Number(displayProduct.price),
        discount_price: displayProduct.discount_price
          ? Number(displayProduct.discount_price)
          : null,
        selectedOption: "default",
        image:
          displayProduct.images.find((img) => img.is_thumbnail)?.image ||
          displayProduct.images[0]?.image ||
          "/placeholder.png",
      });
    }
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity + 1);
    } else if (hasOptions) {
      openOptionModal();
    } else {
      handleAddToCart();
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
    } else if (hasOptions) {
      openOptionModal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 z-20 bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between p-6 max-w-[1200px] mx-auto">
          <button
            onClick={onClose}
            aria-label="Share"
            className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
          >
            <Share className="w-5 h-5 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row">
          {/* Left: Images */}
          <div className="relative bg-[var(--color-bg)] p-6 flex-1 lg:w-1/2">
            {discountPercent !== null && (
              <span className="absolute top-6 left-6 bg-[var(--color-primary)] text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow-lg">
                {discountPercent}% OFF
              </span>
            )}

            {displayProduct.images.length > 1 && (
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
                src={
                  displayProduct.images[currentImageIndex]?.image ||
                  "/placeholder.png"
                }
                alt={displayProduct.name}
                className="w-full h-[350px] lg:h-[500px] object-cover"
              />
            </div>

            {/* Thumbnail previews */}
            {displayProduct.images.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center lg:justify-start overflow-x-auto">
                {displayProduct.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-[var(--color-primary)]"
                        : "border-[var(--color-border)]"
                    }`}
                  >
                    <img
                      src={img.image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="py-6 px-6 space-y-6 flex-1 lg:w-1/2">
            <div className="space-y-1 lg:space-y-2 text-[var(--color-text)]">
              <h1 className="text-lg font-semibold capitalize text-[var(--color-primary)]">
                {displayProduct.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold">
                  NGN {effectivePrice.toLocaleString()}
                </span>
                {discountPrice !== null && (
                  <>
                    <span className="text-base text-gray-500 line-through">
                      NGN {price.toLocaleString()}
                    </span>
                    <span className="bg-[var(--color-primary)] text-[var(--color-text)] text-xs px-2 py-1 rounded-lg">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {displayProduct.colors && (
                <div className="text-sm font-medium text-[var(--color-text)]">
                  Color - {displayProduct.colors.join(", ")}
                </div>
              )}
              {displayProduct.length && (
                <div className="text-sm font-medium text-[var(--color-text)]">
                  Length - {displayProduct.length}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Can be made in other color combinations
              </p>
            </div>

            <div className="flex gap-3">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                {displayProduct.quantity} IN STOCK
              </span>
              <span className="bg-purple-100 text-purple-800 capitalize text-xs font-medium px-3 py-1 rounded-full">
                {displayProduct.category.name}
              </span>
            </div>

            {displayProduct.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Description
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {displayProduct.description}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--color-text)]">
                  Options
                </h3>
                <button
                  onClick={openOptionModal}
                  className="text-[var(--color-primary)] text-xs font-medium hover:text-[var(--color-primary-hover)] transition"
                >
                  See Options →
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg">
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
                <span className="text-xs text-gray-500">
                  {displayProduct.options[0]?.options?.length || 0} Options
                </span>
              </div>
            </div>

            {/* Desktop Add to Cart */}
            <div className="hidden lg:block pt-6">
              {totalQuantity > 0 ? (
                <div className="w-full flex justify-center">
                  <div className="inline-flex items-center border border-[var(--color-primary)] rounded-full justify-center">
                    <button
                      onClick={handleDecrement}
                      className="p-3 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-l-full transition"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 text-sm text-[var(--color-primary)] font-semibold">
                      {totalQuantity}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="p-3 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-r-full transition"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-4 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add To Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Add to Cart */}
      <div className="lg:hidden flex-shrink-0 border-t border-[var(--color-border)]">
        <div className="p-6">
          {totalQuantity > 0 ? (
            <div className="flex justify-center w-full">
              <div className="flex items-center border border-[var(--color-primary)] rounded-full justify-center">
                <button
                  onClick={handleDecrement}
                  className="p-3 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-l-full transition"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 text-sm text-[var(--color-primary)] font-semibold">
                  {totalQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="p-3 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-r-full transition"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white py-4 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              Add To Cart
            </button>
          )}
        </div>
      </div>

      {/* Option Modal */}
      <OptionModal
        isOpen={isOptionModalOpen}
        onClose={closeOptionModal}
        options={displayProduct.options}
        price={effectivePrice}
        product={displayProduct}
      />
    </div>
  );
};

export default DetailModal;
