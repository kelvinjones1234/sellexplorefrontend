"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { categories, statesInNigeria } from "@/constant/auth";
import { RegistrationData, FormErrors } from "@/app/types/AuthTypes";
import FloatingLabelInput from "@/app/component/fields/Input";
import FloatingLabelSelect from "@/app/component/fields/Selection";
import { useAuth } from "@/context/AuthContext";

const SignupFormInner: React.FC = () => {
  const { register, error: authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    email: "",
    full_name: "",
    store_name: "",
    password: "",
    location: "",
    niche: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Effect to sync authError with local errors state
  useEffect(() => {
    if (authError) {
      setErrors(authError);
    }
  }, [authError]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({}); // Reset previous errors

    const newErrors: FormErrors = {};

    // 1. Required fields
    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.store_name.trim())
      newErrors.store_name = "Store name is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.niche) newErrors.niche = "Business niche is required";
    if (!formData.location) newErrors.location = "Location is required";

    // 2. Full name must contain a space
    if (formData.full_name && !formData.full_name.trim().includes(" ")) {
      newErrors.full_name = "Please enter both first and last name";
    }

    // 3. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // 4. Password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol";
    }

    // Stop if any validation errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Submit to server
    await register(
      formData.email,
      formData.store_name,
      formData.password,
      formData.location,
      formData.niche,
      formData.full_name
    );

    setIsLoading(false);
  };

  return (
    <div className="py-12 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Create your account
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Join Sell Explore with your
          </p>
        </div>

        <div className="space-y-4">
          {/* Full name */}
          <FloatingLabelInput
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full name"
            error={errors.full_name}
          />

          {/* Email */}
          <FloatingLabelInput
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            error={errors.email}
          />

          {/* Store Name */}
          <FloatingLabelInput
            type="text"
            name="store_name"
            value={formData.store_name}
            onChange={handleChange}
            placeholder="Store name"
            error={errors.store_name}
          />

          {/* Business Niche */}
          <FloatingLabelSelect
            name="niche"
            value={formData.niche}
            onChange={(value) =>
              handleChange({ target: { name: "niche", value } } as any)
            }
            placeholder="Select a business niche"
            options={categories.map((category) => ({
              value: category.split(";")[0],
              label: category.split(";")[0],
            }))}
            error={errors.niche}
          />
          {/* Location */}
          <FloatingLabelSelect
            name="location"
            value={formData.location}
            onChange={(value) =>
              handleChange({ target: { name: "location", value } } as any)
            }
            placeholder="Select a location"
            options={statesInNigeria.map((state) => ({
              value: state,
              label: state,
            }))}
            error={errors.location}
          />

          {/* Password */}
          <div className="relative">
            <FloatingLabelInput
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              error={errors.password}
              margin="mt-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 top-1 right-0 pr-3 flex items-center z-10"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3 px-4 rounded-full text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] bg-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition duration-200"
        >
          {isLoading ? (
            <div className="">signing up...</div>
          ) : (
            <div className="flex items-center justify-center">
              Sign up
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition duration-200" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

// Wrapper for suspense
const SignupForm: React.FC = () => (
  <Suspense fallback={<div>Loading signup form...</div>}>
    <SignupFormInner />
  </Suspense>
);

export default SignupForm;
