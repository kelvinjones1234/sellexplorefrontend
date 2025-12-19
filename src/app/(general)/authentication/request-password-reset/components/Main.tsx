"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import FloatingLabelInput from "@/app/component/fields/Input";
import { requestPasswordReset } from "../../api";
interface FormData {
  email: string;
}

interface Errors {
  [key: string]: string;
}

const Main: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showAlert, setShowAlert] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    setShowAlert(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await requestPasswordReset({
      email: formData.email.trim().toLowerCase(),
    });

    if (error) {
      setShowAlert(error);
    } else if (data) {
      setShowAlert(data.message || "Password reset link sent successfully.");
      setFormData({ email: "" });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="py-12 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mt-[4rem] space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-2">
            Request Password Reset
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-[400px] mx-auto">
            Enter your verified email to receive a password reset link.
          </p>
        </div>

        <div className="space-y-4">
          {showAlert && (
            <div
              className={`p-3 border text-[clamp(.8rem,2vw,1rem)] rounded-lg flex items-center gap-2 ${
                showAlert.includes("error")
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-green-50 border-green-200 text-green-700"
              }`}
            >
              <AlertCircle className="h-5 w-5" />
              <span>{showAlert}</span>
            </div>
          )}

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

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-semibold hover:bg-[var(--color-brand-hover)] bg-[var(--color-brand-primary)] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isLoading ? "Sending..." : (
            <div className="flex items-center justify-center">
              Get Reset Link
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </button>

        <div className="text-center mt-4">
          <Link
            href="/authentication/login"
            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-brand-hover)]"
          >
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Main;
