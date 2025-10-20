"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// The corrected and simplified CartItem structure
export interface CartItem {
  cartItemId: string; // Unique ID for a cart item, e.g., "productID-option"
  id: number; // Original product ID
  name: string; // Full name including the option, e.g., "T-Shirt (Red)"
  price: number; // Price stored as a number
  discount_price: number | null; // Discount price stored as a number
  quantity: number;
  selectedOption: string; // The specific option chosen, e.g., "Red"
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  // A simplified payload for adding items
  addToCart: (
    item: Omit<CartItem, "cartItemId" | "quantity"> & { quantity?: number }
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  // A new helper function to get the count of unique products for a cart badge
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("shoppingCart");
        return storedCart ? JSON.parse(storedCart) : [];
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        return [];
      }
    }
    return [];
  });

  // Effect to load cart from localStorage on the client-side
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("shoppingCart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      // If parsing fails, start with an empty cart
      setCart([]);
    }
  }, []);

  // Effect to save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("shoppingCart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  const addToCart = (
    product: Omit<CartItem, "cartItemId" | "quantity"> & { quantity?: number }
  ) => {
    setCart((prevCart) => {
      // Create a unique ID based on the product ID and its selected option
      const cartItemId = `${product.id}-${product.selectedOption}`;
      const addQuantity = product.quantity || 1;

      const existingItem = prevCart.find(
        (item) => item.cartItemId === cartItemId
      );

      if (existingItem) {
        // If the same product with the same option exists, just update its quantity
        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + addQuantity }
            : item
        );
      }

      // Otherwise, add it as a brand new item in the cart
      const newItem: CartItem = {
        ...product,
        cartItemId,
        quantity: addQuantity,
      };
      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    // If quantity drops to 0 or less, remove the item completely
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.cartItemId === cartItemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.discount_price ?? item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // Modified to count unique products based on product ID
  const getCartItemCount = () => {
    // Use a Set to get unique product IDs
    const uniqueProductIds = new Set(cart.map((item) => item.id));
    return uniqueProductIds.size;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
