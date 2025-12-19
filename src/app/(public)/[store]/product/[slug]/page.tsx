// app/[store]/products/[slug]/page.tsx
import { apiClient } from "@/app/(public)/api";
import Main from "../component/Main";

interface ProductDetailPageProps {
  params: {
    store: string;
    slug: string;
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { store, slug } = await(params);

  const product = await apiClient.getProductDetail(slug, store);
  const recommended = await apiClient.getRecommendedProducts(
    product.category.slug,
    store
  );

  console.log("recommendations:", recommended);
  

  return (
    <div className="p-6">
      <Main product={product} recommended={recommended} />
    </div>
  );
}
