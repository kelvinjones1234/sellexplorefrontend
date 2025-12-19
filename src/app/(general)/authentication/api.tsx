import { api } from "@/constant/baseUrl";
import { AxiosError } from "axios";

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetPayload {
  password: string;
  password_confirm: string;
} 

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Request password reset (send email)
export const requestPasswordReset = async (
  payload: PasswordResetRequestPayload
): Promise<ApiResponse<{ message: string }>> => {
  try {
    // The api instance handles the Base URL automatically
    const response = await api.post("password-reset/", payload);
    return { data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    const errorMessage = 
      axiosError.response?.data?.error || 
      axiosError.response?.data?.detail || 
      "Failed to request password reset";
      
    return { error: errorMessage };
  }
};

// Confirm password reset (set new password)
export const confirmPasswordReset = async (
  uidb64: string,
  token: string,
  payload: PasswordResetPayload
): Promise<ApiResponse<{ message: string }>> => {
  try {
    const response = await api.post(
      `reset-password/${uidb64}/${token}/`,
      payload
    );
    return { data: response.data };
  } catch (error) {
    const axiosError = error as AxiosError<any>;
    const errorMessage = 
      axiosError.response?.data?.error || 
      axiosError.response?.data?.detail || 
      "Failed to reset password";

    return { error: errorMessage };
  }
};