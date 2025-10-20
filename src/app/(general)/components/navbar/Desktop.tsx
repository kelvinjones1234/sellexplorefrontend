import React from "react";
import { Menu } from "lucide-react";
import { Logo, ThemeToggleButton } from "./SharedComponents";
import Link from "next/link";
import { navItems } from "@/constant/nav";

interface DesktopNavbarProps {
  theme: string;
  toggleTheme: () => void;

  toggleMobileMenu: () => void;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({
  theme,
  toggleTheme,

  toggleMobileMenu,
}) => (
  <div className="flex items-center justify-between w-full">
    {/* Logo */}
    <Logo />

    {/* Desktop Navigation */}
    <nav className="hidden md:flex items-center space-x-8">
      {navItems.map(({ label, href }) => (
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
      <div className="hidden md:flex items-center space-x-4">
        <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      </div>
      <button
        onClick={toggleMobileMenu}
        className="md:hidden p-2 hover:text-[var(--color-brand-primary)] text-[var(--color-text-secondary)]"
      >
        <Menu size={22} />
      </button>
    </div>
  </div>
);

export default DesktopNavbar;
