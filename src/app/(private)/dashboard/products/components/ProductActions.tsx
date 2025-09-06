"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreHorizontal,
  ExternalLink,
  Link as LinkIcon,
  Edit,
  Trash2,
  Copy,
  Star,
} from "lucide-react";

import { Product } from "../types";

interface ProductActionsProps {
  product: Product;
  variant: "mobile" | "desktop";
  onDelete: (product: Product | number[]) => void;
  onOpenDeleteModal: (product: Product) => void;
  onOpenEditModal: (product: Product) => void; // Add this
}

const ProductActions = ({
  product,
  variant,
  onDelete,
  onOpenDeleteModal,
  onOpenEditModal,
}: ProductActionsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [isAvailable, setIsAvailable] = useState(product.availability);
  const toggleAvailability = () => {
    setIsAvailable(!isAvailable);
    console.log(`Toggled availability for ${product.name}`);
  };

  const handleEdit = () => {
    onOpenEditModal(product);
  };

  const handleDelete = () => {
    console.log("Opening delete modal for product ID:", product.id);
    onOpenDeleteModal(product);
  };

  const mobileMenuContent = (
    <>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium transition-colors">
        <Star className="w-4 h-4" /> Feature Item
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium transition-colors">
        <LinkIcon className="w-4 h-4" /> Copy Link
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium transition-colors">
        <Edit onClick={handleEdit} className="w-4 h-4" /> Edit Item
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium transition-colors">
        <Copy className="w-4 h-4" /> Duplicate Item
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium transition-colors">
        <ExternalLink className="w-4 h-4" /> Share Item
      </button>
      <div className="border-t border-[var(--color-border)] my-1" />
      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Delete Item
      </button>
      <div className="border-t border-[var(--color-border)] my-1" />
      <div
        onClick={toggleAvailability}
        className="flex items-center justify-between px-3 py-2 text-sm font-medium cursor-pointer"
      >
        <span>Available</span>
        <div
          className={`w-10 h-5 flex items-center rounded-full transition-colors ${
            isAvailable
              ? "bg-[var(--color-primary)] justify-end"
              : "bg-gray-300 justify-start"
          }`}
        >
          <div className="w-4 h-4 bg-white rounded-full shadow-md transform transition-transform mx-0.5"></div>
        </div>
      </div>
    </>
  );

  const desktopMoreMenuContent = (
    <>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium transition-colors">
        <Star className="w-4 h-4" /> Feature Item
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium transition-colors">
        <LinkIcon className="w-4 h-4" /> Copy Link
      </button>
      <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[var(--color-bg-secondary)] rounded-lg text-sm font-medium transition-colors">
        <ExternalLink className="w-4 h-4" /> Share Item
      </button>
    </>
  );

  if (variant === "mobile") {
    return (
      <div className="relative" ref={menuRef}>
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-[var(--color-border-secondary)] rounded-full transition-colors"
        >
          <MoreHorizontal className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 z-20 w-56 bg-[var(--color-bg)] rounded-xl shadow-lg border border-[var(--color-border)] p-2">
            <div className="space-y-1">{mobileMenuContent}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        title="Edit"
        onClick={handleEdit}
        className="p-2 hover:bg-[var(--color-border-secondary)] rounded-full transition-colors"
      >
        <Edit className="w-4 h-4 text-[var(--color-text-secondary)]" />
      </button>
      <button
        title="Duplicate"
        className="p-2 hover:bg-[var(--color-border-secondary)] rounded-full transition-colors"
      >
        <Copy className="w-4 h-4 text-[var(--color-text-secondary)]" />
      </button>
      <button
        title="Delete"
        onClick={handleDelete}
        className="p-2 hover:bg-red-50 rounded-full transition-colors"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
      <div className="relative" ref={menuRef}>
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          title="More actions"
          className="p-2 hover:bg-[var(--color-border-secondary)] rounded-full transition-colors"
        >
          <MoreHorizontal className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 z-20 w-56 bg-[var(--color-bg)] rounded-xl shadow-lg border border-[var(--color-border)] p-2">
            <div className="space-y-1">{desktopMoreMenuContent}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductActions;
