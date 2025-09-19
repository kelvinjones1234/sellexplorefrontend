import { apiClient } from "../../api";
import AllProducts from "./components/AllProduct";

interface ProductsPageProps {
  searchParams: { category?: string };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { category: categorySlug } = await searchParams; // ✅ await before using

  try {
    const [featuredAndCategoryResult, initialProductsResult] =
      await Promise.allSettled([
        apiClient.getCategoriesAndFeaturedProducts(),
        apiClient.getProductsByCat(
          categorySlug ? { category: categorySlug } : {}
        ),
      ]);

    const categoriesAndFeatured =
      featuredAndCategoryResult.status === "fulfilled"
        ? featuredAndCategoryResult.value
        : null;

    const initialProducts =
      initialProductsResult.status === "fulfilled"
        ? initialProductsResult.value.results
        : [];

    return (
      <div className="mt-[8rem] lg:mt-[10rem]">
        <AllProducts
          categories={categoriesAndFeatured?.categories ?? []}
          initialProducts={initialProducts}
          initialCategory={categorySlug}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in ProductsPage:", error);
    return (
      <div className="text-center p-8">
        <p className="text-red-500">
          Something went wrong while loading products. Please try again later.
        </p>
      </div>
    );
  }
}
