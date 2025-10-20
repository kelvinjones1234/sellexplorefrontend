import React from "react";
import { X, Bookmark } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/constant/nav";

interface MobileNavbarProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ isOpen, toggleMenu }) => (
  <div
    className={`fixed inset-0 transition-all duration-300 ${
      isOpen ? "visible opacity-100" : "invisible opacity-0"
    }`}
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 dark:bg-black/70"
      onClick={toggleMenu}
    />

    {/* Mobile Menu */}
    <div
      className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[var(--color-bg-primary)] shadow-2xl transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between pt-[1.6rem] pb-3 px-5 border-b border-[var(--color-border-default)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)]">
            Menu
          </h2>
          <button
            onClick={toggleMenu}
            className="p-1 rounded-full hover:bg-[var(--color-bg-secondary)] border border-[var(--color-border-strong)] transition"
          >
            <X size={20} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-5 py-8">
          <ul className="space-y-6">
            {navItems.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`block font-medium text-sm text-[var(--color-text-secondary)] cursor-not-allowed
                  `}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  </div>
);

export default MobileNavbar;
