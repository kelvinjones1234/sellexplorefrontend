"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Edit } from "lucide-react";
import { apiClient } from "../api";
import { toast } from "react-toastify";
import CouponModal from "./AddCouponModal";

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

interface CouponsTabProps {
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
}

const CouponsTab: React.FC<CouponsTabProps> = ({
  itemsPerPage,
  setItemsPerPage,
  searchQuery,
}) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getCoupons(page, searchQuery, itemsPerPage);
      setCoupons(data || []);
      setTotal(data.count || 0);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch coupons";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCouponForEdit = async (id: number) => {
    try {
      setLoading(true);
      const coupon = await apiClient.getCoupon(id);
      setSelectedCoupon(coupon);
      setIsModalOpen(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch coupon details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page, searchQuery, itemsPerPage]);

  const handleSaveCoupon = async (data: CouponFormData) => {
    try {
      const formData = new FormData();
      formData.append("code", data.code);
      if (data.discount_amount)
        formData.append("discount_amount", data.discount_amount);
      if (data.discount_percentage)
        formData.append("discount_percentage", data.discount_percentage);
      formData.append("valid_from", data.valid_from);
      formData.append("valid_until", data.valid_until);
      formData.append("is_active", data.is_active.toString());
      data.products.forEach((id) => formData.append("products", id.toString()));

      if (selectedCoupon) {
        const updatedCoupon = await apiClient.updateCoupon(
          selectedCoupon.id,
          formData
        );
        setCoupons((prev) =>
          prev.map((c) => (c.id === selectedCoupon.id ? updatedCoupon : c))
        );
        toast.success("Coupon updated successfully!");
      } else {
        const newCoupon = await apiClient.createCoupon(formData);
        setCoupons((prev) => [newCoupon, ...prev]);
        setTotal((prev) => prev + 1);
        toast.success("Coupon created successfully!");
      }
    } catch (err: any) {
      throw new Error(err.message || "Failed to save coupon");
    }
  };

  const handleDeleteCoupon = async (id: number) => {
    try {
      await apiClient.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setTotal((prev) => prev - 1);
      toast.success("Coupon deleted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete coupon");
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDiscount = (coupon: Coupon) => {
    return coupon.discount_amount
      ? `${parseFloat(coupon.discount_amount).toFixed(2)}`
      : `${coupon.discount_percentage}%`;
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
        <p>Loading coupons...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button
          onClick={fetchCoupons}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="md:hidden divide-y divide-[var(--color-border-default)] px-4">
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-3">
                <div className="text-xs">
                  <p className="font-medium">{coupon.code}</p>
                  <p className="text-[var(--color-text-secondary)]">
                    {formatDiscount(coupon)}
                  </p>
                  <p className="text-[var(--color-text-secondary)]">
                    Valid: {formatDate(coupon.valid_from)} -{" "}
                    {formatDate(coupon.valid_until)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchCouponForEdit(coupon.id)}
                    className="p-1.5 hover:bg-[var(--color-bg-surface)] rounded-md transition-colors"
                  >
                    <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    coupon.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {coupon.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-sm text-[var(--color-text-secondary)]">
            No coupons found
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Code
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Discount
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Valid From
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Valid Until
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Products
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Status
              </th>
              <th className="text-left py-3 text-xs px-4 font-medium bg-[var(--color-bg-secondary)] uppercase tracking-wider text-[var(--color-text-primary)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border-default)] text-[var(--color-text-secondary)]">
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-[var(--color-bg-surface)] transition-colors"
                >
                  <td className="px-4 py-4">
                    <span className="text-sm">{coupon.code}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{formatDiscount(coupon)}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">
                      {formatDate(coupon.valid_from)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">
                      {formatDate(coupon.valid_until)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm">{coupon.products.length}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        coupon.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchCouponForEdit(coupon.id)}
                        className="p-1.5 hover:bg-[var(--color-bg-surface)] rounded-md transition-colors"
                      >
                        <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-4 text-center text-sm text-[var(--color-text-secondary)]"
                >
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-[var(--color-border-strong)] gap-4">
        {/* Items per page selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--color-text-secondary)]">
            Items per page:
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setItemsPerPage(newSize);
              setPage(1);
            }}
            className="border border-[var(--color-border-default)] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] rounded-md px-2 py-1 text-sm text-[var(--color-text-primary)]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-[var(--color-text-secondary)]">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] hover:text-[var(--color-text-secondary)] rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      <CouponModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCoupon(null);
        }}
        onSave={handleSaveCoupon}
        coupon={selectedCoupon}
      />
    </div>
  );
};

export default CouponsTab;
