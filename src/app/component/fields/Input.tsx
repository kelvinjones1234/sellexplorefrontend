import { useState } from "react";

interface FloatingLabelInputProps {
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  margin?: string;
  error?: string;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  margin,
  error,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative mb- ${margin || ""}`}>
      <div
        className={`relative border rounded-2xl ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-[var(--color-primary)]"
            : "border-[var(--color-border)]"
        }`}
      >
        <input
          type={type}
          name={name}
          id={name}
          value={value || ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`block w-full h-[3.2rem] pt-6 px-4 pb-2 bg-transparent rounded-2xl outline-none transition-all ${
            disabled ? "opacity-70" : ""
          }`}
        />
        <label
          htmlFor={name}
          className={`absolute duration-300 transform ${
            isFocused || value
              ? "text-xs top-3 scale-75 -translate-y-1 z-10"
              : "text-[.9rem] top-1/2 -translate-y-1/2"
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
