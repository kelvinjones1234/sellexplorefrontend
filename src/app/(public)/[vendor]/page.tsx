import { apiClient } from "../api";
import Hero from "./components/Hero";
import ItemsGroup from "./components/ItemsGroup";
import Search from "../components/Search";
import Featured from "./components/Featured";
import Categories from "./components/Categories";

export interface Category {
  id: number;
  name: string;
  image: string | null;
  slug: string;
}

export interface FeaturedProduct {
  id: number;
  name: string;
  price: string;
  discount_price: string | null;
  images: { id: number; image: string; is_thumbnail: boolean }[];
  options: any[];
}

export interface CategoriesAndFeaturedProducts {
  featured_products: FeaturedProduct[];
  categories: Category[];
}

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
    console.log("Featured and cat", categoriesAndFeatured);

    return (
      <div>
        {configData && <Hero initialConfig={configData} />}
        <div className="py-[1rem]">
          <Search />
        </div>
        <ItemsGroup initialData={groupDataValue} />
        {categoriesAndFeatured && (
          <>
            <Featured products={categoriesAndFeatured.featured_products} />
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
