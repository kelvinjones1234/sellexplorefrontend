import React from "react";
import Main from "./components/Main";
import { apiClient } from "@/app/(public)/api";
import { FilteredProductResponse, Product, Category } from "@/app/(public)/types";

interface SearchPageProps {
  searchParams: { query?: string };
  params: { store: string }; // Add this if your route includes a store slug
}

const SearchPage = async ({ searchParams, params }: SearchPageProps) => {
  const { store } = params; // store slug from dynamic route
  const searchWord = decodeURIComponent(searchParams?.query || "");

  let initialData: FilteredProductResponse<Product> | null = null;
  let categories: Category[] = [];
  let initialError: string | null = null;

  if (!searchWord) {
    initialError = "No search term provided.";
  } else {
    try {
      // Fetch categories and filtered products concurrently
      const [categoriesResult, productsResult] = await Promise.all([
        apiClient.getCategoriesAndFeaturedProducts(store),
        apiClient.getProducts({ search: searchWord }, store),
      ]);

      categories = categoriesResult?.categories ?? [];
      initialData = productsResult ?? null;
    } catch (err: any) {
      console.error("Failed to fetch search data:", err);
      initialError = err.message || "Failed to fetch search results.";
    }
  }

  return (
    <div className="mt-[8rem] lg:mt-[10rem]">
      <Main
        initialData={initialData}
        initialError={initialError}
        searchWord={searchWord}
        categories={categories} // ✅ pass categories to Main
      />
    </div>
  );
};

export default SearchPage;
