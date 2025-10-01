"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "../../api";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelSelect from "@/app/component/fields/Selection";

interface UpdateWalletDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  banks: { value: string; label: string }[];
  initialBankName: string;
  initialAccountNumber: string;
}

const UpdateWalletDetailsModal: React.FC<UpdateWalletDetailsModalProps> = ({
  isOpen,
  onClose,
  banks,
  initialBankName,
  initialAccountNumber,
}) => {
  const [bankName, setBankName] = useState(initialBankName);
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || accountNumber.length !== 10) {
      setError("Please enter a valid 10-digit account number.");
      return;
    }
    if (!bankName) {
      setError("Please select a bank.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.updateWalletDetails({
        bank_name: bankName,
        account_number: accountNumber,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update wallet details");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 text-[var(--color-text-secondary)] flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)]">
              Update Wallet Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
              disabled={loading}
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <FloatingLabelInput
                type="text"
                name="accountNumber"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  setError(null);
                }}
                placeholder="Account Number"
                disabled={loading}
              />
              <FloatingLabelSelect
                name="bank"
                value={bankName}
                onChange={(val) => {
                  setBankName(val.toString());
                  setError(null);
                }}
                placeholder="Select Bank"
                options={banks}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] transition"
                aria-label="Cancel"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition disabled:opacity-50"
                aria-label="Update wallet details"
              >
                {loading ? "Updating..." : "Update Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateWalletDetailsModal;
