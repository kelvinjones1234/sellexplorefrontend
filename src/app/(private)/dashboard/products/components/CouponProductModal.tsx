"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Search } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import { apiClient } from "../api";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
}

interface CouponProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedProducts: number[]) => Promise<void>;
  initialSelected?: number[];
}

const CouponProductsModal: React.FC<CouponProductsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSelected = [],
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>(initialSelected);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load products from API
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      apiClient
        .getCouponProducts()
        .then((prods) => {
          setProducts(prods || []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch products");
          setLoading(false);
        });
    }
  }, [isOpen]);

  const handleToggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(selected);
      onClose();
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Failed to save product selection");
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg)] rounded-xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--color-heading)]">
            Select Products for Coupon
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--color-bg-secondary)] rounded-full"
          >
            <X className="w-5 h-5 text-[var(--color-text-muted)]" />
          </button>
        </div>
        <div className="relative mb-4">
          <FloatingLabelInput
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-[var(--color-text-muted)]">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Loading products...
            </div>
          ) : error ? (
            <p className="text-center text-sm text-red-500 py-6">{error}</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((p, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === filteredProducts.length - 1;

              return (
                <label
                  key={p.id}
                  className={`flex items-center justify-between py-4 px-3 border border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-bg-secondary)] 
                    ${isFirst ? "rounded-t-xl" : ""} 
                    ${isLast ? "rounded-b-xl" : ""} 
                    ${!isLast ? "border-b-0" : ""}`}
                >
                  <span className="text-sm text-[var(--color-text)] font-medium">
                    {p.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => handleToggle(p.id)}
                    className="h-4 w-4 accent-[var(--color-primary)]"
                  />
                </label>
              );
            })
          ) : (
            <p className="text-center text-sm text-[var(--color-text-muted)] py-6">
              No products found
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text)] rounded-lg font-medium hover:bg-[var(--color-bg-secondary)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponProductsModal;