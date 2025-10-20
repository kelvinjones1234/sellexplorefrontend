"use client";

import { useState, useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FeaturedProduct } from "../types";

interface Option {
  id: number;
  product: number;
  template_name: string | null;
  note: { id: number; note: string } | null;
  options: string[];
  as_template: boolean;
}

interface OptionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  options?: Option[];
  price?: number;
  product?: FeaturedProduct | null;
}

const OptionModal = ({
  isOpen = true,
  onClose = () => {},
  options = [],
  price = 0,
  product,
}: OptionModalProps) => {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [optionQuantities, setOptionQuantities] = useState<{
    [key: string]: number;
  }>({});

  // When the modal opens or the product changes, initialize the state
  // from what's already in the cart for this specific product.
  useEffect(() => {
    if (isOpen && product) {
      const existingOptionsForProduct = cart.filter(
        (item) => item.id === product.id
      );
      const initialQuantities = existingOptionsForProduct.reduce(
        (acc, item) => {
          acc[item.selectedOption] = item.quantity;
          return acc;
        },
        {} as { [key: string]: number }
      );
      setOptionQuantities(initialQuantities);
    }
  }, [isOpen, product, cart]);

  const handleOptionToggle = (option: string) => {
    setOptionQuantities((prev) => {
      const newQuantities = { ...prev };
      if (newQuantities[option]) {
        // If option is already selected, un-check it by removing it
        delete newQuantities[option];
      } else {
        // Otherwise, add it with a default quantity of 1
        newQuantities[option] = 1;
      }
      return newQuantities;
    });
  };

  const incrementQuantity = (option: string) => {
    setOptionQuantities((prev) => ({
      ...prev,
      [option]: (prev[option] || 0) + 1,
    }));
  };

  const decrementQuantity = (option: string) => {
    setOptionQuantities((prev) => {
      const newQuantities = { ...prev };
      if (newQuantities[option] > 1) {
        newQuantities[option] -= 1;
      } else {
        // If quantity is 1, decrementing removes/un-checks the option
        delete newQuantities[option];
      }
      return newQuantities;
    });
  };

  // This function now synchronizes the modal's state with the global cart state
  const handleUpdateCart = () => {
    if (!product) return;

    const currentSelections = optionQuantities;
    const productItemsInCart = cart.filter((item) => item.id === product.id);

    // 1. Add new selections or update quantities of existing ones
    Object.entries(currentSelections).forEach(([option, quantity]) => {
      const cartItemId = `${product.id}-${option}`;
      const existingItem = productItemsInCart.find(
        (item) => item.cartItemId === cartItemId
      );

      if (existingItem) {
        if (existingItem.quantity !== quantity) {
          updateQuantity(cartItemId, quantity);
        }
      } else {
        addToCart({
          id: product.id,
          name: `${product.name} (${option})`,
          price: Number(product.price), // Ensure price is a number
          discount_price: product.discount_price
            ? Number(product.discount_price)
            : null,
          selectedOption: option,
          quantity: quantity,
          image:
            product.images.find((img) => img.is_thumbnail)?.image ||
            product.images[0]?.image ||
            "/placeholder.png",
        });
      }
    });

    // 2. Remove items from cart that were deselected in the modal
    productItemsInCart.forEach((cartItem) => {
      if (!currentSelections[cartItem.selectedOption]) {
        removeFromCart(cartItem.cartItemId);
      }
    });

    // NOTE: The modal does NOT close automatically.
    // You could add a "toast" notification here to confirm the cart was updated.
  };

  if (!isOpen) return null;

  const availableOptions = options.flatMap((opt) => opt.options) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl w-full max-w-md mx-auto shadow-xl max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 p-6 pb-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Select Options
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>
          {options.some((opt) => opt.note) && (
            <div className="text-sm text-[var(--color-text-secondary)] mb-4">
              Note: {options.find((opt) => opt.note)?.note?.note || ""}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-md mx-auto">
            {availableOptions.length > 0 ? (
              availableOptions.map((option, index) => {
                const isSelected = !!optionQuantities[option];
                const quantity = optionQuantities[option] || 1;
                const isFirst = index === 0;
                const isLast = index === availableOptions.length - 1;

                return (
                  <div
                    key={index}
                    className={`p-4 border border-[var(--color-border-default)] ${
                      isFirst ? "rounded-t-2xl" : ""
                    } ${isLast ? "rounded-b-2xl" : ""} ${
                      !isLast ? "border-b-0" : ""
                    }`}
                  >
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleOptionToggle(option)}
                          className="w-4 h-4 text-[var(--color-brand-primary)] border-[var(--color-border-strong)] focus:ring-[var(--color-brand-primary)] rounded"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            {option}
                          </p>
                          <p className="text-xs text-[var(--color-text-secondary)]">
                            NGN {price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </label>
                    {isSelected && (
                      <div className="mt-2 flex items-center justify-end">
                        <div className="flex items-center border border-[var(--color-border-strong)] rounded-full">
                          <button
                            onClick={() => decrementQuantity(option)}
                            className="p-2 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-l-full transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1 text-sm text-[var(--color-brand-primary)]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(option)}
                            className="p-2 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-r-full transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-[var(--color-text-secondary)]">
                No options available for this product.
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 p-6 pt-0">
          <div className="mt-6">
            <button
              onClick={handleUpdateCart}
              className="px-4 py-4 rounded-xl w-full text-sm text-[var(--color-on-brand)] bg-[var(--color-brand-primary)] font-semibold transition hover:bg-[var(--color-brand-hover)]"
              aria-label="Update cart selections"
            >
              Update Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionModal;
