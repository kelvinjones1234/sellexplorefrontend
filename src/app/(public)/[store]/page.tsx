// app/[store]/page.tsx
import { apiClient } from "../api";
import Hero from "./components/Hero";
import ItemsGroup from "./components/ItemsGroup";
import Featured from "./components/Featured";
import Categories from "./components/Categories";
import ItemsGroupSkeleton from "./components/skeleton/ItemsGroupSkeleton";
import FeaturedSkeleton from "./components/skeleton/FeaturedSkeleton";

interface MainPageProps {
  params: Promise<{ store: string }>;
}

export default async function MainPage({ params }: MainPageProps) {
  try {
    const { store } = await params;

    if (!store) {
      throw new Error("Store parameter is required");
    }

    // Fetch data in parallel, excluding configuration
    const [groupDataResult, featuredAndCategoryResult] = await Promise.allSettled([
      apiClient.getGroupData(store),
      apiClient.getCategoriesAndFeaturedProducts(store),
    ]); 

    // Extract data with proper error handling
    const groupDataValue =
      groupDataResult.status === "fulfilled" ? groupDataResult.value : null;
    const categoriesAndFeatured =
      featuredAndCategoryResult.status === "fulfilled"
        ? featuredAndCategoryResult.value
        : null;

    // Log failures (only in development)
    if (process.env.NODE_ENV === "development") {
      if (groupDataResult.status === "rejected") {
        console.error("Failed to load group data:", groupDataResult.reason);
      }
      if (featuredAndCategoryResult.status === "rejected") {
        console.error(
          "Failed to load featured/categories:",
          featuredAndCategoryResult.reason
        );
      }
    }

    return (
      <div className="space-y-8">
        {/* Hero Section - Relies on StoreContext for config */}
        <Hero />

        {/* Items Group Section */}
        {groupDataValue ? (
          <ItemsGroup initialData={groupDataValue} storeName={store} />
        ) : (
          <ItemsGroupSkeleton />
        )}

        {/* Featured and Categories Sections */}
        {categoriesAndFeatured ? (
          <>
            <Featured
              products={categoriesAndFeatured.featured_products}
              categories={categoriesAndFeatured.categories}
            />
            <Categories categories={categoriesAndFeatured.categories} />
          </>
        ) : (
          <FeaturedSkeleton />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in MainPage:", error);

    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Unable to Load Store
          </h2>
          <p className="text-red-600">
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again later."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}