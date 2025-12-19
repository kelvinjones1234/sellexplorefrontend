


"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { FilteredProductResponse } from "@/app/(public)/types";
import DetailModal from "../../../components/DetailModal";
import OptionModal from "@/app/(public)/components/OptionModal";
import { useCart } from "@/context/CartContext";
import { useRouter, useParams } from "next/navigation";

// ============================================================================
// TYPES
// ============================================================================
export interface ProductOption {
  id: number;
  name: string;
  image?: string | null;
}

export interface ProductImage {
  image: string;
  thumbnail?: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  oldPrice?: number;
  discount?: string;
  images?: ProductImage[];
  options?: ProductOption[];
  category?: { id: number; name: string; slug: string };
}

// ============================================================================
// PRODUCT CARD
// ============================================================================
const ProductCard = memo(
  ({
    product,
    totalQuantity,
    onOpenModal,
    onOpenOptionModal,
    onHandleCartClick,
    onUpdateQuantity,
    getCartItemForProduct,
  }: {
    product: Product;
    totalQuantity: number;
    onOpenModal: (product: Product) => void;
    onOpenOptionModal: (product: Product) => void;
    onHandleCartClick: (product: Product) => void;
    onUpdateQuantity: (cartItemId: string, quantity: number) => void;
    getCartItemForProduct: (product: Product) => any;
  }) => {
    const calculations = useMemo(() => {
      const originalPrice = product.oldPrice ?? product.price;
      const salePrice = product.price;
      let discountPercent: number | null = null;
      if (product.oldPrice && product.oldPrice > product.price) {
        discountPercent = Math.round(
          ((originalPrice - salePrice) / originalPrice) * 100
        );
      }
      let badge: string | null = product.discount;
      if (!badge && discountPercent !== null) {
        badge = `${discountPercent}% OFF`;
      }
      const thumbnail =
        product.images?.find((img) => img.thumbnail)?.image ||
        product.images?.[0]?.image ||
        product.image ||
        "/placeholder.png";
      const hasOptions = (product.options?.length ?? 0) > 0;
      return { salePrice, badge, thumbnail, hasOptions };
    }, [product]);

    const cartItem = useMemo(
      () => getCartItemForProduct(product),
      [product, getCartItemForProduct]
    );

    const handleDecrease = useCallback(() => {
      if (cartItem) {
        onUpdateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
      } else if (calculations.hasOptions) {
        onOpenOptionModal(product);
      }
    }, [
      cartItem,
      calculations.hasOptions,
      onUpdateQuantity,
      onOpenOptionModal,
      product,
    ]);

    const handleIncrease = useCallback(() => {
      if (cartItem) {
        onUpdateQuantity(cartItem.cartItemId, cartItem.quantity + 1);
      } else if (calculations.hasOptions) {
        onOpenOptionModal(product);
      } else {
        onHandleCartClick(product);
      }
    }, [
      cartItem,
      calculations.hasOptions,
      onUpdateQuantity,
      onOpenOptionModal,
      onHandleCartClick,
      product,
    ]);

    const handleImageClick = useCallback(
      () => onOpenModal(product),
      [product, onOpenModal]
    );
    const handleCartButtonClick = useCallback(
      () => onHandleCartClick(product),
      [product, onHandleCartClick]
    );

    return (
      <div className="rounded-2xl border border-[var(--color-border-default)] overflow-hidden group relative hover:shadow-sm transition">
        <div className="relative">
          {calculations.badge && (
            <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
              {calculations.badge}
            </span>
          )}
          <img
            src={calculations.thumbnail}
            alt={product.name}
            className="w-full h-[12rem] sm:h-[15rem] object-cover cursor-pointer"
            onClick={handleImageClick}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="py-4 px-2">
          <h3
            className="font-medium text-[var(--color-body)] text-sm truncate"
            title={product.name}
          >
            {product.name}
          </h3>
          <div className="flex flex-col mt-2">
            <span className="text-[var(--color-brand-primary)] font-semibold text-sm">
              NGN {calculations.salePrice.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-[var(--color-body)] line-through text-xs">
                NGN {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-[.7rem] text-[var(--color-text-muted)] leading-relaxed">
              Options: <span>{product.options?.length || "None"}</span>
            </div>
            {totalQuantity > 0 ? (
              <div className="flex items-center border border-[var(--color-border-strong)] rounded-full">
                <button
                  onClick={handleDecrease}
                  className="p-1 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-l-full transition"
                >
                  <Minus size={14} />
                </button>
                <span className="px-2 text-sm text-[var(--color-brand-primary)] min-w-[2rem] text-center">
                  {totalQuantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-1 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-r-full transition"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleCartButtonClick}
                className="border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] rounded-full h-8 w-8 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)]"
              >
                <ShoppingCart size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = "ProductCard";

// ============================================================================
// MAIN COMPONENT
// ============================================================================
interface MainProps {
  initialData: FilteredProductResponse<Product> | null;
  initialError: string | null;
  searchWord: string;
  categories?: { id: number; name: string; slug: string }[];
}

const Main: React.FC<MainProps> = ({
  initialData,
  initialError,
  searchWord,
  categories: passedCategories,
}) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const router = useRouter();
  const params = useParams();
  const store = params?.store as string;

  const [productsResponse] =
    useState<FilteredProductResponse<Product> | null>(initialData);
  const [error] = useState<string | null>(initialError);
  const [loading] = useState(false);

  // ✅ CATEGORY SELECTION (uses passed categories if provided)
  const categories = useMemo(() => {
    if (passedCategories && passedCategories.length > 0) {
      return passedCategories.map((c) => ({
        value: c.slug,
        label: c.name,
      }));
    }
    if (!productsResponse?.results) return [];
    const uniqueCats = new Map<string, string>();
    productsResponse.results.forEach((p) => {
      if (p.category) uniqueCats.set(p.category.slug, p.category.name);
    });
    return Array.from(uniqueCats, ([slug, name]) => ({
      value: slug,
      label: name,
    }));
  }, [passedCategories, productsResponse]);

  const [selectedCategory, setSelectedCategory] = useState("__all__");

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "__all__") return productsResponse?.results ?? [];
    return (
      productsResponse?.results.filter(
        (p) => p.category?.slug === selectedCategory
      ) ?? []
    );
  }, [selectedCategory, productsResponse]);

  const categoryOptions = useMemo(
    () => [{ value: "__all__", label: "All categories" }, ...categories],
    [categories]
  );

  const handleCategoryChange = useCallback(
    (val: string | number) => {
      const categorySlug = val as string;

      if (categorySlug === "__all__") {
        // Navigate to all products page or search page
        router.push(`/category/`);
      } else {
        // Navigate to specific category page
        router.push(`/category/${categorySlug}?`);
      }
    },
    [router, store, searchWord]
  );

  const categoryLabel = useMemo(() => {
    if (selectedCategory === "__all__") return "All Products";
    const found = categories.find((c) => c.value === selectedCategory);
    return found ? found.label : "Products";
  }, [selectedCategory, categories]);

  // ============================================================================
  // CART & MODALS
  // ============================================================================
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionModalProduct, setOptionModalProduct] = useState<Product | null>(
    null
  );
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  const openModal = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  }, []);

  const openOptionModal = useCallback((product: Product) => {
    setOptionModalProduct(product);
    setIsOptionModalOpen(true);
  }, []);

  const closeOptionModal = useCallback(() => {
    setOptionModalProduct(null);
    setIsOptionModalOpen(false);
  }, []);

  const handleCartClick = useCallback(
    (product: Product) => {
      const hasOptions = (product.options?.length ?? 0) > 0;
      if (hasOptions) {
        openOptionModal(product);
      } else {
        const price = product.oldPrice ?? product.price;
        const discountPrice = product.oldPrice ? product.price : null;
        const thumbnail =
          product.images?.find((img) => img.thumbnail)?.image ||
          product.images?.[0]?.image ||
          product.image ||
          "/placeholder.png";
        addToCart({
          id: product.id,
          name: product.name,
          price,
          discount_price: discountPrice,
          selectedOption: "default",
          image: thumbnail,
        });
      }
    },
    [addToCart, openOptionModal]
  );

  const getCartItemForProduct = useCallback(
    (product: Product) => {
      const hasOptions = (product.options?.length ?? 0) > 0;
      if (!hasOptions) {
        return cart.find(
          (item) => item.id === product.id && item.selectedOption === "default"
        );
      }
      return cart.find((item) => item.id === product.id);
    },
    [cart]
  );

  const productQuantities = useMemo(() => {
    const quantities = new Map<number, number>();
    if (!filteredProducts) return quantities;
    filteredProducts.forEach((product) => {
      const totalQuantity = cart
        .filter((item) => item.id === product.id)
        .reduce((t, i) => t + i.quantity, 0);
      quantities.set(product.id, totalQuantity);
    });
    return quantities;
  }, [cart, filteredProducts]);

  const optionModalPrice = useMemo(
    () => Number(optionModalProduct?.price ?? 0),
    [optionModalProduct]
  );

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="max-w-[1200px] px-4 mx-auto py-8 mt-[8rem] lg:mt-[10rem]">
      <div className="flex justify-between items-center my-4">
        <div>
          <h2 className="text-[var(--color-text-primary)] text-xl md:text-2xl font-semibold">
            {categoryLabel} — Search results for: "{searchWord}"
          </h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {filteredProducts.length} items found
          </p>
        </div>

        <div className="w-[12rem] md:w-[20rem] my-[1rem]">
          <FloatingLabelSelect
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Filter by category"
            options={categoryOptions}
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">Error: {error}</div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              totalQuantity={productQuantities.get(product.id) || 0}
              onOpenModal={openModal}
              onOpenOptionModal={openOptionModal}
              onHandleCartClick={handleCartClick}
              onUpdateQuantity={updateQuantity}
              getCartItemForProduct={getCartItemForProduct}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingCart size={48} className="mx-auto opacity-50" />
          <p className="text-[var(--color-text-secondary)] text-lg">
            No products found in this category.
          </p>
        </div>
      )}

      {isModalOpen && selectedProduct && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          productSlug={selectedProduct.id.toString()}
        />
      )}
      {isOptionModalOpen && optionModalProduct && (
        <OptionModal
          isOpen={isOptionModalOpen}
          onClose={closeOptionModal}
          options={optionModalProduct.options || []}
          price={optionModalPrice}
          product={optionModalProduct}
        />
      )}
    </div>
  );
};

export default Main;