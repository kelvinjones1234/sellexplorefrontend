import React from "react";
import { X, Bookmark } from "lucide-react";
import Link from "next/link";
import { navItems } from "@/constant/nav";

interface MobileNavProps {
  isOpen: boolean;
  toggleMenu: () => void;
  totalItems: number;
}

const MobileNavbar: React.FC<MobileNavProps> = ({
  isOpen,
  toggleMenu,
  totalItems,
}) => (
  <div
    className={`fixed z-[999] inset-0 transition-all duration-300 ${
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
      className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-[var(--color-bg)] shadow-2xl transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between pt-[1.6rem] pb-3 px-5 border-b border-[var(--color-border)] dark:border-gray-700/50">
          <h2 className="text-lg font-semibold dark:text-white">Menu</h2>
          <button
            onClick={toggleMenu}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-5 py-8">
          <ul className="space-y-6">
            {navItems.map(({ label, href, disabled }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-disabled={disabled ? "true" : "false"}
                  className={`block font-medium text-lg ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Actions */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700/50">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--color-border)] rounded-lg shadow-sm">
            <Bookmark size={18} />
            Bookmarked ({totalItems})
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default MobileNavbar;
