"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ useParams replaces useSearchParams
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import FloatingLabelInput from "@/app/component/fields/Input";
import { confirmPasswordReset } from "@/app/(general)/authentication/api";
import Link from "next/link";

interface FormData {
  password: string;
  confirmPassword: string;
}

interface Errors {
  [key: string]: string;
}

const Main: React.FC = () => {
  const router = useRouter();
  const { uidb64, token } = useParams(); // ✅ extract from path

  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showAlert, setShowAlert] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

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
    setIsLoading(true);
    setShowAlert(null);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const payload = {
      password: formData.password,
      password_confirm: formData.confirmPassword,
    };

    // ✅ Pass uidb64 and token from URL
    const { data, error } = await confirmPasswordReset(
      uidb64 as string,
      token as string,
      payload
    );

    if (error) {
      setShowAlert(error);
    } else if (data) {
      setShowAlert(data.message || "Password reset successful!");
      setFormData({ password: "", confirmPassword: "" });
      router.push("/authentication/siginin");
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
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Enter and confirm your new password
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

          <div className="relative">
            <FloatingLabelInput
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password"
              error={errors.password}
              margin="mt-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 top-1 right-0 pr-3 flex items-center text-[var(--color-text-secondary)] z-10"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <FloatingLabelInput
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              error={errors.confirmPassword}
              margin="mt-2"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 top-1 right-0 pr-3 flex items-center text-[var(--color-text-secondary)] z-10"
            >
              {showConfirmPassword ? (
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
          className="group relative w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-semibold hover:bg-[var(--color-brand-hover)] bg-[var(--color-brand-primary)] text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200"
        >
          {isLoading ? (
            "Resetting..."
          ) : (
            <div className="flex items-center justify-center">
              Reset Password
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
