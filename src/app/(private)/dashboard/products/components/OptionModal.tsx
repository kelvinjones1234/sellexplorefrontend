"use client";

import React, { useState } from "react";
import { X, ImagePlus } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import FancySelect from "../add-product/components/FancySelect";
import { ProductOption } from "../types";

interface OptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (option: ProductOption) => void;
  initialOption?: ProductOption;
}

const templateOptions = [
  { value: "size", label: "Size Template" },
  { value: "color", label: "Color Template" },
  { value: "packaging", label: "Packaging Template" },
];

const OptionModal: React.FC<OptionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialOption,
}) => {
  const [optionName, setOptionName] = useState(initialOption?.name || "");
  const [optionImage, setOptionImage] = useState<File | null>(
    initialOption?.image || null
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSave = () => {
    if (!optionName) {
      alert("Option name is required");
      return;
    }
    const newOption: ProductOption = {
      name: optionName,
      image: optionImage || undefined,
    };
    onSave(newOption);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--color-bg)] rounded-2xl shadow-xl w-11/12 max-w-md p-6 animate-in fade-in-0 zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {initialOption ? "Edit Product Option" : "Add Product Option"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[var(--color-border)] border border-[var(--color-border)] transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="border border-[var(--color-border-secondary)] rounded-xl p-4 shadow-xs hover:shadow-sm transition">
            <label className="block text-sm font-medium text-[var(--color-body)] mb-2">
              Option Name
            </label>
            <FloatingLabelInput
              type="text"
              name="option"
              placeholder="Enter option (e.g., Size, Color)"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
            />
          </div>

          <div className="border border-[var(--color-border-secondary)] rounded-xl p-4 shadow-xs hover:shadow-sm transition">
            <label className="block text-sm font-medium text-[var(--color-body)] mb-2">
              Option Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[var(--color-border)] rounded-lg cursor-pointer hover:border-[var(--color-primary)] hover:bg-[var(--color-border-secondary)] transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-[var(--color-body)]">
                  <ImagePlus className="w-6 h-6 mb-1" />
                  <p className="text-xs">Click to upload option image</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setOptionImage(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
            {optionImage && (
              <p className="text-xs mt-2">Selected: {optionImage.name}</p>
            )}
          </div>

          <div className="border border-[var(--color-border-secondary)] rounded-xl p-4">
            <label className="block text-sm font-medium text-[var(--color-body)] mb-2">
              Use a saved template
            </label>
            <FancySelect
              name="template"
              options={templateOptions}
              value={selectedTemplate}
              onChange={(val) => setSelectedTemplate(val)}
              placeholder="Select a template"
              margin="mb-0"
            />
          </div>
          <div className="flex items-center justify-between border border-[var(--color-border-secondary)] rounded-xl p-4">
            <span className="text-sm font-medium text-[var(--color-body)]">
              Save as template
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onChange={(e) =>
                  console.log("Save template:", e.target.checked)
                }
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-[var(--color-primary)] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[var(--color-border)] hover:bg-[var(--color-border-secondary)] rounded-lg text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg text-sm font-semibold transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default OptionModal;
