import { useState } from "react";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  margin?: string;
  error?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  margin,
  error,
  autoFocus,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${margin || ""}`}>
      <div
        className={`relative border border-[var(--color-border-default)] rounded-xl ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-[var(--color-brand-primary)]"
            : "border-[var(--color-border)]"
        }`}
      >
        <input
          type={type}
          name={name}
          id={name}
          value={value ?? ""} // ✅ handles undefined safely
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          autoFocus={autoFocus}
          className={`block w-full h-[3rem] pt-6 px-4 pb-2 bg-transparent rounded-2xl outline-none transition-all ${
            disabled ? "opacity-70" : ""
          }`}
          {...rest} // ✅ allows accept, alt, capture, onKeyDown, etc.
        />
        <label
          htmlFor={name}
          className={`absolute duration-300 transform ${
            isFocused || value
              ? "text-xs top-2 scale-75 -translate-y-1 z-10"
              : "text-sm text-[var(--color-text-secondary)] top-1/2 -translate-y-1/2"
          } left-4 origin-[0] pointer-events-none`}
        >
          {placeholder}
        </label>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div> 
  );
};

export default FloatingLabelInput;
