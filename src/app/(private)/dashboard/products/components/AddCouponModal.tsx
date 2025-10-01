"use client";

import React, { useState } from "react";
import { Loader2, X } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import { toast } from "react-toastify";
import CouponProductsModal from "./CouponProductModal";
import { apiClient } from "../api";

// --- Interfaces ---
interface Coupon {
  id: number;
  code: string;
  discount_amount: string | null;
  discount_percentage: string | null;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  products: number[];
}

interface CouponFormData {
  code: string;
  discount_amount: string;
  discount_percentage: string;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  products: number[];
}

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CouponFormData) => Promise<void>;
  coupon: Coupon | null;
}

const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  onClose,
  onSave,
  coupon,
}) => {
  // Initialize default dates for new coupons (e.g., current date/time for valid_from, +1 day for valid_until)
  const defaultValidFrom = new Date().toISOString().slice(0, 16);
  const defaultValidUntil = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  const [formData, setFormData] = useState<CouponFormData>({
    code: coupon?.code || "",
    discount_amount: coupon?.discount_amount || "",
    discount_percentage: coupon?.discount_percentage || "",
    valid_from:
      coupon?.valid_from && !isNaN(new Date(coupon.valid_from).getTime())
        ? new Date(coupon.valid_from).toISOString().slice(0, 16)
        : defaultValidFrom,
    valid_until:
      coupon?.valid_until && !isNaN(new Date(coupon.valid_until).getTime())
        ? new Date(coupon.valid_until).toISOString().slice(0, 16)
        : defaultValidUntil,
    is_active: coupon?.is_active ?? true,
    products: coupon?.products || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`); // Debug input changes
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  const handleProductsSave = async (selectedProducts: number[]) => {
    setFormData((prev) => ({ ...prev, products: selectedProducts }));
  };

  const handleSubmit = async () => {
    if (!formData.code) {
      toast.error("Coupon code is required");
      return;
    }
    if (!formData.discount_amount && !formData.discount_percentage) {
      toast.error("At least one discount type is required");
      return;
    }
    if (formData.discount_amount && formData.discount_percentage) {
      toast.error("Please provide only one discount type");
      return;
    }
    if (!formData.valid_from) {
      toast.error("Valid from date is required");
      return;
    }
    if (!formData.valid_until) {
      toast.error("Valid until date is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("code", formData.code);
      if (formData.discount_amount)
        formDataToSend.append("discount_amount", formData.discount_amount);
      if (formData.discount_percentage)
        formDataToSend.append(
          "discount_percentage",
          formData.discount_percentage
        );
      // Append seconds and UTC timezone to match ISO 8601
      formDataToSend.append("valid_from", `${formData.valid_from}:00Z`);
      formDataToSend.append("valid_until", `${formData.valid_until}:00Z`);
      formDataToSend.append("is_active", formData.is_active.toString());
      formData.products.forEach((id) =>
        formDataToSend.append("products", id.toString())
      );

      console.log("Submitting FormData:", Object.fromEntries(formDataToSend)); // Debug FormData

      if (coupon) {
        // Update existing coupon
        await apiClient.updateCoupon(coupon.id, formDataToSend);
        toast.success("Coupon updated successfully!");
      } else {
        // Create new coupon
        await apiClient.createCoupon(formDataToSend);
        toast.success("Coupon created successfully!");
      }

      // Notify parent component of the save action
      await onSave(formData);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to save coupon");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[var(--color-bg)] rounded-xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-heading)]">
              {coupon ? "Edit Coupon" : "Add Coupon"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[var(--color-bg-secondary)] rounded-full"
            >
              <X className="w-5 h-5 text-[var(--color-text-muted)]" />
            </button>
          </div>
          <div className="space-y-4">
            <FloatingLabelInput
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Coupon Code"
              required
            />
            <FloatingLabelInput
              type="number"
              name="discount_amount"
              value={formData.discount_amount}
              onChange={handleChange}
              placeholder="Discount Amount"
            />
            <FloatingLabelInput
              type="number"
              name="discount_percentage"
              value={formData.discount_percentage}
              onChange={handleChange}
              placeholder="Discount Percentage"
            />
            <FloatingLabelInput
              type="datetime-local"
              name="valid_from"
              value={formData.valid_from}
              onChange={handleChange}
              placeholder="Valid From"
              required
            />
            <FloatingLabelInput
              type="datetime-local"
              name="valid_until"
              value={formData.valid_until}
              onChange={handleChange}
              placeholder="Valid Until"
              required
            />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--color-text)] px-2">
                Active
              </label>
              <button
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.is_active
                    ? "bg-[var(--color-primary)]"
                    : "bg-[var(--color-border)]"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-bg)] transition-transform ${
                    formData.is_active ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <button
              onClick={() => setProductModalOpen(true)}
              className="bg-[var(--color-border-secondary)] px-4 text-[var(--color-primary)] py-2 rounded-lg text-sm font-semibold mt-2"
              aria-label="Select products"
            >
              Select Products
            </button>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
      <CouponProductsModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        onSave={handleProductsSave}
        initialSelected={formData.products}
      />
    </>
  );
};

export default CouponModal;
