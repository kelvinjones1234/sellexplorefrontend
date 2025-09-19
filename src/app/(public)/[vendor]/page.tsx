import { apiClient } from "../api";
import Hero from "./components/Hero";
import ItemsGroup from "./components/ItemsGroup";
import Featured from "./components/Featured";
import Categories from "./components/Categories";

interface MainPageProps {
  params: { store: string };
}

export default async function MainPage({ params }: MainPageProps) {
  try {
    const [configResult, groupDataResult, featuredAndCategoryResult] =
      await Promise.allSettled([
        apiClient.getConfiguration(params.store),
        apiClient.getGroupData(params.store),
        apiClient.getCategoriesAndFeaturedProducts(params.store),
      ]);

    const configData =
      configResult.status === "fulfilled" ? configResult.value : null;
    const groupDataValue =
      groupDataResult.status === "fulfilled" ? groupDataResult.value : null;
    const categoriesAndFeatured =
      featuredAndCategoryResult.status === "fulfilled"
        ? featuredAndCategoryResult.value
        : null;

    console.log("For hero", configData);
    console.log("Items group", groupDataValue);
    console.log("Featured and cat", categoriesAndFeatured?.categories);

    return (
      <div>
        {configData && <Hero initialConfig={configData} />}
        <ItemsGroup initialData={groupDataValue} />
        {categoriesAndFeatured && (
          <>
            <Featured
              products={categoriesAndFeatured.featured_products}
              categories={categoriesAndFeatured.categories}
            />
            <Categories categories={categoriesAndFeatured.categories} />
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in MainPage:", error);
    return (
      <div className="text-center p-8">
        <p className="text-red-500">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }
}
