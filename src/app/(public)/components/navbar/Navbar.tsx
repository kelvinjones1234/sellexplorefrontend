"use client";

import { useState, useEffect } from "react";
import Nav from "./Nav";
import MobileNav from "./Mobile";
import { useTheme } from "next-themes";
import FilteredItems from "../../[store]/components/FilteredItems";
import DetailModal from "../../[store]/components/DetailModal"; // Adjust path as needed
import { apiClient } from "../../api";
import { useDebounce } from "@/hooks/useDebounce";
import { FilteredProductResponse, Product } from "../../types"; // Import Product type

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState<
    FilteredProductResponse<Product>
  >({ count: 0, results: [] });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Lifted modal state from FilteredItems
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Lifted modal handlers
  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <>
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 h-screen overflow-y-auto"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="bg-[var(--color-bg-primary)] pt-[6rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <FilteredItems
              products={searchResults}
              isLoading={isSearchLoading}
              error={searchError}
              onOpenModal={openModal} // Pass down the open handler
            />
          </div>
        </div>
      )}

      {/* Render DetailModal at Navbar level (overlays everything) */}
      {isModalOpen && selectedProduct && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={selectedProduct}
        />
      )}

      <header className="relative w-full bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] rounded-full max-w-[1200px] mx-auto">
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
