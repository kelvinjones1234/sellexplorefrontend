// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { useTheme } from "next-themes";
// import { Sun, Moon, ShoppingCart } from "lucide-react";
// import { useCart } from "@/context/CartContext";
// import CartModal from "../CartModal";

// export const Logo: React.FC = () => (
//   <Image src="/site-logo.ico" alt="sellexplore" width={30} height={30} />
// );

// export const ThemeToggleButton: React.FC = () => {
//   const [mounted, setMounted] = useState(false);
//   const { resolvedTheme, setTheme } = useTheme();

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) {
//     return <div className="p-2 w-[38px] h-[38px]" />;
//   }

//   const toggleTheme = () => {
//     setTheme(resolvedTheme === "dark" ? "light" : "dark");
//   };

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 rounded-lg hover:text-[var(--color-primary)] transition-colors"
//       aria-label="Toggle theme"
//     >
//       {resolvedTheme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
//     </button>
//   );
// };

// export const CartButton: React.FC = () => {
//   const { cart, getCartItemCount } = useCart();
//   const [isCartOpen, setIsCartOpen] = useState(false);

//   const uniqueItems = getCartItemCount(); // Use getCartItemCount to show number of unique items

//   const toggleCart = () => {
//     setIsCartOpen((prev) => !prev);
//   };

//   return (
//     <>
//       <button
//         className="relative p-2 ml-4 rounded-lg hover:text-[var(--color-primary)] transition-colors"
//         onClick={toggleCart}
//         aria-label="Toggle cart"
//       >
//         <ShoppingCart size={22} />
//         {uniqueItems > 0 && (
//           <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
//             {uniqueItems}
//           </span>
//         )}
//       </button>
//       <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
//     </>
//   );
// };



"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Sun, Moon, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartModal from "../CartModal";

export const Logo: React.FC = () => (
  <Image src="/site-logo.ico" alt="sellexplore" width={30} height={30} />
);

export const ThemeToggleButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-2 w-[38px] h-[38px]" />;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:text-[var(--color-primary)] transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
};

export const CartButton: React.FC = () => {
  const { cart, getCartItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const uniqueItems = getCartItemCount(); // Uses updated getCartItemCount to show unique products

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <>
      <button
        className="relative p-2 ml-4 rounded-lg hover:text-[var(--color-primary)] transition-colors"
        onClick={toggleCart}
        aria-label="Toggle cart"
      >
        <ShoppingCart size={22} />
        {uniqueItems > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {uniqueItems}
          </span>
        )}
      </button>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};