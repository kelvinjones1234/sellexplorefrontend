"use client";

import { useState, useEffect } from "react";
import Nav from "./Nav";
import MobileNav from "./Mobile";
import { useTheme } from "next-themes";
import FilteredItems from "../../[store]/components/FilteredItems";
import { apiClient } from "../../api";
import { useDebounce } from "@/hooks/useDebounce";
import { FilteredProductResponse } from "../../types";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState<
    FilteredProductResponse<any>
  >({ count: 0, results: [] });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!debouncedSearchQuery) {
      setSearchResults({ count: 0, results: [] });
      setSearchError(null);
      return;
    }

    const fetchProducts = async () => {
      setIsSearchLoading(true);
      setSearchError(null);
      try {
        const response = await apiClient.getFilteredProduct({
          search: debouncedSearchQuery,
        });
        setSearchResults(response);
      } catch (err: any) {
        setSearchError(err.message || "Failed to fetch search results");
        setSearchResults({ count: 0, results: [] });
      } finally {
        setIsSearchLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedSearchQuery]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <>
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 h-screen z-40 overflow-y-auto"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-[var(--color-bg)] pt-[6rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <FilteredItems
              products={searchResults}
              isLoading={isSearchLoading}
              error={searchError}
            />
          </div>
        </div>
      )}

      <header className="relative z-50 w-full bg-[var(--color-bg-secondary)] rounded-full max-w-[1200px] mx-auto">
        <div className="py-2 lg:py-4 container-padding">
          <Nav
            theme={theme ?? "system"}
            toggleTheme={toggleTheme}
            toggleMobileMenu={toggleMobileMenu}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={(val) => {
              setIsSearchOpen(val);
              if (!val) {
                setSearchQuery("");
                setSearchResults({ count: 0, results: [] });
                setSearchError(null);
              }
            }}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchLoading={isSearchLoading}
          />
        </div>
      </header>

      <MobileNav isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
    </>
  );
};

export default Navbar;
