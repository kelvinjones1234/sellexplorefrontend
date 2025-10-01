"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Trash2,
  Edit,
  Plus,
  X,
  MapPin,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { apiClient } from "../api";
import FloatingLabelInput from "@/app/component/fields/Input";

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface AreaError {
  location?: string;
  delivery_fee?: string;
}

interface InternalDeliveryArea {
  id: number;
  location: string;
  delivery_fee: string | number;
}

const Main = () => {
  const [deliveryAreas, setDeliveryAreas] = useState<InternalDeliveryArea[]>(
    []
  );
  const [errors, setErrors] = useState<Record<number, AreaError>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [editingIds, setEditingIds] = useState<Set<number>>(new Set()); // Changed to Set<number>
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Toast management
  const showToast = (type: "success" | "error" | "info", message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  console.log("deliveryAreas", deliveryAreas);

  // Fetch delivery areas on component mount
  useEffect(() => {
    const fetchDeliveryAreas = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getDeliveryAreas();
        console.log("Fetched delivery areas:", response);
        const areas = response || [];
        setDeliveryAreas(areas);
        // Set all areas to edit mode on mount
        setEditingIds(
          new Set(areas.map((area: InternalDeliveryArea) => area.id))
        );
      } catch (error) {
        console.error("Error fetching delivery areas:", error);
        setDeliveryAreas([]);
        showToast(
          "error",
          "Failed to load delivery areas. Please refresh and try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeliveryAreas();
  }, []);

  const validateArea = (area: InternalDeliveryArea): AreaError => {
    const errors: AreaError = {};

    if (!area.location || !area.location.toString().trim()) {
      errors.location = "Location is required";
    }

    const feeStr = area.delivery_fee?.toString().trim();
    if (!feeStr) {
      errors.delivery_fee = "Delivery fee is required";
    } else {
      if (!/^\d+(\.\d{0,2})?$/.test(feeStr)) {
        errors.delivery_fee = "Enter a valid number (e.g., 2500 or 2500.00)";
      } else {
        const feeNum = parseFloat(feeStr);
        if (feeNum <= 0) {
          errors.delivery_fee = "Delivery fee must be greater than 0";
        }
      }
    }

    return errors;
  };

  const handleAddNewArea = () => {
    const newArea: InternalDeliveryArea = {
      id: Date.now(),
      location: "",
      delivery_fee: "",
    };
    setDeliveryAreas([...deliveryAreas, newArea]);
    setEditingIds((prev) => new Set(prev).add(newArea.id));
    setHasUnsavedChanges(true);
  };

  const handleInputChange = (
    id: number,
    field: "location" | "delivery_fee",
    value: string
  ) => {
    console.log(`Updating ${field} for area ${id} with value:`, value);

    setDeliveryAreas((prev) =>
      prev.map((area) => (area.id === id ? { ...area, [field]: value } : area))
    );
    setHasUnsavedChanges(true);

    setErrors((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: undefined,
      },
    }));
  };

  const handleSave = async (specificId?: number) => {
    console.log("Saving areas. Current state:", deliveryAreas);

    const areasToProcess = specificId
      ? deliveryAreas.filter((area) => area.id === specificId)
      : deliveryAreas;

    let hasErrors = false;
    const newErrors: Record<number, AreaError> = {};

    for (const area of areasToProcess) {
      const areaErrors = validateArea(area);
      if (Object.keys(areaErrors).length > 0) {
        newErrors[area.id] = areaErrors;
        hasErrors = true;
      }
    }

    setErrors(newErrors);

    if (hasErrors) {
      showToast("error", "Please fix all errors before saving.");
      return;
    }

    if (specificId) {
      setSavingId(specificId);
    } else {
      setIsLoading(true);
    }

    try {
      for (const area of areasToProcess) {
        const payload = {
          location: area.location.trim(),
          delivery_fee: area.delivery_fee.toString().trim(),
        };

        console.log("Sending payload:", payload);

        if (area.id > 1000000) {
          const newArea = await apiClient.createDeliveryArea(payload);
          console.log("Created new area:", newArea);

          setDeliveryAreas((prev) =>
            prev.map((a) => (a.id === area.id ? newArea : a))
          );
        } else {
          const updatedArea = await apiClient.updateDeliveryArea(
            area.id,
            payload
          );
          console.log("Updated area:", updatedArea);

          setDeliveryAreas((prev) =>
            prev.map((a) => (a.id === area.id ? updatedArea : a))
          );
        }
      }

      if (specificId) {
        setEditingIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(specificId);
          return newSet;
        });
      } else {
        setEditingIds(new Set());
      }
      setHasUnsavedChanges(false);
      setErrors({});
      showToast(
        "success",
        specificId
          ? "Delivery area saved successfully"
          : "All delivery areas saved successfully"
      );
    } catch (error) {
      console.error("Error saving delivery areas:", error);
      showToast("error", "Failed to save delivery areas. Please try again.");
    } finally {
      if (specificId) {
        setSavingId(null);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this delivery area?")) return;

    setDeletingId(id);
    try {
      if (id > 1000000) {
        setDeliveryAreas(deliveryAreas.filter((area) => area.id !== id));
      } else {
        await apiClient.deleteDeliveryArea(id);
        setDeliveryAreas(deliveryAreas.filter((area) => area.id !== id));
      }

      setErrors((prev) => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });

      setEditingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });

      showToast("success", "Delivery area deleted successfully");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error deleting delivery area:", error);
      showToast("error", "Failed to delete delivery area. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: number) => {
    setEditingIds((prev) => new Set(prev).add(id));
  };

  const handleCancelEdit = (id: number) => {
    setEditingIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });

    setDeliveryAreas((prev) =>
      prev.filter(
        (area) =>
          area.id <= 1000000 ||
          (area.location.trim() && area.delivery_fee.toString().trim())
      )
    );

    setErrors((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    setHasUnsavedChanges(false);
  };

  const getToastIcon = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "info":
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getToastColors = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 border rounded-lg shadow-md max-w-sm animate-in slide-in-from-right-full ${getToastColors(
              toast.type
            )}`}
          >
            {getToastIcon(toast.type)}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-60 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 bg-[var(--color-bg)] border-b border-[var(--color-border-secondary)] px-4 py-3 z-10 backdrop-blur-sm bg-opacity-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Link href="/dashboard/my-store/">
              <span className="font-medium text-[var(--color-heading)] hover:text-[var(--color-primary)] transition-colors">
                Store settings
              </span>
            </Link>
            <span>›</span>
            <span>Delivery Areas</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[var(--color-primary)]">⚡</span>
              <span className="text-sm font-medium text-[var(--color-text)]">
                Quick Actions
              </span>
              <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="px-4 pb-8">
        <div className="max-w-[900px] mx-auto py-6 md:py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              <MapPin className="w-8 h-8" />
            </div>
            <h2 className="text-center text-xl font-bold text-[var(--color-heading)] mb-3">
              Delivery Areas
            </h2>
            <div className="text-sm text-[var(--color-text-muted)] max-w-[600px] mx-auto bg-[var(--card-bg-2)] p-6 rounded-2xl border border-[var(--color-border-secondary)]">
              <p className="mb-2">
                Set up your delivery zones and fees to help customers calculate
                shipping costs during checkout.
              </p>
              <p className="text-xs opacity-75">
                Examples: Lekki Phase 1, Victoria Island, Abuja Central, Port
                Harcourt, etc.
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-[var(--color-text-muted)]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading delivery areas...</span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && deliveryAreas.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-[var(--color-heading)] mb-2">
                No delivery areas set up yet
              </h3>
              <p className="text-[var(--color-text-muted)] mb-6">
                Add your first delivery area to get started with location-based
                shipping.
              </p>
              <button
                onClick={handleAddNewArea}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add First Delivery Area
              </button>
            </div>
          )}

          {/* Form Rows */}
          {!isLoading && deliveryAreas.length > 0 && (
            <div className="space-y-4 mb-6">
              {deliveryAreas.map((area) => (
                <div
                  key={area.id}
                  className={`bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-2xl p-4 transition-all duration-200 ${
                    editingIds.has(area.id)
                      ? "ring-[var(--color-primary)] ring-opacity-20 border-[var(--color-primary)]"
                      : "hover:shadow-sm"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* Location Input */}
                    <div className="flex-1 w-full">
                      {editingIds.has(area.id) ? (
                        <FloatingLabelInput
                          name={`location-${area.id}`}
                          placeholder="Delivery Location (e.g., Lekki Phase 1)"
                          value={area.location}
                          onChange={(e) =>
                            handleInputChange(
                              area.id,
                              "location",
                              e.target.value
                            )
                          }
                          error={errors[area.id]?.location}
                          autoFocus={!area.location}
                        />
                      ) : (
                        <div className="p-3">
                          <div className="text-xs mb-1 text-[var(--color-text)]">
                            Location
                          </div>
                          <div className="font-medium text-[var(--text-secondary)]">
                            {area.location || "No location set"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delivery Fee Input */}
                    <div className="flex-1 w-full">
                      {editingIds.has(area.id) ? (
                        <FloatingLabelInput
                          name={`delivery_fee-${area.id}`}
                          placeholder="Delivery Fee (e.g., 2500)"
                          value={area.delivery_fee.toString()}
                          onChange={(e) =>
                            handleInputChange(
                              area.id,
                              "delivery_fee",
                              e.target.value
                            )
                          }
                          error={errors[area.id]?.delivery_fee}
                        />
                      ) : (
                        <div className="p-3 text-[var(--color-text)]">
                          <div className="text-xs mb-1">Delivery Fee</div>
                          <div className="font-medium">
                            ₦
                            {area.delivery_fee
                              ? parseFloat(
                                  area.delivery_fee.toString()
                                ).toLocaleString()
                              : "0"}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {editingIds.has(area.id) ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSave(area.id)}
                            disabled={savingId === area.id}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
                          >
                            {savingId === area.id && (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            )}
                            Save
                          </button>
                          <button
                            onClick={() => handleCancelEdit(area.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(area.id)}
                            className="p-2 text-[var(--color-primary)] rounded-lg transition-colors"
                            title="Edit delivery area"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(area.id)}
                            disabled={deletingId === area.id}
                            className="p-2 text-red-500 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete delivery area"
                          >
                            {deletingId === area.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {!isLoading && deliveryAreas.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddNewArea}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4" />
                Add New Area
              </button>

              {hasUnsavedChanges && (
                <button
                  onClick={() => handleSave()}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLoading ? "Saving..." : "Save All Changes"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
