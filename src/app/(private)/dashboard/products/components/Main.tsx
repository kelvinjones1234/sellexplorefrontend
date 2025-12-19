"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ExternalLink,
  Plus,
  Package,
  Edit,
} from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import CategoryManager from "./CategoryManager";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "../api";
import { Product, Category, ProductImage } from "../types";
import ProductDeleteModal from "./DeleteProductModal";
import EditProductModal from "./EditProductModal";
import CategoriesTab from "./CategoriesTab";
import ProductsTab from "./ProductsTab";
import CouponsTab from "./CouponTab";
import CouponModal from "./AddCouponModal";

const Main: React.FC = () => {
  const { isAuthenticated, accessToken, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("products");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const actionsButtonRef = useRef<HTMLButtonElement>(null);
  const [productPage, setProductPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);
  const [productTotal, setProductTotal] = useState(0);
  const [categoryTotal, setCategoryTotal] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveProduct = async (updatedProduct: Product) => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("description", updatedProduct.description);
      formData.append("price", updatedProduct.price);
      if (updatedProduct.discount_price)
        formData.append("discount_price", updatedProduct.discount_price);
      formData.append("quantity", updatedProduct.quantity.toString());
      formData.append("availability", updatedProduct.availability.toString());
      if (updatedProduct.extra_info)
        formData.append("extra_info", updatedProduct.extra_info);
      if (updatedProduct.category)
        formData.append("category", updatedProduct.category.toString());

      const updatedCore = await apiClient.updateProduct(
        updatedProduct.id,
        formData
      );

      const imagesFormData = new FormData();
      const imagesData: any[] = [];
      let newImageFileIndex = 0;

      updatedProduct.images.forEach((img, idx) => {
        if (img.isNew && img.file) {
          imagesData.push({
            is_thumbnail: idx === updatedProduct.thumbnailIndex,
            file_index: newImageFileIndex,
          });
          imagesFormData.append(`image_files_${newImageFileIndex}`, img.file);
          newImageFileIndex++;
        }
      });

      if (imagesData.length > 0) {
        imagesFormData.append("images", JSON.stringify(imagesData));
        await apiClient.updateProductImages(updatedCore.id, imagesFormData);
      }

      if (
        updatedProduct.deletedImageIds &&
        updatedProduct.deletedImageIds.length > 0
      ) {
        for (const imageId of updatedProduct.deletedImageIds) {
          await apiClient.deleteProductImage(imageId);
        }
      }

      const completeUpdatedProduct = await apiClient.getProduct(updatedCore.id);

      updatedProduct.images.forEach((img) => {
        if (img.preview && img.preview.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === completeUpdatedProduct.id ? completeUpdatedProduct : p
        )
      );

      setIsEditModalOpen(false);
      setProductToEdit(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to save product. Please try again.";
      setError(errorMessage);
      console.error("Error saving product:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (input: Product | number[]) => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      if (Array.isArray(input)) {
        await apiClient.deleteProductsBulk(input);
        setProducts((prev) => prev.filter((p) => !input.includes(p.id)));
        setProductTotal((prev) => prev - input.length);
        setSelectedProducts([]);
      } else {
        await apiClient.deleteProduct(input.id);
        setProducts((prev) => prev.filter((p) => p.id !== input.id));
        setProductTotal((prev) => prev - 1);
        setSelectedProducts((prev) => prev.filter((id) => id !== input.id));
      }
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to delete product(s). Please try again.";
      setError(errorMessage);
      console.error("Error deleting product(s):", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchProducts = async () => {
    if (!isAuthenticated) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getProducts(
        productPage,
        searchQuery,
        itemsPerPage
      );
      setProducts(data.results || []);
      setProductTotal(data.count || 0);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(err.message || "Failed to fetch products");
      if (err.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    if (!isAuthenticated) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getCategories(
        categoryPage,
        searchQuery,
        itemsPerPage
      );
      setCategories(data.results || []);
      setCategoryTotal(data.count || 0);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
      setError(err.message || "Failed to fetch categories");
      if (err.status === 401) {
        setError("Session expired. Please log in again.");
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isInitialized || !isAuthenticated) return;

    if (selectedTab === "products") {
      fetchProducts();
    } else if (selectedTab === "categories") {
      fetchCategories();
    }
  }, [
    isInitialized,
    isAuthenticated,
    selectedTab,
    searchQuery,
    productPage,
    categoryPage,
    itemsPerPage,
  ]);


  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedTab", selectedTab);
    }
  }, [selectedTab]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTab = localStorage.getItem("selectedTab");
      if (savedTab) setSelectedTab(savedTab);
    }
  }, []);

  const tabs = [
    { id: "products", label: "Products", count: productTotal },
    { id: "categories", label: "Categories", count: categoryTotal },
    { id: "discounts", label: "Discounts", count: 0 },
    { id: "coupons", label: "Coupons", count: 0 },
  ];

  const formatPrice = (price: number, currency: string) => {
    return `${currency} ${price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getThumbnail = (images: ProductImage[]): string | null => {
    if (!images || images.length === 0) return null;
    const thumbnail = images.find((img) => img.is_thumbnail);
    return thumbnail ? thumbnail.image : images[0]?.image || null;
  };

  const closeQuickActions = (event: MouseEvent) => {
    if (
      quickActionsRef.current &&
      !quickActionsRef.current.contains(event.target as Node) &&
      actionsButtonRef.current &&
      !actionsButtonRef.current.contains(event.target as Node)
    ) {
      setIsQuickActionsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeQuickActions);
    return () => {
      document.removeEventListener("mousedown", closeQuickActions);
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p>Initializing...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || "Please log in to access this page."}
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-[var(--color-brand-primary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-brand-hover)] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  let placeholderText = "product";
  if (selectedTab === "categories") placeholderText = "category";
  if (selectedTab === "coupons") placeholderText = "coupon";
  if (selectedTab === "discounts") placeholderText = "discount";

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div>
        <div className="flex items-center justify-between px-4 pt-6">
          <h2
            className={`font-medium text-[var(--color-text-primary)] mb-2 ${
              isSearchVisible && "hidden"
            }`}
          >
            {selectedTab === "products"
              ? "All products"
              : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
          </h2>
          <div className="flex gap-4 items-center justify-between">
            <div
              className={`relative flex-1 max-w-md ${
                isSearchVisible || "lg:block hidden"
              }`}
            >
              <FloatingLabelInput
                type="text"
                name="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${placeholderText}`}
              />
            </div>
            <button
              className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                ref={actionsButtonRef}
                onClick={() => {
                  if (selectedTab === "categories") {
                    setIsCategoryModalOpen(true);
                  } else if (selectedTab === "coupons") {
                    setIsCouponModalOpen(true);
                  } else {
                    setIsQuickActionsOpen(!isQuickActionsOpen);
                  }
                }}
                className={`flex items-center justify-center bg-[var(--color-brand-primary)] text-[var(--color-on-brand)] text-sm font-medium hover:bg-[var(--color-brand-hover)] transition-colors ${
                  selectedTab === "categories" || selectedTab === "coupons"
                    ? "w-10 h-10 rounded-full md:px-4 md:py-2.5 md:w-auto md:h-auto md:rounded-lg"
                    : "px-4 py-2.5 rounded-lg"
                }`}
              >
                {(selectedTab === "categories" ||
                  selectedTab === "coupons") && (
                  <span className="md:hidden flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </span>
                )}
                <span
                  className={`flex items-center gap-2 ${
                    selectedTab === "categories" || selectedTab === "coupons"
                      ? "hidden md:flex"
                      : ""
                  }`}
                >
                  {selectedTab === "products"
                    ? "Actions"
                    : selectedTab === "categories"
                    ? "Manage Categories"
                    : selectedTab === "coupons"
                    ? "Create Coupon"
                    : "Manage Discounts"}
                  {selectedTab !== "coupons" && (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>
              <div
                ref={quickActionsRef}
                className={`absolute top-full right-0 mt-2 z-20 transition-all duration-200 ${
                  isQuickActionsOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2 pointer-events-none"
                }`}
              >
                <div className="bg-[var(--color-bg)] rounded-xl shadow-lg border border-[var(--color-border)] p-4 min-w-[200px]">
                  <h3 className="font-semibold mb-3 text-sm">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 bg-[var(--color-brand-primary)] text-[var(--color-text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-brand-hover)] transition-colors">
                      <Plus className="w-4 h-4" />
                      Add Product
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--color-border-secondary)] rounded-lg text-sm font-medium transition-colors">
                      <Package className="w-4 h-4" />
                      Import Products
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--color-border-secondary)] rounded-lg text-sm font-medium transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      Export Products
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--color-border-secondary)] rounded-lg text-sm font-medium transition-colors">
                      <Edit className="w-4 h-4" />
                      Bulk Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar sticky top-0 py-0 z-50">
          <div className="flex items-center gap-x-6 border-b px-4 bg-[var(--color-bg-primary)] border-[var(--color-border-default)] min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`relative py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? "border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]"
                    : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <span className="inline-block">
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-4 py-1 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="">
          {selectedTab === "products" && (
            <ProductsTab
              products={products}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              productPage={productPage}
              setProductPage={setProductPage}
              productTotal={productTotal}
              itemsPerPage={itemsPerPage}
              isDeleting={isDeleting}
              handleDelete={handleDelete}
              setProductToDelete={setProductToDelete}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              setProductToEdit={setProductToEdit}
              setIsEditModalOpen={setIsEditModalOpen}
              loading={loading}
              error={error}
              fetchProducts={fetchProducts}
              formatPrice={formatPrice}
              getThumbnail={getThumbnail}
            />
          )}
          {selectedTab === "categories" && (
            <CategoriesTab
              categories={categories}
              categoryPage={categoryPage}
              setCategoryPage={setCategoryPage}
              categoryTotal={categoryTotal}
              itemsPerPage={itemsPerPage}
              loading={loading}
              error={error}
              fetchCategories={fetchCategories}
            />
          )}
          {selectedTab === "discounts" && <div>Discounts Tab</div>}
          {selectedTab === "coupons" && (
            <CouponsTab
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
      <CouponModal
        isOpen={isCouponModalOpen}
        onClose={() => {
          setIsCouponModalOpen(false);
        }}
        onSave={async (data) => {
          // This is a placeholder; actual save logic is handled in CouponsTab
          console.log("Coupon save triggered", data);
        }}
        coupon={null}
      />
      <ProductDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={() => productToDelete && handleDelete(productToDelete)}
        product={productToDelete}
        isDeleting={isDeleting}
      />
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setProductToEdit(null);
        }}
        product={productToEdit}
        onSave={handleSaveProduct}
        categories={categories}
      />
      <CategoryManager
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          if (selectedTab === "categories") {
            fetchCategories();
          }
        }}
      />
    </div>
  );
};

export default Main;
