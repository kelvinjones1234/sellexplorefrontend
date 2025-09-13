"use client";

import React, { useState } from "react";
import DesktopNavbar from "./Desktop";
import MobileNavbar from "./Mobile";
import { useBookmark } from "@/context/BookmarkContext";
import { useTheme } from "next-themes"; // ✅ import hook

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, toggleBookmark } = useBookmark();
  const { theme, setTheme } = useTheme(); // ✅ get theme and setter

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      <header className="w-full bg-[var(--color-bg-secondary)] rounded-full max-w-[1200px] mx-auto">
        <div className="py-2 sm:py-4 md:py-6 container-padding">
          <DesktopNavbar
            theme={theme ?? "system"} // ✅ pass theme safely
            toggleTheme={toggleTheme}
            totalItems={totalItems}
            toggleBookmark={toggleBookmark}
            toggleMobileMenu={toggleMobileMenu}
          />
        </div>
      </header>
      <MobileNavbar
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMobileMenu}
        totalItems={totalItems}
      />
    </>
  );
};

export default Navbar;
