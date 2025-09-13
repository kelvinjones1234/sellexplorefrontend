import React from "react";
import { Menu } from "lucide-react";
import { Logo, ThemeToggleButton, BookmarkButton } from "./SharedComponents";
import Link from "next/link";
import { navItems } from "@/constant/nav";

interface DesktopNavbarProps {
  theme: string;
  toggleTheme: () => void;
  totalItems: number;
  toggleBookmark: () => void;
  toggleMobileMenu: () => void;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  theme, 
  toggleTheme,
  totalItems,
  toggleBookmark,
  toggleMobileMenu,
}) => (
  <div className="flex items-center justify-between w-full">
    <Logo />

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center space-x-8">
      {navItems.map(({ label, href, disabled }) => (
        <Link
          key={href}
          href={href}
          className={`hover:text-[var(--color-primary)] font-medium`}
        >
          {label}
        </Link>
      ))}
    </nav>

    {/* Actions */}
    <div className="flex items-center space-x-4">
      <div className="md:flex items-center space-x-4">
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        <BookmarkButton
          totalItems={totalItems}
          toggleBookmark={toggleBookmark}
        />
      </div>
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 hover:text-[var(--color-primary)] rounded-lg"
      >
        <Menu size={22} />
      </button>
    </div>
  </div>
);

export default DesktopNavbar;
