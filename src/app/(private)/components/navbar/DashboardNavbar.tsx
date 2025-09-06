"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import MobileNavbar from "./DashboardMobileMenu";

const DashboardNavbar = () => {
  const [storeName, setStoreName] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme(); // ✅ useTheme gives us theme + setTheme

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Fetch store_name from localStorage on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setStoreName(parsedUserData.store_name || null);
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    }
  }, []);

  return (
    <div className="px-4 py-4 items-center justify-between">
      {/* Desktop Actions */}
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-x-4">
          {/* Mobile menu toggle button */}
          <button
            className="md:hidden hover:text-[var(--color-primary-hover)]"
            onClick={toggleMobileMenu}
          >
            <Menu />
          </button>
          <div className="flex items-center space-x-4 font-medium">
            Vendor Dashboard
          </div>
        </div>

        <div className="flex gap-x-4 items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:text-[var(--color-primary-hover)] transition-colors"
          >
            {theme === "light" ? <Moon size={22} /> : <Sun size={22} />}
          </button>

          {storeName && (
            <Link
              href={`https://${storeName}.sellexplore.shop/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative py-1 px-2 border hover:border-[var(--color-primary-hover)] hover:text-[var(--color-primary-hover)] text-[clamp(.7rem,2vw,.9rem)] rounded-lg transition-colors">
                Visit Site
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile navbar overlay */}
      <MobileNavbar isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
    </div>
  );
};

export default DashboardNavbar;
