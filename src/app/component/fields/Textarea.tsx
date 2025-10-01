// components/fields/Textarea.tsx
"use client";

import React from "react";

// ✅ Interface updated to use 'placeholder' instead of 'label' for consistency
interface FloatingLabelTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder: string;
  error?: string;
}

const FloatingLabelTextarea: React.FC<FloatingLabelTextareaProps> = ({
  placeholder, // ✅ Use 'placeholder' from props
  error,
  value,
  ...props
}) => {
  // Use a unique id for the htmlFor/id connection for accessibility
  const id = props.id || props.name || placeholder;

  return (
    <div className="relative w-full">
      <textarea
        {...props}
        id={id}
        value={value || ""}
        placeholder=" " // This space is crucial for the CSS to work
        className={`peer block w-full resize-none rounded-2xl border bg-transparent px-4 pb-2 pt-6 outline-none transition-all
          ${
            error
              ? "border-red-500"
              : "border-[var(--color-border-default)] focus:border-[var(--color-brand-primary)]"
          }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 origin-[0] transform cursor-text duration-300
          peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 bg-[var(--color-bg)] peer-placeholder-shown:scale-100
          peer-focus:top-3 peer-focus:-translate-y-1 peer-focus:scale-75
          ${
            value
              ? "top-3 -translate-y-1 scale-75"
              : "text-sm text-[var(--color-text-secondary)]"
          }
          peer-focus:text-[var(--color-primary)]`}
      >
        {placeholder} 
      </label>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FloatingLabelTextarea;
