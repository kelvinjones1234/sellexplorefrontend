"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import Alert from "../../../components/alert/Alert";
import Link from "next/link";
import FloatingLabelInput from "@/app/component/fields/Input";

interface FormData {
  email: string;
  password: string;
}

interface Errors {
  [key: string]: string;
}

const SigninForm: React.FC = () => {
  const { login, error } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    if (error) {
      setErrors((prev) => ({
        ...prev,
        submit: error.global || "Login failed",
      }));
    } else {
      setErrors((prev) => ({ ...prev, submit: "" }));
    }
  }, [error]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    // hide alert before validating
    setShowAlert(false);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const success = await login(
      formData.email.trim().toLowerCase(),
      formData.password
    );

    if (success) {
      setShowAlert(true);
      setFormData({ email: "", password: "" });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 80000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="py-12 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mt-4 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <Link href={`/authentication/signup`}>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to your account
            </p>
          </Link>
        </div>

        <div className="space-y-4">
          {errors.submit && (
            <div className="p-3 bg-red-50 border text-[clamp(.8rem,2vw,1rem)] border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <FloatingLabelInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              error={errors.email}
              margin="mt-2"
            />
          </div>

          {/* Password Field */}
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <Link
            href={`/authentication/request-password-reset`}
            className="text-sm hover:text-[var(--color-primary-hover)] text-[var(--color-primary)] transition-colors duration-200"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-semibold hover:bg-[var(--color-primary-hover)] bg-[var(--color-primary)] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isLoading ? (
            <div className="">signing in...</div>
          ) : (
            <div className="flex items-center justify-center">
              Sign in
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </button>
      </form>

      {showAlert && <Alert message="Login successful!" type="success" />}
    </div>
  );
};

export default SigninForm;
