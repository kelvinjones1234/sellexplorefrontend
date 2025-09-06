"use client";

import React, { useEffect, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { apiClient } from "../api";
import FloatingLabelInput from "@/app/component/fields/Input";
import { useAuth } from "@/context/AuthContext";
import Alert from "../../components/Alert";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
}: CreateCategoryModalProps) {
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    image?: string;
  }>({});
  const [serverAlert, setServerAlert] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({ isOpen: false, type: "success", message: "" });

  const { accessToken } = useAuth();

  useEffect(() => {
    if (accessToken) {
      apiClient.setAccessToken(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!isOpen) {
      setName("");
      setImage(null);
      setIsLoading(false);
      setFieldErrors({});
      setServerAlert({ isOpen: false, type: "success", message: "" });
    }
  }, [isOpen]);

  const validateFields = () => {
    const errors: { name?: string; image?: string } = {};
    if (!name.trim()) {
      errors.name = "Category name is required";
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const errors = validateFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsLoading(true);
    setServerAlert({ isOpen: false, type: "success", message: "" });

    try {
      if (!apiClient.isAuthenticated())
        throw new Error("No access token available");

      const response = await apiClient.postCategory(name, image);

      setServerAlert({
        isOpen: true,
        type: "success",
        message: response.message || "Category created successfully!",
      });

      // Clear form on success
      setName("");
      setImage(null);
      setFieldErrors({});
    } catch (error: any) {
      setServerAlert({
        isOpen: true,
        type: "error",
        message:
          error.response?.data?.detail || error.message || "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldErrors((prev) => ({ ...prev, image: undefined }));
      if (!file.type.startsWith("image/")) {
        setFieldErrors((prev) => ({
          ...prev,
          image: "Please upload a valid image file.",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        setFieldErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB.",
        }));
        return;
      }
      setImage(file);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl shadow-xl w-11/12 max-w-md p-6 animate-in fade-in-0 zoom-in-95 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h3
              id="modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Create New Category
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Close modal"
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Server Alert */}
          {serverAlert.isOpen && (
            <Alert
              type={serverAlert.type}
              message={serverAlert.message}
              onClose={() => setServerAlert({ ...serverAlert, isOpen: false })}
            />
          )}

          {/* Content */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category Name */}
            <div className="relative">
              <FloatingLabelInput
                type="text"
                name="Category name"
                placeholder="Category name e.g., Electronics"
                error={fieldErrors.name}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
              />
            </div>

            {/* Category Image */}
            <div className="relative">
              <div
                className={`flex items-center justify-center w-full ${
                  fieldErrors.image ? "border-red-500" : "border-gray-300"
                } border-2 border-dashed rounded-lg`}
              >
                <label
                  htmlFor="category-image"
                  className="relative flex flex-col items-center justify-center w-full h-32 rounded-lg cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-700 transition overflow-hidden"
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Category preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <ImagePlus className="w-8 h-8 mb-2" />
                      <p className="text-sm">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs">PNG, JPG, GIF (MAX. 5MB)</p>
                    </div>
                  )}
                  <input
                    id="category-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              {fieldErrors.image && (
                <p className="mt-1 text-sm text-red-500">{fieldErrors.image}</p>
              )}
            </div>

            {/* Footer Actions */}
            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-sm font-medium transition dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:text-gray-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-lg text-sm font-semibold transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
