"use client";
import React from "react";
import {
  X,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Share,
} from "lucide-react";
import { FeaturedProduct } from "../../types";

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
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  console.log("product", product);

  if (!isOpen || !product) return null;

  const displayProduct = product;

  const price = Number(displayProduct.price) || 0;
  const discountPrice = displayProduct.discount_price
    ? Number(displayProduct.discount_price)
    : null;

  const discountPercent =
    price > 0 && discountPrice !== null && discountPrice < price
      ? Math.round(((price - discountPrice) / price) * 100)
      : null;

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

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between p-4 max-w-[1200px] mx-auto">
          <button
            onClick={onClose}
            aria-label="Share"
            className="py-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Share className="w-6 h-6 text-gray-600" />
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            className="py-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-y-auto w-full">
        <div className="max-w-[1200px] mx-auto w-full flex flex-col lg:flex-row">
          {/* Left: Images */}
          <div className="relative bg-gray-50 p-4 flex-1 lg:w-1/2">
            {discountPercent !== null && (
              <span className="absolute top-4 left-4 bg-pink-500 text-white text-sm font-semibold px-3 py-1 rounded-full z-10 shadow-lg">
                {discountPercent}% OFF
              </span>
            )}

            {displayProduct.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
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
              <div className="flex gap-2 mt-4 justify-center lg:justify-start">
                {displayProduct.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? "border-[var(--color-primary)]"
                        : "border-gray-300"
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
          <div className="py-6 px-4 space-y-6 flex-1 lg:w-1/2">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-gray-900 capitalize">
                {displayProduct.name}
              </h1>
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-gray-900">
                  NGN {(discountPrice ?? price).toLocaleString()}
                </span>
                {discountPrice !== null && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      NGN {price.toLocaleString()}
                    </span>
                    <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {displayProduct.colors && (
                <div className="text-sm font-medium text-gray-700">
                  Color - {displayProduct.colors.join(", ")}
                </div>
              )}
              {displayProduct.length && (
                <div className="text-sm font-medium text-gray-700">
                  Length - {displayProduct.length}
                </div>
              )}
              <p className="text-sm text-gray-600">
                Can be made in other color combinations
              </p>
            </div>

            <div className="flex gap-3">
              <span className="bg-green-100 text-green-800 text-[.65rem] font-medium px-3 py-1 rounded-full">
                {displayProduct.quantity} IN STOCK
              </span>
              <span className="bg-purple-100 text-purple-800 text-[.65rem] font-medium px-3 py-1 rounded-full">
                {displayProduct.category.name}
              </span>
            </div>

            {displayProduct.description && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {displayProduct.description}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Options</h3>
                <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                  See Options →
                </button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 grid grid-cols-2 gap-0.5">
                    <div className="bg-gray-300 rounded-sm"></div>
                    <div className="bg-gray-400 rounded-sm"></div>
                    <div className="bg-gray-500 rounded-sm"></div>
                    <div className="bg-gray-600 rounded-sm"></div>
                  </div>
                  <span className="font-medium text-gray-900">Sizes</span>
                </div>
                <span className="text-gray-600">10 Options</span>
              </div>
            </div>

            {/* Desktop Add to Cart */}
            <div className="hidden lg:block pt-6">
              <button className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold text-md hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg flex items-center justify-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Add to Cart */}
      <div className="lg:hidden border-t border-gray-200">
        <div className="p-4">
          <button className="w-full bg-[var(--color-primary)] text-white py-3 rounded-xl font-semibold text-md hover:bg-[var(--color-primary-hover)] transition-colors shadow-lg flex items-center justify-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
