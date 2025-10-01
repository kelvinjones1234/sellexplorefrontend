"use client";

import React, { useEffect, useState } from "react";
import { X, Plus } from "lucide-react";
import { apiClient } from "../api";
import FloatingLabelInput from "@/app/component/fields/Input";
import { useAuth } from "@/context/AuthContext";
import Alert from "../../components/Alert";

export interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, image: File | null) => void;
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
        className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
          <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
            <div className="flex justify-between items-center">
              <h2
                id="modal-title"
                className="text-md text-[var(--color-text-primary)]"
              >
                Create New Category
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
                aria-label="Close modal"
                disabled={isLoading}
              >
                <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </button>
            </div>

            {serverAlert.isOpen && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {serverAlert.message}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="relative">
                <div
                  className={`w-full text-gray-400 border-2 border-dashed hover:border-[var(--color-brand-primary)] border-[var(--color-border)] rounded-xl flex items-center justify-center text-gray-400${
                    fieldErrors.image
                      ? "border-red-500"
                      : "border-[var(--color-border-default)]"
                  }`}
                >
                  <label
                    htmlFor="category-image"
                    className="relative flex flex-col items-center justify-center w-full h-32 rounded-lg cursor-pointer hover:bg-[var(--color-bg-secondary)] transition"
                  >
                    {image ? (
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Category preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                        <Plus className="w-8 h-8 mb-2" />
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
                      disabled={isLoading}
                    />
                  </label>
                </div>
                {fieldErrors.image && (
                  <p className="mt-1 text-sm text-red-500">
                    {fieldErrors.image}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-primary)] rounded-lg text-sm transition"
                  aria-label="Cancel"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition disabled:opacity-50"
                  aria-label="Create category"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--color-on-brand)]"
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
      </div>
    </>
  );
}
