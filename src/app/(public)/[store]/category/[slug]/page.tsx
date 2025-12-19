import { apiClient } from "@/app/(public)/api";
import Main from "../components/Main";



interface CategoryProductsPageProps {
  params: {
    store: string;
    slug: string; // ← Changed from 'category'
  };
}

export default async function CategoryProductsPage({
  params,
}: CategoryProductsPageProps) {
  const { store, slug: categorySlug } = await(params); // Rename to categorySlug for clarity

  console.log("Store:", store);
  console.log("Category Slug:", categorySlug);

  try {
    const [categoriesResult, productsResult] = await Promise.all([
      apiClient.getCategoriesAndFeaturedProducts(store),
      apiClient.getProductsByCat({ category: categorySlug }, store),
    ]);


    console.log("categoriesResult:", categoriesResult);

    

    return (
      <div className="mt-[8rem] lg:mt-[10rem]">
        <Main
          categories={categoriesResult?.categories ?? []}
          initialProducts={productsResult?.results ?? []}
          initialCategory={categorySlug}
        />
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    return (
      <div className="text-center p-8">
        <p className="text-red-500">Failed to load products</p>
      </div>
    );
  }
}
