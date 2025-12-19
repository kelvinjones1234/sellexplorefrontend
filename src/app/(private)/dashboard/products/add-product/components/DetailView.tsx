"use client";

import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelTextarea from "@/app/component/fields/Textarea";
import FancySelect from "./FancySelect";
import OptionModal from "./AddOptionModal";
import React, { useState } from "react";
import { ChevronDown, Plus, Trash2, Check, Edit2 } from "lucide-react";
import { CategoryResponse, ProductOption, Product } from "../types";

const DetailsView = ({
  products,
  currentIndex,
  setThumbnail,
  removeProduct,
  updateDetail,
  addOption,
  updateOption,
  removeOption,
  nextProduct,
  prevProduct,
  goBackToSelection,
  addMoreImagesRef,
  handleSelectFiles,
  categories,
}: {
  products: Product[];
  currentIndex: number;
  setThumbnail: (productIndex: number, imageIndex: number) => void;
  removeProduct: (index: number) => void;
  updateDetail: <K extends keyof Product["details"]>(
    field: K,
    value: Product["details"][K]
  ) => void;
  addOption: (option: ProductOption) => void;
  updateOption: (index: number, option: ProductOption) => void;
  removeOption: (index: number) => void;
  nextProduct: () => void;
  prevProduct: () => void;
  goBackToSelection: () => void;
  addMoreImagesRef: React.RefObject<HTMLInputElement | null>;
  handleSelectFiles: (
    e: React.ChangeEvent<HTMLInputElement>,
    productIndex?: number
  ) => void;
  categories: CategoryResponse[];
}) => {
  const currentProduct = products[currentIndex];
  if (!currentProduct) return null;
  const thumbnailPreview =
    currentProduct.images[currentProduct.thumbnailIndex]?.preview;
  const quantityImage = currentProduct.images[0]?.preview;
  const [isPricingOpen, setIsPricingOpen] = useState(true);
  const [isQuantityOpen, setIsQuantityOpen] = useState(true);
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [isExtraOpen, setIsExtraOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveOption = (option: ProductOption) => {
    if (currentProduct.details.options?.length > 0) {
      updateOption(0, option);
    } else {
      addOption(option);
    }
    closeModal();
  };

  return (
    <div className="max-w-md mx-auto py-4 px-4">
      <div className="text-center mt-6 mb-4">
        <div className="flex justify-center mb-2">
          <img
            src={thumbnailPreview}
            alt="Product thumbnail"
            className="w-24 h-24 object-cover rounded-xl shadow-md"
          />
        </div>
        <h2 className="font-semibold text-[var(--color-heading)] mt-2">
          Add Details - Product {currentIndex + 1}
        </h2>
        <button
          onClick={() => removeProduct(currentIndex)}
          className="text-red-600 flex items-center gap-1.5 text-sm mt-2 mx-auto hover:underline"
        >
          Remove item <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {currentProduct.images.map((img: any, idx: number) => (
          <div
            key={idx}
            className="relative flex-shrink-0"
            onClick={() => setThumbnail(currentIndex, idx)}
          >
            <img
              src={img.preview}
              alt={`Product image ${idx + 1}`}
              className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 ${
                currentProduct.thumbnailIndex === idx
                  ? "border-[var(--color-brand-primary)]"
                  : "border-transparent"
              }`}
            />
            {currentProduct.thumbnailIndex === idx && (
              <div className="absolute top-1 right-1 bg-[var(--color-brand-primary)] text-white w-4 h-4 flex items-center justify-center rounded-full text-xs">
                <Check className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
        <button
          onClick={() => addMoreImagesRef.current?.click()}
          className="w-16 h-16 flex-shrink-0 border-2 border-dashed hover:border-[var(--color-brand-primary)] border-[var(--color-border)] rounded-xl flex items-center justify-center text-gray-400"
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
        onChange={(e) => handleSelectFiles(e, currentIndex)}
        className="hidden"
        ref={addMoreImagesRef}
      />

      <div className="mt-4 flex flex-col gap-4">
        <div className="mb-3">
          <FloatingLabelInput
            type="text"
            name="product name"
            placeholder="Product Name"
            value={currentProduct.details.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateDetail("name", e.target.value)
            }
          />
        </div>
        <div className="relative">
          <FancySelect
            name="category"
            options={categories.map((cat: CategoryResponse) => ({
              value: cat.id,
              label: cat.name,
            }))}
            value={currentProduct.details.category}
            onChange={(val) => updateDetail("category", val)}
            onCreateCategory={() => console.log("Add new category clicked")}
            placeholder="Select category"
          />
        </div>
        <FloatingLabelTextarea
          placeholder="Product Description"
          value={currentProduct.details.description}
          onChange={(e) => updateDetail("description", e.target.value)}
        />
        <div className="py-4">
          <button
            onClick={() => setIsPricingOpen(!isPricingOpen)}
            className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
          >
            Product Pricing
            <ChevronDown
              className={`w-5 h-5 ${isPricingOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isPricingOpen && (
            <div className="">
              <div className="mb-3">
                <FloatingLabelInput
                  type="text"
                  name="price"
                  placeholder="Product Price NGN (No commas)"
                  value={currentProduct.details.price}
                  onChange={(e) => updateDetail("price", e.target.value)}
                />
              </div>
              <div className="mb-3">
                <FloatingLabelInput
                  type="text"
                  name="discount price"
                  placeholder="Discount Price NGN (Optional)"
                  value={currentProduct.details.discountPrice}
                  onChange={(e) =>
                    updateDetail("discountPrice", e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </div>
        <div className="">
          <button
            onClick={() => setIsQuantityOpen(!isQuantityOpen)}
            className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
          >
            Product Quantity
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                isQuantityOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isQuantityOpen && (
            <div className="py-2">
              <div className="flex items-center gap-3 mb-3">
                {quantityImage && (
                  <img
                    src={quantityImage}
                    alt="Quantity indicator"
                    className="w-12 h-12 object-cover rounded-xl"
                  />
                )}

                <div className="flex items-center gap-2 border border-[var(--color-border-strong)] rounded-xl px-1 py-1 w-fit">
                  <button
                    onClick={() =>
                      updateDetail(
                        "quantity",
                        Math.max(
                          0,
                          Number(currentProduct.details.quantity) - 1
                        ).toString()
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-lg font-bold"
                  >
                    -
                  </button>

                  <span className="min-w-[20px] text-xs text-center font-medium">
                    {currentProduct.details.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateDetail(
                        "quantity",
                        (Number(currentProduct.details.quantity) + 1).toString()
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-lg font-bold"
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
                        !currentProduct.details.availability
                      )
                    }
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      currentProduct.details.availability
                        ? "bg-[var(--color-brand-primary)]"
                        : "bg-[var(--color-border-default)] dark:bg-[var(--color-border-strong)]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentProduct.details.availability
                          ? "translate-x-6 bg-[var(--color-on-brand)]"
                          : "translate-x-0 bg-[var(--color-bg-primary)] dark:bg-[var(--color-text-primary)]"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="">
          <button
            onClick={() => setIsOptionsOpen(!isOptionsOpen)}
            className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
          >
            Product Options
            <ChevronDown
              className={`w-5 h-5 ${isOptionsOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isOptionsOpen && (
            <div className="py-2 space-y-3">
              {currentProduct.details.options?.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-[var(--color-border-secondary)] rounded-xl border border-[var(--color-border)]"
                >
                  <div className="text-sm">
                    {option.template_name ? (
                      <span>
                        Template: {option.template_name} (
                        {option.options
                          .map((opt) => {
                            const [name, price] = opt.includes(":")
                              ? opt.split(":")
                              : [opt, ""];
                            return price ? `${name} (${price})` : name;
                          })
                          .join(", ")}
                        )
                      </span>
                    ) : (
                      <span>
                        Options:{" "}
                        {option.options
                          .map((opt) => {
                            const [name, price] = opt.includes(":")
                              ? opt.split(":")
                              : [opt, ""];
                            return price ? `${name} (${price})` : name;
                          })
                          .join(", ")}
                      </span>
                    )}
                    {option.note?.note && (
                      <p className="text-xs text-gray-500">
                        Note: {option.note.note}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={openModal}
                      className="text-[var(--color-primary)] hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeOption(idx)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={openModal}
                className="bg-[var(--color-bg-secondary)] px-4 text-[var(--color-brand-primary)] py-2 rounded-lg text-sm font-semibold mt-2 flex items-center gap-2 hover:text-[var(--color-brand-hover)]"
              >
                {currentProduct.details.options?.length > 0 ? (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Option
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Add Option
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        <div className="">
          <button
            onClick={() => setIsExtraOpen(!isExtraOpen)}
            className="w-full text-left text-sm py-3 text-[var(--color-text)] font-semibold flex justify-between items-center"
          >
            Extra Product Info
            <ChevronDown
              className={`w-5 h-5 ${isExtraOpen ? "rotate-180" : ""}`}
            />
          </button>
          {isExtraOpen && (
            <div className="py-4">
              <div className="flex justify-between mb-4">
                {/* Recent */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-[var(--color-text-primary)]">
                    Recent
                  </label>
                  <button
                    onClick={() =>
                      updateDetail("recent", !currentProduct.details.recent)
                    }
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      currentProduct.details.recent
                        ? "bg-[var(--color-brand-primary)]"
                        : "bg-[var(--color-border-default)] dark:bg-[var(--color-border-strong)]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentProduct.details.recent
                          ? "translate-x-6 bg-[var(--color-on-brand)]"
                          : "translate-x-0 bg-[var(--color-bg-primary)] dark:bg-[var(--color-text-primary)]"
                      }`}
                    />
                  </button>
                </div>

                {/* Hot Deal */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-[var(--color-text-primary)]">
                    Hot deal
                  </label>
                  <button
                    onClick={() =>
                      updateDetail("hot_deal", !currentProduct.details.hot_deal)
                    }
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      currentProduct.details.hot_deal
                        ? "bg-[var(--color-brand-primary)]"
                        : "bg-[var(--color-border-default)] dark:bg-[var(--color-border-strong)]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentProduct.details.hot_deal
                          ? "translate-x-6 bg-[var(--color-on-brand)]"
                          : "translate-x-0 bg-[var(--color-bg-primary)] dark:bg-[var(--color-text-primary)]"
                      }`}
                    />
                  </button>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-[var(--color-text-primary)]">
                    Featured
                  </label>
                  <button
                    onClick={() =>
                      updateDetail("featured", !currentProduct.details.featured)
                    }
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                      currentProduct.details.featured
                        ? "bg-[var(--color-brand-primary)]"
                        : "bg-[var(--color-border-default)] dark:bg-[var(--color-border-strong)]"
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        currentProduct.details.featured
                          ? "translate-x-6 bg-[var(--color-on-brand)]"
                          : "translate-x-0 bg-[var(--color-bg-primary)] dark:bg-[var(--color-text-primary)]"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <FloatingLabelTextarea
                placeholder="Optional Product Settings"
                value={currentProduct.details.extraInfo}
                onChange={(e) => updateDetail("extraInfo", e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      <OptionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveOption}
        initialOption={
          currentProduct.details.options?.length > 0
            ? currentProduct.details.options[0]
            : null
        }
      />

      <div className="mt-8 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[var(--color-text)]">
            {currentIndex + 1} OF {products.length} PRODUCTS
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full mb-4">
          <div
            className="h-1.5 bg-[var(--color-success)] rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / products.length) * 100}%`,
            }}
          />
        </div>
        <div className="flex gap-3">
          {currentIndex === 0 ? (
            <button
              onClick={goBackToSelection}
              className="flex-1 px-4 py-3 
                 bg-[var(--color-bg-secondary)] 
                 hover:bg-[var(--color-bg-surface)] 
                 text-[var(--color-text-secondary)] 
                 rounded-xl text-sm font-medium transition-colors"
            >
              Back to Selection
            </button>
          ) : (
            <button
              onClick={prevProduct}
              className="flex-1 px-4 py-3 
                 bg-[var(--color-bg-secondary)] 
                 hover:bg-[var(--color-bg-surface)] 
                 text-[var(--color-text-secondary)] 
                 rounded-xl text-sm font-medium transition-colors"
            >
              Previous Product
            </button>
          )}

          <button
            onClick={nextProduct}
            className="flex-1 px-4 py-3 
               bg-[var(--color-brand-primary)] 
               hover:bg-[var(--color-brand-hover)] 
               text-[var(--color-on-brand)] 
               rounded-xl text-sm font-medium transition-colors"
          >
            {currentIndex === products.length - 1 ? "Finish" : "Next Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsView;