"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { FeaturedProduct, Category } from "../../types";
import DetailModal from "./DetailModal";
import OptionModal from "../../components/OptionModal";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";

// Memoized product card component to prevent unnecessary re-renders
const ProductCard = memo(
  ({
    product,
    totalQuantity,
    onOpenModal,
    onOpenOptionModal,
    onHandleCartClick,
    onUpdateQuantity,
    getCartItemForProduct,
    cart, // Added cart prop
  }: {
    product: FeaturedProduct;
    totalQuantity: number;
    onOpenModal: (product: FeaturedProduct) => void;
    onOpenOptionModal: (product: FeaturedProduct) => void;
    onHandleCartClick: (product: FeaturedProduct) => void;
    onUpdateQuantity: (cartItemId: string, quantity: number) => void;
    getCartItemForProduct: (product: FeaturedProduct) => any;
    cart: any[]; // Add cart prop type (use CartItem[] from CartContext if typed)
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

      const hasOptions = product.options[0]?.options?.length > 0;
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

    // Modified to check total quantity for the product across all options
    const cartItems = useMemo(
      () => cart.filter((item) => item.id === product.id),
      [cart, product.id]
    );
    const totalProductQuantity = useMemo(
      () => cartItems.reduce((total, item) => total + item.quantity, 0),
      [cartItems]
    );

    const handleDecrease = useCallback(() => {
      if (cartItems.length > 0) {
        // If multiple options exist, open option modal to choose which to decrease
        if (cartItems.length > 1 || calculations.hasOptions) {
          onOpenOptionModal(product);
        } else {
          onUpdateQuantity(cartItems[0].cartItemId, cartItems[0].quantity - 1);
        }
      }
    }, [
      cartItems,
      calculations.hasOptions,
      onUpdateQuantity,
      onOpenOptionModal,
      product,
    ]);

    const handleIncrease = useCallback(() => {
      if (calculations.hasOptions) {
        onOpenOptionModal(product);
      } else {
        onHandleCartClick(product);
      }
    }, [
      calculations.hasOptions,
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
      <div className="bg-[var(--color-bg)] rounded-2xl border border-[var(--color-border-default)] overflow-hidden group relative hover:shadow-sm transition">
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
            className="font-medium text-[var(--color-text-primary)] text-sm truncate"
            title={product.name}
          >
            {product.name}
          </h3>
          <div className="flex flex-col mt-2">
            <span className="text-[var(--color-brand-primary)] font-semibold text-sm">
              NGN {calculations.finalPrice.toLocaleString()}
            </span>
            {calculations.discountPrice !== null && (
              <span className="text-[var(--color-text-primary)] line-through text-xs">
                NGN {calculations.price.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-3">
            <div className="text-[.7rem] text-[var(--color-text-secondary)] leading-relaxed">
              Options:{" "}
              <span>{product.options[0]?.options?.length || "None"}</span>
            </div>

            {totalProductQuantity > 0 ? (
              <div className="flex items-center border border-[var(--color-border-strong)] rounded-full">
                <button
                  onClick={handleDecrease}
                  className="p-1 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-l-full transition"
                  aria-label={`Decrease quantity for ${product.name}`}
                >
                  <Minus size={14} />
                </button>
                <span className="px-2 text-sm text-[var(--color-brand-primary)] min-w-[2rem] text-center">
                  {totalProductQuantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="p-1 text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)] rounded-r-full transition"
                  aria-label={`Increase quantity for ${product.name}`}
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleCartButtonClick}
                className="border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] rounded-full h-8 w-8 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-[var(--color-on-brand)]"
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

// Main Featured component
export default function Featured({
  products,
  categories,
}: {
  products: FeaturedProduct[];
  categories: Category[];
}) {
  const router = useRouter();
  const { cart, addToCart, updateQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Modal states
  const [selectedProduct, setSelectedProduct] =
    useState<FeaturedProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionModalProduct, setOptionModalProduct] =
    useState<FeaturedProduct | null>(null);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

  // Early return for empty products
  if (!products?.length) {
    return (
      <div className="max-w-[1200px] px-4 mx-auto">
        <div className="text-center py-12">
          <div className="text-[var(--color-text-secondary)] mb-4">
            <ShoppingCart size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-[var(--color-text-secondary)] text-lg">
            No featured products available at the moment.
          </p>
        </div>
      </div>
    );
  }

  // Memoize category options to prevent recreation on every render
  const categoryOptions = useMemo(
    () => [
      { value: "all", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat.slug,
        label: cat.name,
      })),
    ],
    [categories]
  );

  // Memoize cart quantities to avoid recalculating on every render
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

  // Memoized callback functions to prevent child re-renders
  const handleCategoryChange = useCallback(
    (val: string) => {
      setSelectedCategory(val);
      if (val === "all") {
        router.push("/products");
      } else {
        router.push(`/products?category=${val}`);
      }
    },
    [router]
  );

  const openModal = useCallback((product: FeaturedProduct) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  }, []);

  const openOptionModal = useCallback((product: FeaturedProduct) => {
    setOptionModalProduct(product);
    setIsOptionModalOpen(true);
  }, []);

  const closeOptionModal = useCallback(() => {
    setOptionModalProduct(null);
    setIsOptionModalOpen(false);
  }, []);

  const handleCartClick = useCallback(
    (product: FeaturedProduct) => {
      const hasOptions = product.options[0]?.options?.length > 0;

      if (hasOptions) {
        openOptionModal(product);
      } else {
        // Validate price before adding to cart
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

  // Memoized function to get cart item for a product
  const getCartItemForProduct = useCallback(
    (product: FeaturedProduct) => {
      const hasOptions = product.options[0]?.options?.length > 0;
      if (!hasOptions) {
        return cart.find(
          (item) => item.id === product.id && item.selectedOption === "default"
        );
      }
      return cart.find((item) => item.id === product.id);
    },
    [cart]
  );

  // Memoize option modal price calculation
  const optionModalPrice = useMemo(() => {
    if (!optionModalProduct) return 0;
    return Number(
      optionModalProduct.discount_price ?? optionModalProduct.price ?? 0
    );
  }, [optionModalProduct]);

  return (
    <div className="max-w-[1200px] px-4 mx-auto">
      {/* Header with category filter */}
      <div className="flex justify-between items-center my-4">
        <h2 className="text-[var(--color-brand-primary)] text-sm md:text-lg font-semibold">
          Featured items
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

      {/* Product grid */}
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
            cart={cart} // Pass cart to ProductCard
          />
        ))}
      </div>

      {/* Detail Modal - Only render when needed */}
      {isModalOpen && selectedProduct && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={closeModal}
          product={selectedProduct}
        />
      )}

      {/* Option Modal - Only render when needed */}
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
}
