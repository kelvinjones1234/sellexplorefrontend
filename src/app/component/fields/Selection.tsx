import { useState } from "react";

interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface FloatingLabelSelectProps {
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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

  return (
    <div className={`relative mb-3 ${margin || ""}`}>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <div
        className={`relative border rounded-2xl ${
          error
            ? "border-red-500"
            : isFocused
            ? "border-[var(--color-primary)]"
            : "border-[var(--color-border)]"
        }`}
      >
        <select
          name={name}
          id={name}
          value={value || ""}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          className={`block w-full h-[3.2rem] pt-6 pl-4 pr-10 pb-2 bg-transparent rounded-2xl outline-none appearance-none ${
            disabled ? "opacity-70" : ""
          }`}
        >
          <option value="" disabled></option>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
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
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
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
      </div>
    </div>
  );
};

export default FloatingLabelSelect;
