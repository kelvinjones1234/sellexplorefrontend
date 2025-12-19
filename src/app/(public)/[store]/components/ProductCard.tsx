// src/components/product/ProductCard.tsx
"use client";

import { memo, useMemo, useCallback } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Product, ProductCardProps } from "../../types";

export const ProductCard = memo(function ProductCard({
  product,
  totalQuantity,
  onOpenDetail,
  onOpenOptions,
  onAddToCart,
  onUpdateQuantity,
  getCartItems,
}: ProductCardProps) {
  /* ───── calculations ───── */
  const calc = useMemo(() => {
    const price = Number(product.price) || 0;
    const discount = product.discount_price ? Number(product.discount_price) : null;
    const discountPercent =
      price > 0 && discount !== null && discount < price
        ? Math.round(((price - discount) / price) * 100)
        : null;

    const thumbnail =
      product.images.find((i) => i.is_thumbnail)?.image ||
      product.images[0]?.image ||
      "/placeholder.png";

    const hasOptions = product.options.length > 0;
    const finalPrice = discount ?? price;

    return { price, discount, discountPercent, thumbnail, hasOptions, finalPrice };
  }, [product]);

  const cartLines = useMemo(() => getCartItems(product), [product, getCartItems]);

  /* ───── handlers ───── */
  const handleDecrease = useCallback(() => {
    if (!cartLines.length) return;
    if (cartLines.length > 1 || calc.hasOptions) {
      onOpenOptions(product);
    } else {
      onUpdateQuantity(cartLines[0].cartItemId, cartLines[0].quantity - 1);
    }
  }, [cartLines, calc.hasOptions, onOpenOptions, onUpdateQuantity, product]);

  const handleIncrease = useCallback(() => {
    if (calc.hasOptions) onOpenOptions(product);
    else onAddToCart(product);
  }, [calc.hasOptions, onOpenOptions, onAddToCart, product]);

  const handleImage = () => onOpenDetail(product);
  const handleCart = () => onAddToCart(product);

  /* ───── render ───── */
  return (
    <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border-default)] overflow-hidden group relative hover:shadow-sm transition">
      {calc.discountPercent !== null && (
        <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
          {calc.discountPercent}% OFF
        </span>
      )}

      <img
        src={calc.thumbnail}
        alt={product.name}
        className="w-full h-[12rem] sm:h-[15rem] object-cover cursor-pointer"
        onClick={handleImage}
        loading="lazy"
      />

      <div className="py-4 px-2">
        <h3 className="font-medium text-[var(--color-text-primary)] text-sm truncate" title={product.name}>
          {product.name}
        </h3>

        <div className="flex flex-col mt-2">
          <span className="text-[var(--color-brand-primary)] font-semibold text-sm">
            NGN {calc.finalPrice.toLocaleString()}
          </span>
          {calc.discount !== null && (
            <span className="text-[var(--color-text-primary)] line-through text-xs">
              NGN {calc.price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="text-[.7rem] text-[var(--color-text-secondary)]">
            Options: <span>{calc.hasOptions ? product.options[0].options?.length ?? 0 : "None"}</span>
          </div>

          {totalQuantity > 0 ? (
            <div className="flex items-center border border-[var(--color-border-strong)] rounded-full">
              <button onClick={handleDecrease} className="p-1 hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-l-full transition">
                <Minus size={14} />
              </button>
              <span className="px-2 text-sm text-[var(--color-brand-primary)] min-w-[2rem] text-center">
                {totalQuantity}
              </span>
              <button onClick={handleIncrease} className="p-1 hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-r-full transition">
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleCart}
              className="border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] rounded-full h-8 w-8 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)]"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";