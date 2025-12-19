"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Plus, ImagePlus } from "lucide-react";
import Link from "next/link";
import DetailsView from "./DetailView";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "../api";
import { ImageData, Product, CategoryResponse, ProductOption } from "../types";

const Main = () => {
  const [step, setStep] = useState<"selection" | "details">("selection");
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const addMoreImagesRef = useRef<HTMLInputElement | null>(null);
  const { accessToken } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try { 
        if (!apiClient.isAuthenticated()) return;
        const result = await apiClient.getCategories();
        setCategories(result);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []); // Empty dependency array to run only on mount

  const handleSelectFiles = (
    e: React.ChangeEvent<HTMLInputElement>,
    productIndex?: number
  ) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const newImagesData: ImageData[] = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
    }));

    if (productIndex !== undefined) {
      setProducts((prev) => {
        const updatedProducts = [...prev];
        const product = updatedProducts[productIndex];
        const existing = new Set(
          product.images.map((img) => `${img.file?.name}-${img.file?.size}`)
        );
        const filteredNewImages = newImagesData.filter(
          (img) => !existing.has(`${img.file?.name}-${img.file?.size}`)
        );
        const startingIndex = product.images.length;
        product.images = [...product.images, ...filteredNewImages];

        filteredNewImages.forEach((_, idx) => {
          simulateUpload(productIndex, startingIndex + idx);
        });

        return updatedProducts;
      });
    } else {
      const newProducts: Product[] = newFiles.map((file) => ({
        images: [{ file, preview: URL.createObjectURL(file), progress: 0 }],
        thumbnailIndex: 0,
        details: {
          name: "",
          category: "",
          description: "",
          price: "",
          quantity: "",
          discountPrice: "",
          availability: true,
          hot_deal: false,
          recent: false,
          featured: false,
          extraInfo: "",
          options: [], // Initialize with empty options array
        },
      }));

      const currentProductCount = products.length;
      setProducts((prev) => [...prev, ...newProducts]);

      newProducts.forEach((_, idx) => {
        simulateUpload(currentProductCount + idx, 0);
      });
    }

    e.target.value = "";
  };

  const simulateUpload = (productIndex: number, imageIndex: number) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setProducts((prev) => {
        const updated = [...prev];
        if (updated[productIndex] && updated[productIndex].images[imageIndex]) {
          updated[productIndex].images[imageIndex].progress = Math.min(
            progress,
            100
          );
        }
        return updated;
      });

      if (progress >= 100) {
        clearInterval(interval);
        setProducts((prev) => {
          const updated = [...prev];
          if (
            updated[productIndex] &&
            updated[productIndex].images[imageIndex]
          ) {
            const img = updated[productIndex].images[imageIndex];
            img.uploadedUrl = img.preview;
          }
          return updated;
        });
      }
    }, 200);
  };

  const removeProduct = (indexToRemove: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== indexToRemove));
    if (step === "details") {
      if (products.length <= 1) {
        setStep("selection");
        setCurrentIndex(0);
      } else if (currentIndex >= indexToRemove) {
        setCurrentIndex((prevIdx) => Math.max(0, prevIdx - 1));
      }
    }
  };

  const setThumbnail = (productIndex: number, imageIndex: number) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[productIndex].thumbnailIndex = imageIndex;
      return updated;
    });
  };

  const addOption = (option: ProductOption) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[currentIndex].details.options = [
        { ...option, id: Math.random() * 1000000 }, // Temporary ID for frontend
      ];
      console.log(`Added option for product ${currentIndex + 1}:`, option);
      return updated;
    });
  };

  const updateOption = (index: number, option: ProductOption) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[currentIndex].details.options = [
        {
          ...option,
          id:
            updated[currentIndex].details.options[index]?.id ||
            Math.random() * 1000000,
        },
      ];
      console.log(`Updated option for product ${currentIndex + 1}:`, option);
      return updated;
    });
  };

  const removeOption = (index: number) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[currentIndex].details.options = [];
      console.log(`Removed option for product ${currentIndex + 1}`);
      return updated;
    });
  };

  const proceedToDetails = () => {
    if (products.every((p) => p.images.every((img) => img.progress === 100))) {
      setStep("details");
    } else {
      alert("Please wait for all uploads to complete.");
    }
  };

  const updateDetail = <K extends keyof Product["details"]>(
    field: K,
    value: Product["details"][K]
  ) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[currentIndex].details[field] = value;
      return updated;
    });
  };

  const validateProduct = (product: Product): string | null => {
    const { details } = product;
    if (!details.name) return "Product name is required";
    if (!details.category) return "Category is required";
    if (!details.price || isNaN(Number(details.price)))
      return "Valid price is required";
    if (!details.quantity || isNaN(Number(details.quantity)))
      return "Valid quantity is required";
    return null;
  };

  const postAllProducts = async () => {
    if (!accessToken) {
      alert("Authentication required. Please log in.");
      return;
    }

    const validationErrors = products
      .map((product, idx) => {
        const error = validateProduct(product);
        return error ? `Product ${idx + 1}: ${error}` : null;
      })
      .filter(Boolean);
    if (validationErrors.length > 0) {
      alert(`Please fix the following errors:\n${validationErrors.join("\n")}`);
      return;
    }

    try {
      const postPromises = products.map((product, idx) => {
        console.log(`Submitting Product ${idx + 1}:`, product);
        return apiClient.postProduct(product);
      });
      const results = await Promise.all(postPromises);
      console.log("All products posted:", results);
      alert("All products have been successfully created!");
      setProducts([]);
      setStep("selection");
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error posting products:", error);
      alert("Failed to create one or more products. Please try again.");
    }
  };

  const nextProduct = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      postAllProducts();
    }
  };

  const prevProduct = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    } else {
      goBackToSelection();
    }
  };

  const goBackToSelection = () => {
    setStep("selection");
  };

  const Header = () => (
    <header className="sticky top-0 z-20 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-default)] px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
          <Link href="/dashboard/products">
            <span className="font-medium text-[var(--color-text-primary)]">
              Products
            </span>
          </Link>
          <span>›</span>
          <span>Add product</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-primary)]">⚡</span>
          <span className="text-sm font-medium text-[var(--color-text)]">
            Quick Actions
          </span>
          <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] font-sans">
      <Header />
      {step === "selection" ? (
        <SelectionView
          products={products}
          fileInputRef={fileInputRef}
          handleSelectFiles={handleSelectFiles}
          removeProduct={removeProduct}
          proceedToDetails={proceedToDetails}
        />
      ) : (
        <DetailsView
          products={products}
          currentIndex={currentIndex}
          setThumbnail={setThumbnail}
          removeProduct={removeProduct}
          updateDetail={updateDetail}
          addOption={addOption}
          updateOption={updateOption}
          removeOption={removeOption}
          nextProduct={nextProduct}
          prevProduct={prevProduct}
          goBackToSelection={goBackToSelection}
          addMoreImagesRef={addMoreImagesRef}
          handleSelectFiles={handleSelectFiles}
          categories={categories}
        />
      )}
    </div>
  );
};

