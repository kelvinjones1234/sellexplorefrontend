"use client";
import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      type="button"
      className="group flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      onClick={logout}
    >
      <LogOut className="h-5 w-5 mr-3" />
      Sign Out 
    </button>
  );
};

export default LogoutButton;
