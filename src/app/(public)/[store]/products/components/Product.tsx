"use client";

import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { apiClient } from "@/app/(public)/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Category, Product } from "@/app/(public)/types";
import DetailModal from "../../components/DetailModal";
import OptionModal from "@/app/(public)/components/OptionModal";
import { useCart } from "@/context/CartContext";

// Memoized ProductCard component to prevent unnecessary re-renders
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
    // Memoize expensive calculations
    const calculations = useMemo(() => {
      const price = product.price ? Number(product.price) : 0;
      const discountPrice = product.discount_price
        ? Number(product.discount_price)
        : null;

      let discountPercent: number | null = null;
      if (price > 0 && discountPrice !== null && discountPrice < price) {
        discountPercent = Math.round(((price - discountPrice) / price) * 100);
      }

      const thumbnail =
        product.images.find((img) => img.is_thumbnail)?.image ||
        product.images[0]?.image ||
        "/placeholder.png";

      const hasOptions = (product.options?.length ?? 0) > 0;
      const finalPrice = discountPrice ?? price;

      return {
        price,
        discountPrice,
        discountPercent,
        thumbnail,
        hasOptions,
        finalPrice,
      };
    }, [
      product.price,
      product.discount_price,
      product.images,
      product.options,
    ]);

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

    const handleImageClick = useCallback(() => {
      onOpenModal(product);
    }, [product, onOpenModal]);

    const handleCartButtonClick = useCallback(() => {
      onHandleCartClick(product);
    }, [product, onHandleCartClick]);

    return (
      <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border-secondary)] overflow-hidden group relative hover:shadow-sm transition">
        <div className="relative">
          {calculations.discountPercent !== null && (
            <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
              {calculations.discountPercent}% OFF
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
            <span className="text-[var(--color-primary)] font-semibold text-sm">
              NGN {calculations.finalPrice.toLocaleString()}
            </span>
            {calculations.discountPrice !== null && (
              <span className="text-[var(--color-body)] line-through text-xs">
                NGN {calculations.price.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-[.7rem] text-[var(--color-text-muted)] leading-relaxed">
              Options: <span>{product.options?.length || "None"}</span>
            </div>

            {totalQuantity > 0 ? (
              <div className="flex items-center border border-[var(--color-primary)] rounded-full">
                <button
                  onClick={handleDecrease}
                  className="p-1 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-l-full transition"
                  aria-label={`Decrease quantity for ${product.name}`}
                >
                  <Minus size={14} />
                </button>
                <span className="px-2 text-sm text-[var(--color-primary)] min-w-[2rem] text-center">
                  {totalQuantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-1 text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white rounded-r-full transition"
                  aria-label={`Increase quantity for ${product.name}`}
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleCartButtonClick}
                className="border border-[var(--color-primary)] text-[var(--color-primary)] rounded-full h-8 w-8 flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition"
                aria-label={`Add ${product.name} to cart`}
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


interface ProductsProps {
  categories: Category[];
  initialProducts: Product[];
  initialCategory?: string;
}

const Products: React.FC<ProductsProps> = ({
  categories,
  initialProducts,
  initialCategory,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, addToCart, updateQuantity } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory ?? "__all__"
  );
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState<boolean>(false);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionModalProduct, setOptionModalProduct] = useState<Product | null>(
    null
  );
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  // Dropdown options
  const categoryOptions = useMemo(
    () => [
      { value: "__all__", label: "All categories" },
      ...categories.map((cat) => ({
        value: cat.slug,
        label: cat.name,
      })),
    ],
    [categories]
  );

  // Capitalize words helper
  const capitalizeWords = (str: string) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  // Compute label for header
  const categoryLabel = useMemo(() => {
    if (selectedCategory === "__all__") {
      return "All Products";
    }
    const found = categories.find((c) => c.slug === selectedCategory);
    return found ? `${capitalizeWords(found.name)}` : "Products";
  }, [selectedCategory, categories]);

  // Memoize cart quantities
  const productQuantities = useMemo(() => {
    const quantities = new Map<number, number>();

    products.forEach((product) => {
      const totalQuantity = cart
        .filter((item) => item.id === product.id)
        .reduce((total, item) => total + item.quantity, 0);
      quantities.set(product.id, totalQuantity);
    });

    return quantities;
  }, [cart, products]);

  // Update selectedCategory when URL query changes
  useEffect(() => {
    const urlCategory = searchParams.get("category") ?? "__all__";
    setSelectedCategory(urlCategory);
  }, [searchParams]);

  // Refetch products when selectedCategory changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const filters =
          selectedCategory !== "__all__" ? { category: selectedCategory } : {};
        const response = await apiClient.getProductsByCat(filters);
        setProducts(response.results);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Memoized callback functions
  const handleCategoryChange = useCallback(
    (val: string | number) => {
      const newCategory = val as string;
      const params = new URLSearchParams(searchParams.toString());
      if (newCategory === "__all__") {
        params.delete("category");
      } else {
        params.set("category", newCategory);
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

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
        const price = Number(product.price);
        const discountPrice = product.discount_price
          ? Number(product.discount_price)
          : null;

        if (isNaN(price) || price <= 0) {
          console.error(
            `Invalid price for product ${product.name}:`,
            product.price
          );
          return;
        }

        addToCart({
          id: product.id,
          name: product.name,
          price,
          discount_price: discountPrice,
          selectedOption: "default",
          image:
            product.images.find((img) => img.is_thumbnail)?.image ||
            product.images[0]?.image ||
            "/placeholder.png",
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

  const optionModalPrice = useMemo(() => {
    if (!optionModalProduct) return 0;
    return Number(
      optionModalProduct.discount_price ?? optionModalProduct.price ?? 0
    );
  }, [optionModalProduct]);

  return (
    <div className="max-w-[1200px] px-4 mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center my-4">
        <h2 className="text-[var(--color-primary)] text-sm md:text-lg font-semibold">
          {categoryLabel}
        </h2>
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

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border-secondary)] overflow-hidden animate-pulse"
            >
              {/* Image skeleton */}
              <div className="w-full h-[12rem] sm:h-[15rem] bg-[var(--color-border)]" />

              <div className="py-4 px-2 space-y-3">
                {/* Title skeleton */}
                <div className="h-4 bg-[var(--color-border)] rounded w-3/4" />
                {/* Price skeleton */}
                <div className="h-4 bg-[var(--color-border)] rounded w-1/2" />
                {/* Cart button skeleton */}
                <div className="flex justify-end mt-3">
                  <div className="h-8 w-8 rounded-full bg-[var(--color-border)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
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
          <div className="text-gray-400 mb-4">
            <ShoppingCart size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-[var(--color-text-muted)] text-lg">
            No products available at the moment.
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {isModalOpen && selectedProduct && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={selectedProduct}
        />
      )}

      {/* Option Modal */}
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

export default Products;
