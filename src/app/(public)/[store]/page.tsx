// src/app/[store]/page.tsx
import { apiClient } from "../api";
import Hero from "./components/Hero";
import ItemsGroup from "./components/ItemsGroup";
import Featured from "./components/Featured";
import Categories from "./components/Categories";
import { Suspense } from "react";
import FeaturedSkeleton from "./components/skeleton/FeaturedSkeleton";
import HeroSkeleton from "./components/skeleton/HeroSkeleton";
import ItemsGroupSkeleton from "./components/skeleton/ItemsGroupSkeleton";

interface MainPageProps {
  params: Promise<{ store: string }>;
}

export default async function MainPage({ params }: MainPageProps) {
  try {
    const { store } = await params;

    if (!store) {
      throw new Error("Store parameter is required");
    }

    // Use Promise.allSettled for better error handling
    const [configResult, groupDataResult, featuredAndCategoryResult] =
      await Promise.allSettled([
        apiClient.getConfiguration(store),
        apiClient.getGroupData(store),
        apiClient.getCategoriesAndFeaturedProducts(store),
      ]);

    // Extract data with proper error handling
    const configData =
      configResult.status === "fulfilled" ? configResult.value : null;
    const groupDataValue =
      groupDataResult.status === "fulfilled" ? groupDataResult.value : null;
    const categoriesAndFeatured =
      featuredAndCategoryResult.status === "fulfilled"
        ? featuredAndCategoryResult.value
        : null;

    // Log any failures for debugging
    if (configResult.status === "rejected") {
      console.error("Failed to load config:", configResult.reason);
    }
    if (groupDataResult.status === "rejected") {
      console.error("Failed to load group data:", groupDataResult.reason);
    }
    if (featuredAndCategoryResult.status === "rejected") {
      console.error(
        "Failed to load featured/categories:",
        featuredAndCategoryResult.reason
      );
    }

    return (
      <div className="space-y-8">
        <Suspense fallback={<HeroSkeleton />}>
          {configData ? (
            <Hero initialConfig={configData} />
          ) : (
            <div className="text-center p-8 text-gray-500">
              Unable to load store configuration
            </div>
          )}
        </Suspense>

        <Suspense fallback={<ItemsGroupSkeleton />}>
          <ItemsGroup initialData={groupDataValue} />
        </Suspense>

        {categoriesAndFeatured && (
          <>
            <Suspense fallback={<FeaturedSkeleton />}>
              <Featured
                products={categoriesAndFeatured.featured_products}
                categories={categoriesAndFeatured.categories}
              />
            </Suspense>

            <Suspense
              fallback={
                <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />
              }
            >
              <Categories categories={categoriesAndFeatured.categories} />
            </Suspense>
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in MainPage:", error);
    return (
      <div className="text-center p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Unable to Load Store
          </h2>
          <p className="text-red-600">
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again later."}
          </p>
        </div>
      </div>
    );
  }
}