const SelectionView = ({
  products,
  fileInputRef,
  handleSelectFiles,
  removeProduct,
  proceedToDetails,
}: any) => (
  <div className="max-w-md mx-auto py-4 px-4">
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center bg-green-100 rounded-full w-16 h-16 mb-4">
        <ImagePlus className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800">Add media,</h1>
      <h1 className="text-2xl font-bold text-gray-800">
        for multiple products
      </h1>
    </div>

    <div className="bg-red-50 text-red-800 rounded-lg p-3 mb-6 text-xs border border-red-100">
      <p>
        <strong>IMPORTANT</strong>
      </p>
      <p>
        Select one media file for each product you want to add. <br /> Media
        file should not include videos. IMAGES ONLY!
      </p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      {products.map((product: any, idx: number) => (
        <div
          key={idx}
          className="flex items-center justify-between p-2 bg-[var(--color-border-secondary)] rounded-xl border-2 border-[var(--color-border-strong)]"
        >
          <div className="relative w-16 h-14 flex-shrink-0">
            <img
              src={product.images[0].preview}
              alt={`Product ${idx + 1}`}
              className="w-full h-full rounded-lg object-cover"
            />
            {product.images[0].progress < 100 && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b-lg overflow-hidden">
                <div
                  className="h-1 bg-[var(--color-success)] transition-all duration-200"
                  style={{ width: `${product.images[0].progress}%` }}
                />
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => removeProduct(idx)}
              className="text-gray-400 hover:text-red-500 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-[var(--color-text-secondary)] text-xs font-medium">
              Product {idx + 1}
            </span>
          </div>
        </div>
      ))}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center justify-center gap-2 text-[var(--color-text-muted)] py-4 border-2 border-dashed border-[var(--color-border)] rounded-lg transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span className="text-[.7rem] font-medium">
          {products.length > 0 ? "Add More Products" : "Add Products"}
        </span>
      </button>
    </div>

    <input
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => handleSelectFiles(e)}
      className="hidden"
      ref={fileInputRef}
    />

    {products.length > 0 && (
      <div className="mt-8">
        <button
          onClick={proceedToDetails}
          className="w-full bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-text-primary)] py-4 rounded-xl font-semibold text-sm shadow-sm hover:bg-opacity-90 transition-all"
        >
          Proceed to add details
        </button>
      </div>
    )}
  </div>
);

export default Main;