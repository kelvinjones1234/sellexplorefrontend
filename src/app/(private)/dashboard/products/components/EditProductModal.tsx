"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, Check, X, ImagePlus } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelTextarea from "@/app/component/fields/Textarea";
import FancySelect from "../add-product/components/FancySelect";
import OptionModal from "./OptionModal";
import { Product, ProductOption, CategoryResponse } from "../types";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
  categories: CategoryResponse[];
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
  categories,
}) => {
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isQuantityOpen, setIsQuantityOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const addMoreImagesRef = useRef<HTMLInputElement>(null);

  console.log("Products", product);
  //   console.log("currentProduct", currentProduct)

  useEffect(() => {
    if (product && isOpen) {
      setCurrentProduct({
        ...product,
        images: product.images.map((img) => ({
          ...img,
          preview: img.image,
          file: null,
        })),
        thumbnailIndex:
          product.images.findIndex((img) => img.is_thumbnail) || 0,
      });
      setError(null);
    }
  }, [product, isOpen]);

  const updateDetail = <K extends keyof Product>(key: K, value: Product[K]) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        [key]: value,
      });
    }
  };

  const handleSelectFiles = (
    e: React.ChangeEvent<HTMLInputElement>,
    _index: number
  ) => {
    if (e.target.files && currentProduct) {
      const newImages = Array.from(e.target.files).map((file, index) => ({
        id: Date.now() + index,
        image: URL.createObjectURL(file),
        is_thumbnail: false,
        preview: URL.createObjectURL(file),
        file,
      }));

      setCurrentProduct({
        ...currentProduct,
        images: [...currentProduct.images, ...newImages],
      });
    }
  };

  const setThumbnail = (_productIndex: number, imgIndex: number) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        thumbnailIndex: imgIndex,
      });
    }
  };

  const deleteImage = (index: number) => {
    if (currentProduct) {
      const currentThumbnailIndex = currentProduct.thumbnailIndex ?? 0;
      setCurrentProduct({
        ...currentProduct,
        images: currentProduct.images.filter((_, i) => i !== index),
        thumbnailIndex:
          currentThumbnailIndex === index
            ? 0
            : currentThumbnailIndex > index
            ? currentThumbnailIndex - 1
            : currentThumbnailIndex,
      });
    }
  };

  const addOption = (option: ProductOption) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        options: [
          ...currentProduct.options,
          { ...option, id: currentProduct.options.length + 1 },
        ],
      });
    }
  };

  const editOption = (index: number, option: ProductOption) => {
    if (currentProduct) {
      const updatedOptions = [...currentProduct.options];
      updatedOptions[index] = {
        ...option,
        id: currentProduct.options[index].id,
      };
      setCurrentProduct({
        ...currentProduct,
        options: updatedOptions,
      });
    }
  };

  const deleteOption = (index: number) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        options: currentProduct.options.filter((_, i) => i !== index),
      });
    }
  };

  const openOptionModal = (index?: number) => {
    setEditingOptionIndex(index !== undefined ? index : null);
    setIsOptionModalOpen(true);
  };

  const closeOptionModal = () => {
    setIsOptionModalOpen(false);
    setEditingOptionIndex(null);
    setError(null);
  };

  const handleSaveOption = (option: ProductOption) => {
    if (!option.name) {
      setError("Option name is required");
      return;
    }
    if (editingOptionIndex !== null) {
      editOption(editingOptionIndex, option);
    } else {
      addOption(option);
    }
    closeOptionModal();
  };

  const validateProduct = (product: Product): string | null => {
    if (!product.name.trim()) return "Product name is required";
    if (!product.price || isNaN(Number(product.price)))
      return "Valid price is required";
    if (
      product.discount_price &&
      (isNaN(Number(product.discount_price)) ||
        Number(product.discount_price) >= Number(product.price))
    )
      return "Discount price must be less than regular price";
    return null;
  };

  const handleSaveProduct = () => {
    if (currentProduct) {
      const validationError = validateProduct(currentProduct);
      if (validationError) {
        setError(validationError);
        return;
      }
      onSave(currentProduct);
      onClose();
    }
  };

  if (!isOpen || !currentProduct) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg)] rounded-2xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        {/* Header Section - Fixed */}
        <div className="flex-shrink-0 p-6 pb-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Edit Product: {currentProduct.name}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-md mx-auto">
            {/* Images Section */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {currentProduct.images.length ? (
                currentProduct.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative flex-shrink-0"
                    onClick={() => setThumbnail(currentProduct.id, idx)}
                    role="button"
                    aria-label={`Select image ${idx + 1} as thumbnail`}
                  >
                    <img
                      src={img.preview || "/placeholder.png"}
                      alt={`Product image ${idx + 1}`}
                      className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 ${
                        currentProduct.thumbnailIndex === idx
                          ? "border-[var(--color-primary)]"
                          : "border-transparent"
                      }`}
                    />
                    {currentProduct.thumbnailIndex !== idx && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(idx);
                        }}
                        className="absolute top-1 left-1 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-xs"
                        aria-label={`Delete image ${idx + 1}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}

                    {currentProduct.thumbnailIndex === idx && (
                      <div className="absolute top-1 right-1 bg-[var(--color-primary)] text-white w-4 h-4 flex items-center justify-center rounded-full text-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No images available</p>
              )}
              <button
                onClick={() => addMoreImagesRef.current?.click()}
                className="w-16 h-16 flex-shrink-0 border-2 border-dashed hover:border-[var(--color-primary)] border-[var(--color-border)] rounded-lg flex items-center justify-center text-gray-400"
                aria-label="Add more images"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              Click on the canvas with plus sign to add more images
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleSelectFiles(e, currentProduct.id)}
              className="hidden"
              ref={addMoreImagesRef}
              aria-hidden="true"
            />

            {/* Product Details */}
            <div className="mt-4 flex flex-col gap-4">
              <div className="mb-3">
                <FloatingLabelInput
                  type="text"
                  name="product-name"
                  placeholder="Product Name"
                  value={currentProduct.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateDetail("name", e.target.value)
                  }
                />
              </div>

              <div className="relative">
                <FancySelect<number>
                  name="category"
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  value={currentProduct.category ?? null}
                  onChange={(val) => updateDetail("category", val)}
                  placeholder="Select category"
                />
              </div>

              <FloatingLabelTextarea
                placeholder="Product Description"
                value={currentProduct.description}
                onChange={(e) => updateDetail("description", e.target.value)}
              />

              {/* Pricing Section */}
              <div className="py-4">
                <button
                  onClick={() => setIsPricingOpen(!isPricingOpen)}
                  className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
                  aria-expanded={isPricingOpen}
                  aria-controls="pricing-section"
                >
                  Product Pricing
                  <ChevronDown
                    className={`w-5 h-5 ${isPricingOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isPricingOpen && (
                  <div id="pricing-section" className="mt-2">
                    <div className="mb-3">
                      <FloatingLabelInput
                        type="text"
                        name="price"
                        placeholder="Product Price NGN (No commas)"
                        value={currentProduct.price}
                        onChange={(e) => updateDetail("price", e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <FloatingLabelInput
                        type="text"
                        name="discount-price"
                        placeholder="Discount Price NGN (Optional)"
                        value={currentProduct.discount_price || ""}
                        onChange={(e) =>
                          updateDetail("discount_price", e.target.value || null)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity Section */}
              <div>
                <button
                  onClick={() => setIsQuantityOpen(!isQuantityOpen)}
                  className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
                  aria-expanded={isQuantityOpen}
                  aria-controls="quantity-section"
                >
                  Product Quantity
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isQuantityOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isQuantityOpen && (
                  <div id="quantity-section" className="py-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2 border border-[var(--color-border)] rounded-lg px-1 py-1 w-fit">
                        <button
                          onClick={() =>
                            updateDetail(
                              "quantity",
                              Math.max(0, Number(currentProduct.quantity) - 1)
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-border-secondary)] hover:bg-[var(--color-border)] text-lg font-bold"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="min-w-[20px] text-xs text-center font-medium">
                          {currentProduct.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateDetail(
                              "quantity",
                              Number(currentProduct.quantity) + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-border-secondary)] hover:bg-[var(--color-border)] text-lg font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-[var(--color-text)]">
                          Always available
                        </label>
                        <button
                          onClick={() =>
                            updateDetail(
                              "availability",
                              !currentProduct.availability
                            )
                          }
                          className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                            currentProduct.availability
                              ? "bg-[var(--color-primary)]"
                              : "bg-gray-300"
                          }`}
                          aria-label={`Toggle always available: ${
                            currentProduct.availability ? "on" : "off"
                          }`}
                          role="switch"
                          aria-checked={currentProduct.availability}
                        >
                          <span
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              currentProduct.availability
                                ? "translate-x-6"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Options Section */}
              <div>
                <button
                  onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                  className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
                  aria-expanded={isOptionsOpen}
                  aria-controls="options-section"
                >
                  Product Options
                  <ChevronDown
                    className={`w-5 h-5 ${isOptionsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOptionsOpen && (
                  <div id="options-section" className="py-2">
                    {currentProduct.options.length ? (
                      currentProduct.options.map((option, idx) => (
                        <div
                          key={option.id}
                          className="flex items-center gap-2 mb-2 cursor-pointer"
                          onClick={() => openOptionModal(idx)}
                        >
                          <span>{option.name}</span>
                          {option.image && (
                            <img
                              src={
                                option.image instanceof File
                                  ? URL.createObjectURL(option.image)
                                  : option.image || "/placeholder.png"
                              }
                              alt={option.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOption(idx);
                            }}
                            className="text-red-500 text-xs"
                            aria-label={`Delete option ${option.name}`}
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">
                        No options available
                      </p>
                    )}
                    <button
                      onClick={() => openOptionModal()}
                      className="bg-[var(--color-border-secondary)] px-4 text-[var(--color-primary)] py-2 rounded-lg text-sm font-semibold mt-2"
                      aria-label="Add new option"
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>

              {/* Extra Info Section */}
              <div>
                <button
                  onClick={() => setIsExtraOpen(!isExtraOpen)}
                  className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
                  aria-expanded={isExtraOpen}
                  aria-controls="extra-info-section"
                >
                  Extra Product Info
                  <ChevronDown
                    className={`w-5 h-5 ${isExtraOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isExtraOpen && (
                  <div id="extra-info-section" className="py-4">
                    <FloatingLabelTextarea
                      placeholder="Optional Product Settings"
                      value={currentProduct.extra_info || ""}
                      onChange={(e) =>
                        updateDetail("extra_info", e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Section - Fixed */}
        <div className="flex-shrink-0 p-6 pt-0">
          {/* Option Modal */}
          <OptionModal
            isOpen={isOptionModalOpen}
            onClose={closeOptionModal}
            onSave={handleSaveOption}
            initialOption={
              editingOptionIndex !== null
                ? currentProduct.options[editingOptionIndex]
                : undefined
            }
          />

          {/* Save Button */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--color-border)] hover:bg-[var(--color-border-secondary)] rounded-lg text-sm font-medium transition"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProduct}
              className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg text-sm font-semibold transition"
              aria-label="Save product changes"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
