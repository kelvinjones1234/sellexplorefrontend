"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";
import CreateCategoryModal from "./CreateCategoryModal";
import { FancySelectProps } from "../types";

export default function FancySelect<T extends React.Key = string>({
  name,
  options,
  value,
  onChange,
  onCreateCategory,
  placeholder = "Select category",
  margin,
  disabled = false,
  error,
}: FancySelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  const handleCreateCategory = (name: string, image: File | null) => {
    if (onCreateCategory) {
      onCreateCategory(name, image);
    }
  };

  return (
    <div className={`relative ${margin || "mb-3"}`}>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div
        className={`relative border border-[var(--color-border-default)] rounded-xl ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-[var(--color-brand-primary)]"
            : "border-[var(--color-border-default)]"
        }`}
      >
        {/* Trigger */}
        <button
          type="button"
          id={name}
          onClick={() => !disabled && setOpen(!open)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`block w-full h-[3.2rem] pt-6 pl-4 pr-10 pb-2 bg-transparent rounded-2xl outline-none text-left ${
            disabled ? "opacity-70" : ""
          }`}
        >
          <span>{selectedLabel || ""}</span>
        </button>

        {/* Floating Label */}
        <label
          htmlFor={name}
          className={`absolute duration-300 transform ${
            isFocused || value || open
              ? "text-xs top-3 scale-75 -translate-y-1 z-10"
              : "text-sm text-[var(--color-text-secondary)] top-1/2 -translate-y-1/2"
          } left-4 origin-[0] pointer-events-none`}
        >
          {placeholder}
        </label>

        {/* Dropdown Arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-[var(--color-text-secondary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown */}
        {open && (
          <div className="absolute mt-1 w-full bg-[var(--color-bg-primary)] border-[var(--color-border-default)] border rounded-2xl shadow-lg z-10">
            {/* Search bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-border-default)]">
              <Search className="h-4 w-4 text-[var(--color-text-secondary)]" />
              <input
                type="text"
                placeholder="Search for categories"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none text-sm bg-transparent"
              />
            </div>

            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {filtered.length > 0 ? (
                filtered.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-bg-secondary)] hover:bg-opacity-10 ${
                      value === opt.value ? "bg-opacity-20 font-medium" : ""
                    }`}
                  >
                    {opt.label}
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                  No results
                </p>
              )}
            </div>

            {/* Add new category */}
            {onCreateCategory && (
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setOpen(false);
                }}
                className="w-full px-3 py-2 text-sm hover:text-[var(--color-brand-hover)] text-[var(--color-brand-primary)] font-medium border-t border-[var(--color-border-default)] hover:bg-[var(--color-bg-secondary)] hover:bg-opacity-10 flex items-center justify-center gap-1"
              >
                <Plus className="h-4 w-4" /> Create new category
              </button>
            )}
          </div>
        )}
      </div>

      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </div>
  );
}
