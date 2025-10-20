"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Sun, Moon, Bookmark } from "lucide-react";

interface ThemeToggleButtonProps {
  theme: string;
  toggleTheme: () => void;
}

export const Logo: React.FC = () => (
  <Image src="/site-logo.ico" alt="sellexplore" width={30} height={30} />
);

export const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-2 w-[38px] h-[38px]" />;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:text-[var(--color-brand-primary)] transition-colors"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
    </button>
  );
};

interface BookmarkButtonProps {
  totalItems: number;
  toggleBookmark: () => void;
}


