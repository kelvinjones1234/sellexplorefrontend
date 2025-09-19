"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FloatingLabelSelectProps {
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder: string;
  margin?: string;
  disabled?: boolean;
  options?: Option[];
  error?: string;
}

const FloatingLabelSelect: React.FC<FloatingLabelSelectProps> = ({
  name,
  value,
  onChange,
  placeholder,
  margin,
  disabled = false,
  options = [],
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`relative ${margin || ""}`}>
      <div
        className={`relative border rounded-2xl ${
          error
            ? "border-red-500"
            : isFocused || open
            ? "border-[var(--color-primary)]"
            : "border-[var(--color-border)]"
        }`}
      >
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full h-[3rem] pt-6 pl-4 pr-10 pb-2 bg-transparent rounded-2xl text-left text-sm ${
            disabled ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {selected ? (
            <span className="text-[var(--color-body)]">{selected.label}</span>
          ) : // ❌ REMOVE this placeholder text
          // <span className="text-gray-400">{placeholder}</span>
          null}
        </button>

        {/* Floating label */}
        <label
          htmlFor={name}
          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
            isFocused || selected
              ? "text-xs top-2 text-[var(--color-primary)]"
              : "text-sm top-1/2 -translate-y-1/2 text-gray-500"
          }`}
        >
          {placeholder}
        </label>

        {/* Chevron */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Dropdown menu */}
        {open && (
          <ul className="absolute z-20 mt-1 w-full bg-white dark:bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl shadow-lg max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--color-border-secondary)] ${
                    value === opt.value
                      ? "bg-[var(--color-primary)] text-white"
                      : ""
                  } ${opt.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FloatingLabelSelect;
