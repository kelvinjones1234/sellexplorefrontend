"use client";

import { useState, useCallback } from "react";
import Nav from "./Nav";
import MobileNav from "./Mobile";
import { useTheme } from "next-themes";
import FilteredItems from "../../[store]/components/FilteredItems";
import DetailModal from "../../[store]/components/DetailModal";
import { FilteredProductResponse, Product } from "../../types";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    FilteredProductResponse<Product>
  >({
    count: 0,
    results: [],
  });
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  // Lifted modal state from FilteredItems
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { theme, setTheme } = useTheme();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Memoized callback to handle search results with loading state
  const handleSearchResults = useCallback(
    (
      results: FilteredProductResponse<Product>,
      isLoading: boolean,
      query: string // <-- ADD query
    ) => {
      console.log(
        "[Navbar] Search results received:",
        results,
        "Loading:",
        isLoading,
        "Query:", // <-- Optional log
        query
      );
      setSearchResults(results);
      setIsSearchLoading(isLoading);
      setSearchQuery(query); // <-- SET THE STATE
    },
    []
  );

  // Lifted modal handlers
  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchResults({ count: 0, results: [] });
    setIsSearchLoading(false);
    setSearchQuery(""); // <-- CLEAR THE STATE
  };

  return (
    <>
      {/* Header with higher z-index */}
      <header className="relative w-full bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-full max-w-[1200px] mx-auto z-[60]">
        <div className="py-2 lg:py-4 container-padding">
          <Nav
            theme={theme ?? "system"}
            toggleTheme={toggleTheme}
            toggleMobileMenu={toggleMobileMenu}
            isSearchOpen={isSearchOpen}
            setIsSearchOpen={setIsSearchOpen}
            onSearchResults={handleSearchResults}
          />
        </div>
      </header>

      {/* Search overlay with lower z-index than header */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 h-screen overflow-y-auto z-40"
          onClick={handleCloseSearch}
        >
          <div
            className="bg-[var(--color-bg-primary)] pt-[6rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <FilteredItems
              products={searchResults}
              isLoading={isSearchLoading}
              error={null}
              onOpenModal={openModal}
              searchWord={searchQuery} // <-- PASS THE PROP
            />
          </div>
        </div>
      )}

      {/* Render DetailModal at highest level (overlays everything) */}
      {isModalOpen && selectedProduct && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={selectedProduct}
        />
      )}

      <MobileNav isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
    </>
  );
};

export default Navbar;
