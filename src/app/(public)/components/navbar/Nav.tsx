"use client";

import React, { useRef, useCallback } from "react";
import { Menu, Search as SearchIcon, X } from "lucide-react";
import { Logo, ThemeToggleButton, CartButton } from "./SharedComponents";
import Link from "next/link";
import { navItems } from "@/constant/nav";
import Search from "../Search";

interface NavProps {
  theme: string;
  toggleTheme: () => void;
  toggleMobileMenu: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  onSearchResults?: (results: any, isLoading: boolean, query: string) => void; // <-- ADD query: string
}

const Nav: React.FC<NavProps> = ({
  theme,
  toggleTheme,
  toggleMobileMenu,
  isSearchOpen,
  setIsSearchOpen,
  onSearchResults,
}) => {
  const searchRef = useRef<HTMLDivElement>(null);

  // Memoize the callback to prevent re-renders
  const handleSearchResults = useCallback(
  (results: any, isLoading: boolean, query: string) => { // <-- ADD query
    console.log("[Nav] Search results:", results, "Loading:", isLoading, "Query:", query);
    if (onSearchResults) {
      onSearchResults(results, isLoading, query); // <-- PASS query
    }
  },
  [onSearchResults]
);

  return (
    <div className="relative flex items-center z-40 justify-between w-full h-14">
      <div className="flex-shrink-0">
        <Logo />
      </div>

      <nav className="hidden md:flex flex-1 text-[var(--color-text-secondary)] justify-center space-x-8">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="hover:text-[var(--color-brand-primary)] font-medium"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div
        className={`flex items-center flex-shrink-0 transition-opacity duration-200 ${
          isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 ml-4 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)]"
        >
          <SearchIcon size={22} />
        </button>
        <div className="text-[var(--color-text-secondary)]">
          <CartButton />
        </div>
        <button
          onClick={toggleMobileMenu}
          className="md:hidden ml-4 p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-brand-primary)] rounded-lg"
        >
          <Menu size={22} />
        </button>
      </div>

      {isSearchOpen && (
        <div
          ref={searchRef}
          className="absolute inset-y-0 right-0 flex items-center"
        >
          <div className="flex items-center w-full max-w-[700px]">
            <Search
              autoFocus
              onSearchResults={handleSearchResults}
            />
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg hover:text-[var(--color-brand-primary)]"
          >
            <X size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Nav;