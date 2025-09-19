// src/app/component/Nav.tsx
import React, { useRef } from "react";
import { Menu, Search as SearchIcon, X } from "lucide-react";
import { Logo, ThemeToggleButton, BookmarkButton } from "./SharedComponents";
import Link from "next/link";
import { navItems } from "@/constant/nav";
import Search from "../Search";

interface NavProps {
  theme: string;
  toggleTheme: () => void;
  totalItems: number;
  toggleBookmark: () => void;
  toggleMobileMenu: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  // New props for the controlled Search component
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchLoading: boolean;
}

const Nav: React.FC<NavProps> = ({
  theme,
  toggleTheme,
  totalItems,
  toggleBookmark,
  toggleMobileMenu,
  isSearchOpen,
  setIsSearchOpen,
  // Destructure new props
  searchQuery,
  setSearchQuery,
  isSearchLoading,
}) => {
  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex items-center justify-between w-full h-14">
      {/* ... (Logo and nav links remain the same) ... */}
      <div className="flex-shrink-0 z-20">
        <Logo />
      </div>

      <nav className="hidden md:flex flex-1 justify-center space-x-8">
        {navItems.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="hover:text-[var(--color-primary)] font-medium"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div
        className={`flex items-center space-x-4 flex-shrink-0 transition-opacity duration-200 ${
          isSearchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-2 rounded-lg hover:text-[var(--color-primary)]"
        >
          <SearchIcon size={22} />
        </button>
        <BookmarkButton
          totalItems={totalItems}
          toggleBookmark={toggleBookmark}
        />
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 hover:text-[var(--color-primary)] rounded-lg"
        >
          <Menu size={22} />
        </button>
      </div>

      {isSearchOpen && (
        <div
          ref={searchRef}
          className="absolute inset-y-0 right-0 flex items-center z-50"
        >
          <div className="flex items-center w-full max-w-[700px]">
            {/* Pass the new props down to the Search component */}
            <Search
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSearchLoading}
            />
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg hover:text-[var(--color-primary)]" // Added margin
          >
            <X size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Nav;
