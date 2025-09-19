// src/app/component/Search.tsx
"use client";

import FloatingLabelInput from "@/app/component/fields/Input";
import React, { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { apiClient } from "../api";
import { FilteredProductResponse } from "../types";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchResults?: (results: FilteredProductResponse<any>) => void;
}

const Search: React.FC<SearchProps> = ({ onSearchResults, ...props }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("[Search] searchQuery:", searchQuery);
    console.log("[Search] debouncedSearchQuery:", debouncedSearchQuery);
    console.log("[Search] isLoading:", isLoading);

    if (!debouncedSearchQuery) {
      console.log("[Search] No query, resetting results");
      onSearchResults?.({ count: 0, results: [] });
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      console.log(
        "[Search] Fetching products for query:",
        debouncedSearchQuery
      );
      try {
        const response = await apiClient.getFilteredProduct({
          search: debouncedSearchQuery,
        });
        console.log("[Search] API response:", response);
        onSearchResults?.(response);
      } catch (err: any) {
        console.error("[Search] API error:", err);
        setError(err.message || "Failed to fetch search results");
        onSearchResults?.({ count: 0, results: [] });
      } finally {
        setIsLoading(false);
        console.log("[Search] isLoading set to false");
      }
    };

    fetchProducts();
  }, [debouncedSearchQuery, onSearchResults]);

  return (
    <div className="max-w-[700px] mx-auto w-full z-50">
      <FloatingLabelInput
        type="text"
        name="search-field"
        placeholder="Search for items"
        value={searchQuery}
        onChange={(e) => {
          console.log("[Search] Input changed:", e.target.value);
          setSearchQuery(e.target.value);
        }}
        autoFocus={props.autoFocus}
        disabled={isLoading}
        onKeyDown={(e) => {
          console.log("[Search] Key pressed:", e.key);
          if (props.onKeyDown) props.onKeyDown(e);
        }}
        {...props}
      />
      {isLoading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default Search;
