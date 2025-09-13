"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  Plus,
  Package,
  Edit,
  Trash2,
} from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import CategoryManager from "./CategoryManager";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "../api";
import { Product, Category, ProductImage } from "../types";
import ProductDeleteModal from "./DeleteProductModal";
import EditProductModal from "./EditProductModal";
import ProductActions from "./ProductActions";
 
const Main = () => {
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

  const handleSave = async (updatedProduct: Product) => {
    if (!isAuthenticated || !accessToken) {
      setError("Authentication failed. Please log in again.");
      logout();
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // --- 1. Update core product fields ---
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

      // --- 2. Handle new image creation ---
      const imagesFormData = new FormData();
      const imagesData: any[] = [];
      let newImageFileIndex = 0;

      // Process new images
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

      // Add new images if there are any
      if (imagesData.length > 0) {
        imagesFormData.append("images", JSON.stringify(imagesData));
        await apiClient.updateProductImages(updatedCore.id, imagesFormData);
      }

      // --- 3. CRITICAL: Fetch the complete updated product data from server ---
      const completeUpdatedProduct = await apiClient.getProduct(updatedCore.id);

      // --- 4. Clean up any preview URLs to prevent memory leaks ---
      updatedProduct.images.forEach((img) => {
        if (img.preview && img.preview.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
      });

      // --- 5. Update state with complete server data ---
      setProducts((prev) => {
        return prev.map((p) =>
          p.id === completeUpdatedProduct.id ? completeUpdatedProduct : p
        );
      });

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

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      setError("Please log in to access this page.");
      setLoading(false);
      return;
    }
  }, [isInitialized, isAuthenticated]);

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
        // Bulk deletion
        await apiClient.deleteProductsBulk(input);
        setProducts((prev) => prev.filter((p) => !input.includes(p.id)));
        setProductTotal((prev) => prev - input.length);
        setSelectedProducts([]);
      } else {
        // Single deletion
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

  const toggleCheckAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((product) => product.id));
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
      setProducts(data.results);
      setProductTotal(data.count);
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
      setCategories(data.results);
      setCategoryTotal(data.count);
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
    if (accessToken) {
      apiClient.setAccessToken(accessToken);
    }
  }, [accessToken]);

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

  const currentPage = selectedTab === "products" ? productPage : categoryPage;
  const setCurrentPage =
    selectedTab === "products" ? setProductPage : setCategoryPage;
  const totalItems = selectedTab === "products" ? productTotal : categoryTotal;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center">
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
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={() => {
              setError(null);
              if (selectedTab === "products") {
                fetchProducts();
              } else if (selectedTab === "categories") {
                fetchCategories();
              }
            }}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }

    if (selectedTab === "products") {
      return (
        <div>
          <div className="md:hidden divide-y divide-[var(--color-border)] px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={toggleCheckAll}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium">Select All</span>
              </div>
              {selectedProducts.length > 0 && (
                <button
                  onClick={() => handleDelete(selectedProducts)}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected ({selectedProducts.length})
                </button>
              )}
            </div>
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts([...selectedProducts, product.id]);
                      } else {
                        setSelectedProducts(
                          selectedProducts.filter((id) => id !== product.id)
                        );
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {getThumbnail(product.images) ? (
                      <img
                        src={getThumbnail(product.images)!}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="text-xs">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-[var(--color-text-secondary)]">
                      {formatPrice(parseFloat(product.price), "NGN")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <ProductActions
                    product={product}
                    variant="mobile"
                    onDelete={handleDelete}
                    onOpenDeleteModal={(product) => {
                      setProductToDelete(product);
                      setIsDeleteModalOpen(true);
                    }}
                    onOpenEditModal={(product) => {
                      setProductToEdit(product);
                      setIsEditModalOpen(true);
                    }}
                  />
                  <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 bg-gray-100 text-gray-800">
                    {product.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr>
                  <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length}
                      onChange={toggleCheckAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider">
                    Item
                  </th>
                  <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider">
                    Options
                  </th>
                  <th className="py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider text-right">
                    {selectedProducts.length > 0 ? (
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(selectedProducts)}
                          disabled={isDeleting}
                          className="flex items-center gap-2 px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Selected ({selectedProducts.length})
                        </button>
                      </div>
                    ) : (
                      "Actions"
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-[var(--color-border-secondary)] transition-colors"
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([
                              ...selectedProducts,
                              product.id,
                            ]);
                          } else {
                            setSelectedProducts(
                              selectedProducts.filter((id) => id !== product.id)
                            );
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {getThumbnail(product.images) ? (
                            <img
                              src={getThumbnail(product.images)!}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-sm">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-medium text-sm">
                        {formatPrice(parseFloat(product.price), "NGN")}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm">
                        {product.options && product.options.length > 0
                          ? product.options.join(", ")
                          : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <ProductActions
                        product={product}
                        variant="desktop"
                        onDelete={handleDelete}
                        onOpenDeleteModal={(product) => {
                          setProductToDelete(product);
                          setIsDeleteModalOpen(true);
                        }}
                        onOpenEditModal={(product) => {
                          setProductToEdit(product);
                          setIsEditModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[var(--color-border)] gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Items per page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setItemsPerPage(newSize);
                  setProductPage(1);
                  setCategoryPage(1);
                }}
                className="border border-[var(--color-border)] rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[var(--color-bg-secondary)] rounded-md text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[var(--color-bg-secondary)] rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      );
    } else if (selectedTab === "categories") {
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider">
                  Image
                </th>
                <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider">
                  Items
                </th>
                <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-border-secondary)] uppercase tracking-wider">
                  Link
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-[var(--color-border-secondary)] transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {category.image ? (
                        <img
                          src={`${category.image}`}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium text-sm">{category.name}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{category.product_count}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/categories/${category.slug}`}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                      <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[var(--color-border)] gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--color-text-secondary)]">
                Items per page:
              </span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setItemsPerPage(newSize);
                  setProductPage(1);
                  setCategoryPage(1);
                }}
                className="border border-[var(--color-border)] rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[var(--color-bg-secondary)] rounded-md text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-[var(--color-bg-secondary)] rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="p-8 text-center">This tab is not yet implemented.</div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div>
        <div className="mb-6 flex items-center justify-between px-4 py-6">
          <h2 className={`font-semibold mb-2 ${isSearchVisible && "hidden"}`}>
            {selectedTab === "products" ? "All products" : "Categories"}
          </h2>
          <div className="flex gap-4 items-center justify-between">
            <div
              className={`relative flex-1 max-w-md ${
                isSearchVisible || "lg:block hidden"
              }`}
            >
              <FloatingLabelInput
                type="text"
                name={`search`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${
                  selectedTab === "products" ? "product" : "category"
                }`}
              />
            </div>
            <button
              className="lg:hidden w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary-hover)] transition-colors"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <Search className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                ref={actionsButtonRef}
                onClick={() =>
                  selectedTab === "categories"
                    ? setIsCategoryModalOpen(true)
                    : setIsQuickActionsOpen(!isQuickActionsOpen)
                }
                className={`flex items-center justify-center bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors ${
                  selectedTab === "categories"
                    ? "w-10 h-10 rounded-full md:px-4 md:py-2.5 md:w-auto md:h-auto md:rounded-lg"
                    : "px-4 py-2.5 rounded-lg"
                }`}
              >
                {selectedTab === "categories" && (
                  <span className="md:hidden flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </span>
                )}
                <span
                  className={`flex items-center gap-2 ${
                    selectedTab === "categories" ? "hidden md:flex" : ""
                  }`}
                >
                  {selectedTab === "products" ? "Actions" : "Manage Categories"}
                  <ChevronDown className="w-4 h-4" />
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
                    <button className="w-full flex items-center gap-3 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors">
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
                    <button
                      onClick={() => handleDelete(selectedProducts)}
                      disabled={selectedProducts.length === 0 || isDeleting}
                      className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Selected ({selectedProducts.length})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar sticky top-0 py-0">
          <div className="flex items-center gap-x-6 border-b px-4 bg-[var(--color-bg)] border-[var(--color-border-secondary)] min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`relative py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  selectedTab === tab.id
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                <span className="inline-block">
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 px-2 py-1 text-[var(--color-heading)] bg-[var(--color-border)] rounded-full text-[.6rem]">
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="bg-[var(--color-bg)]">{renderContent()}</div>
      </div>

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
        onSave={handleSave}
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
