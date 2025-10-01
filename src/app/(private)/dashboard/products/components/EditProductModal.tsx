"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, Check, X } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelTextarea from "@/app/component/fields/Textarea";
import FancySelect from "../add-product/components/FancySelect";
import OptionModal from "./EditOptionModal";
import { Product, ProductOption, ProductImage, Category } from "../types";
import { apiClient } from "../api";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (updatedProduct: Product) => void;
  categories: Category[];
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

  useEffect(() => {
    if (product && isOpen) {
      const thumbnailIndex = product.images.findIndex(
        (img) => img.is_thumbnail
      );
      setCurrentProduct({
        ...product,
        images: product.images.map((img) => ({
          ...img,
          preview: img.image,
          file: null,
          isNew: false,
          toDelete: false,
        })),
        thumbnailIndex: thumbnailIndex !== -1 ? thumbnailIndex : 0,
        deletedImageIds: [],
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
      const newImages: ProductImage[] = Array.from(e.target.files).map(
        (file) => ({
          id: undefined,
          image: URL.createObjectURL(file),
          is_thumbnail: false,
          preview: URL.createObjectURL(file),
          file,
          isNew: true,
          toDelete: false,
        })
      );

      setCurrentProduct({
        ...currentProduct,
        images: [
          ...currentProduct.images.filter((img) => !img.toDelete),
          ...newImages,
        ],
        thumbnailIndex: currentProduct.thumbnailIndex ?? 0,
      });
    }
  };

  const setThumbnail = async (_productIndex: number, imgIndex: number) => {
    if (currentProduct) {
      const visibleImages = currentProduct.images.filter(
        (img) => !img.toDelete
      );
      const selectedImage = visibleImages[imgIndex];

      if (!selectedImage) return;

      const updatedImages = currentProduct.images.map((img) => ({
        ...img,
        is_thumbnail: img === selectedImage,
      }));

      if (selectedImage.isNew) {
        setCurrentProduct({
          ...currentProduct,
          images: updatedImages,
          thumbnailIndex: imgIndex,
        });
      } else {
        try {
          await apiClient.setProductThumbnail(
            currentProduct.id,
            selectedImage.id!
          );
          setCurrentProduct({
            ...currentProduct,
            images: updatedImages,
            thumbnailIndex: imgIndex,
          });
        } catch (err) {
          setError("Failed to update thumbnail. Please try again.");
          console.error("Error updating thumbnail:", err);
        }
      }
    }
  };

  const deleteImage = async (index: number) => {
    if (currentProduct) {
      const visibleImages = currentProduct.images.filter(
        (img) => !img.toDelete
      );
      const imageToDelete = visibleImages[index];
      const actualIndex = currentProduct.images.indexOf(imageToDelete);

      if (!imageToDelete) return;

      if (imageToDelete.isNew) {
        const updatedImages = currentProduct.images.filter(
          (_, i) => i !== actualIndex
        );
        if (imageToDelete.preview) {
          URL.revokeObjectURL(imageToDelete.preview);
        }

        setCurrentProduct({
          ...currentProduct,
          images: updatedImages,
          thumbnailIndex: Math.min(
            currentProduct.thumbnailIndex ?? 0,
            updatedImages.filter((img) => !img.toDelete).length - 1
          ),
        });
      } else {
        try {
          await apiClient.deleteProductImage(imageToDelete.id!);
          const updatedImages = currentProduct.images.filter(
            (_, i) => i !== actualIndex
          );

          setCurrentProduct({
            ...currentProduct,
            images: updatedImages,
            thumbnailIndex: Math.min(
              currentProduct.thumbnailIndex ?? 0,
              updatedImages.filter((img) => !img.toDelete).length - 1
            ),
            deletedImageIds: imageToDelete.id
              ? [...(currentProduct.deletedImageIds || []), imageToDelete.id]
              : currentProduct.deletedImageIds,
          });
        } catch (err) {
          setError("Failed to delete image. Please try again.");
          console.error("Error deleting image:", err);
        }
      }
    }
  };

  const addOption = (option: ProductOption) => {
    if (currentProduct) {
      setCurrentProduct({
        ...currentProduct,
        options: [option], // Replace previous options with the new one
      });
    }
  };

  const editOption = (index: number, option: ProductOption) => {
    if (currentProduct) {
      const updatedOptions = [option]; // Replace the option at the given index
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
        options: [],
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
    }
  };

  if (!isOpen || !currentProduct) return null;

  const visibleImages = currentProduct.images.filter((img) => !img.toDelete);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">



        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center mb-">
            <h2 className="text-md text-[var(--color-text-primary)]">
              <span>
                <strong> Product:</strong>
              </span>{" "}
              {currentProduct.name}
            </h2> 
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {visibleImages.length ? (
                visibleImages.map((img, idx) => (
                  <div
                    key={img.id || `new-${idx}`}
                    className="relative flex-shrink-0"
                    onClick={() => setThumbnail(currentProduct.id, idx)}
                    role="button"
                    aria-label={`Select image ${idx + 1} as thumbnail`}
                  >
                    <img
                      src={img.preview || "/placeholder.png"}
                      alt={`Product image ${idx + 1}`}
                      className={`w-16 h-16 rounded-lg object-cover cursor-pointer border-2 ${
                        (currentProduct.thumbnailIndex ?? 0) === idx
                          ? "border-[var(--color-brand-primary)]"
                          : "border-transparent"
                      }`}
                    />
                    {(currentProduct.thumbnailIndex ?? 0) !== idx && (
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

                    {(currentProduct.thumbnailIndex ?? 0) === idx && (
                      <div className="absolute top-1 right-1 bg-[var(--color-brand-primary)] text-white w-4 h-4 flex items-center justify-center rounded-full text-xs">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-[var(--color-text-secondary)]">
                  No images available
                </p>
              )}
              <button
                onClick={() => addMoreImagesRef.current?.click()}
                className="w-16 h-16 flex-shrink-0 border-2 border-dashed hover:border-[var(--color-primary)] border-[var(--color-border)] rounded-lg flex items-center justify-center text-gray-400"
                aria-label="Add more images"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <p className="text-center text-xs text-[var(--color-text-muted)] mt-2">
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

              <div className="pt-4">
                <button
                  onClick={() => setIsPricingOpen(!isPricingOpen)}
                  className="w-full text-left text-sm py-3 text-[var(--color-text-primary)] flex justify-between items-center"
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

              <div>
                <button
                  onClick={() => setIsQuantityOpen(!isQuantityOpen)}
                  className="w-full text-left text-sm py-3 text-[var(--color-text-primary)] flex justify-between items-center"
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
                      <div className="flex items-center gap-2 border border-[var(--color-border-strong)] rounded-xl px-1 py-1 w-fit">
                        <button
                          onClick={() =>
                            updateDetail(
                              "quantity",
                              Math.max(0, Number(currentProduct.quantity) - 1)
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-lg font-bold"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="min-w-[20px] text-xs text-center">
                          {currentProduct.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateDetail(
                              "quantity",
                              Number(currentProduct.quantity) + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-lg font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-[var(--color-text-primary)]">
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
                              ? "bg-[var(--color-brand-primary)]"
                              : "bg-[var(--color-bg-primary)]"
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

              <div>
                <button
                  onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                  className="w-full text-left text-sm py-3 text-[var(--color-text-primary)] flex justify-between items-center"
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
                    {currentProduct.options &&
                    currentProduct.options.length > 0 ? (
                      currentProduct.options.map((option, idx) => (
                        <div
                          key={option.id || `option-${idx}`}
                          className="flex items-center gap-2 mb-2 cursor-pointer"
                          onClick={() => openOptionModal(idx)}
                        >
                          <span>
                            {option.template_name ? (
                              <span>
                                Template: {option.template_name} (
                                {option.options
                                  .map((opt) => {
                                    const [name, price] = opt.includes(":")
                                      ? opt.split(":")
                                      : [opt, ""];
                                    return price
                                      ? `${name} (NGN ${price})`
                                      : name;
                                  })
                                  .join(", ")}
                                )
                              </span>
                            ) : (
                              <span>
                                {option.options
                                  .map((opt) => {
                                    const [name, price] = opt.includes(":")
                                      ? opt.split(":")
                                      : [opt, ""];
                                    return price
                                      ? `${name} (NGN ${price})`
                                      : name;
                                  })
                                  .join(", ")}
                              </span>
                            )}
                            {option.note?.note && (
                              <p className="text-xs text-[var(--color-text-secondary)]">
                                Note: {option.note.note}
                              </p>
                            )}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteOption(idx);
                            }}
                            className="text-red-500 text-xs"
                            aria-label={`Delete option ${option.options
                              .map((opt) => {
                                const [name] = opt.includes(":")
                                  ? opt.split(":")
                                  : [opt];
                                return name;
                              })
                              .join(", ")}`}
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        No options available
                      </p>
                    )}
                    <button
                      onClick={() => openOptionModal()}
                      className="bg-[var(--color-bg-secondary)] px-4 text-[var(--color-brand-primary)] py-2 rounded-lg text-sm font-semibold mt-2 flex items-center gap-2 hover:text-[var(--color-brand-hover)]"
                      aria-label="Edit option"
                    >
                      Edit Option
                    </button>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => setIsExtraOpen(!isExtraOpen)}
                  className="w-full text-left text-sm py-3 text-[var(--color-text-primary)] flex justify-between items-center"
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

        <div className="flex-shrink-0 p-6 pt-0">
          <OptionModal
            isOpen={isOptionModalOpen}
            onClose={closeOptionModal}
            onSave={handleSaveOption}
            initialOption={currentProduct}
          />

          <div className="mt-6 flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-primary)] rounded-lg text-sm transition"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProduct}
              className="px-4 py-2 hover:bg-[var(--color-brand-hover)] bg-[var(--color-brand-primary)]  text-[var(--color-text-primary)] rounded-lg text-sm transition"
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
