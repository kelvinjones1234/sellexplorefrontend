// src/app/component/Search.tsx
"use client";

import FloatingLabelInput from "@/app/component/fields/Input";
import React, { useState, useEffect, useRef, memo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { apiClient } from "../api";
import { FilteredProductResponse } from "../types";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearchResults?: (
    results: FilteredProductResponse<any>,
    isLoading: boolean,
    query: string
  ) => void;
}

const Search: React.FC<SearchProps> = memo(({ onSearchResults, ...props }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Store the callback in a ref to avoid re-renders
  const onSearchResultsRef = useRef(onSearchResults);
  // Store input ref to maintain focus
  const inputRef = useRef<HTMLInputElement>(null);
  const isFetchingRef = useRef(false);

  // Update the ref whenever the callback changes
  useEffect(() => {
    onSearchResultsRef.current = onSearchResults;
  }, [onSearchResults]);

  useEffect(() => {
    console.log("[Search] debouncedSearchQuery:", debouncedSearchQuery);

    if (!debouncedSearchQuery) {
      console.log("[Search] No query, resetting results");
      // onSearchResultsRef.current?.({ count: 0, results: [] }, false);
      onSearchResultsRef.current?.({ count: 0, results: [] }, false, ""); // <-- ADD ""
      return;
    }

    // Prevent multiple simultaneous fetches
    if (isFetchingRef.current) {
      return;
    }

    const fetchProducts = async () => {
      isFetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      // Notify parent that loading started
      // onSearchResultsRef.current?.({ count: 0, results: [] }, true);

      onSearchResultsRef.current?.(
        { count: 0, results: [] },
        true,
        debouncedSearchQuery // <-- ADD QUERY
      );

      console.log(
        "[Search] Fetching products for query:",
        debouncedSearchQuery
      );

      try {
      const response = await apiClient.getFilteredProduct({
        search: debouncedSearchQuery,
      });
      console.log("[Search] API response:", response);
      requestAnimationFrame(() => {
        onSearchResultsRef.current?.(response, false, debouncedSearchQuery); // <-- ADD QUERY
      });
    } catch (err: any) {
      console.error("[Search] API error:", err);
      setError(err.message || "Failed to fetch search results");
      onSearchResultsRef.current?.(
        { count: 0, results: [] },
        false,
        debouncedSearchQuery // <-- ADD QUERY
      );
    } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
        console.log("[Search] isLoading set to false");
        // Ensure input maintains focus after async operations
        requestAnimationFrame(() => {
          if (inputRef.current && document.activeElement !== inputRef.current) {
            inputRef.current.focus();
            // Restore cursor position to end
            const length = inputRef.current.value.length;
            inputRef.current.setSelectionRange(length, length);
          }
        });
      }
    };

    fetchProducts();
  }, [debouncedSearchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[Search] Input changed:", e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <div className="max-w-[700px] mx-auto w-full z-50">
      <FloatingLabelInput
        ref={inputRef}
        type="text"
        name="search-field"
        placeholder="Search for items"
        value={searchQuery}
        onChange={handleChange}
        autoFocus={props.autoFocus}
        disabled={false}
        onKeyDown={(e) => {
          console.log("[Search] Key pressed:", e.key);
          if (props.onKeyDown) props.onKeyDown(e);
        }}
        {...props}
      />
      {/* {isLoading && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>} */}
    </div>
  );
});

Search.displayName = "Search";

export default Search;
