"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; phone: string; email: string }) => void;
  initialData: { name?: string; phone?: string; email?: string };
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // ✅ When modal opens or initialData changes, sync form fields
  useEffect(() => {
    if (initialData) {
      setEditData({
        name: initialData.name || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(editData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--color-bg-surface)] rounded-3xl shadow-xl w-11/12 max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex-shrink-0 justify-between items-center p-6 border-b border-[var(--color-border-strong)]">
          <div className="flex justify-between items-center">
            <h2 className="text-md text-[var(--color-text-primary)]">
              Edit Customer - {editData.name || "Unnamed"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-5">
            <FloatingLabelInput
              name="name"
              placeholder="Customer Name"
              value={editData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              autoFocus
            />

            <FloatingLabelInput
              name="phone"
              placeholder="Customer Phone"
              value={editData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />

            <FloatingLabelInput
              type="email"
              name="email"
              placeholder="Customer Email"
              value={editData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 pt-0 flex justify-end">
          <button
            onClick={handleSave}
            className="w-full px-4 py-4 rounded-xl text-sm font-medium bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-[var(--color-on-brand)] transition"
            aria-label="Save updates"
          >
            Save updates
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;
