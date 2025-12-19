// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   User,
//   CreditCard,
//   Package,
//   LayoutDashboard,
//   Settings,
//   Zap,
//   ShoppingCart,
//   Users,
//   ChevronDown,
// } from "lucide-react";
// import LogoutButton from "./LogoutButton";

// // NOTE: You only need to define the navLinks array once,
// // so I'm keeping it outside the component for clarity.
// const navLinks = [
//   {
//     href: "/dashboard/get-started",
//     label: "Get Started",
//     icon: Zap,
//   },
//   {
//     href: "/dashboard",
//     label: "Dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     href: "/dashboard/products",
//     label: "Products",
//     icon: Package,
//   },
//   {
//     href: "/dashboard/order",
//     label: "Orders",
//     icon: Package,
//     children: [
//       {
//         href: "/dashboard/order/cart",
//         label: "Cart",
//         icon: ShoppingCart,
//       },
//       {
//         href: "/dashboard/order/customers",
//         label: "Customers",
//         icon: Users,
//       },
//     ],
//   },
//   {
//     href: "/dashboard/payment",
//     label: "Payment",
//     icon: CreditCard,
//   },
//   {
//     href: "/dashboard/profile-settings",
//     label: "Profile",
//     icon: User,
//   },
//   {
//     href: "/dashboard/subscription",
//     label: "Subscription",
//     icon: CreditCard,
//   },
//   {
//     href: "/dashboard/my-store",
//     label: "Store settings",
//     icon: Settings,
//   },
// ];

// const Sidebar = () => {
//   const pathname = usePathname();
//   // State to manage which parent menu is open
//   const [openParent, setOpenParent] = useState<string | null>(null);

//   // Helper function to define the appearance of a link/button
//   const getLinkClasses = (isActive: boolean) => {
//     // Shared classes for all items
//     const baseClasses =
//       "w-full group flex items-center px-3 mr-2 py-2.5 text-sm font-medium rounded-lg transition-colors";

//     // Active state classes
//     const activeClasses =
//       "bg-[var(--color-bg-secondary)] text-[var(--color-brand-primary)]";

//     // Inactive state classes
//     const inactiveClasses =
//       "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]";

//     return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
//   };

//   // Helper function to define the icon color
//   const getIconClasses = (isActive: boolean) => {
//     const baseIconClasses = "h-5 w-5 mr-3 transition-colors";

//     const activeIconClasses = "text-[var(--color-brand-primary)]";

//     // Use primary text color on hover and muted text color normally
//     const inactiveIconClasses =
//       "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]";

//     return `${baseIconClasses} ${
//       isActive ? activeIconClasses : inactiveIconClasses
//     }`;
//   };

//   return (
//     // Set background to primary background (the page background)
//     <div className="h-screen w-full">
//       {/* Header (Store Name) */}
//       <div className="p-4">
//         <div className="flex items-center p-3 rounded-xl gap-4 bg-[var(--color-bg-secondary)]">
//           {/* Logo Placeholder - use brand primary for visual pop */}
//           <div className="h-10 w-10 bg-[var(--color-brand-primary)] rounded-full"></div>
//           {/* Use primary text color for the brand name */}
//           <h2 className="text-[var(--color-text-primary)] font-semibold">
//             Store Name
//           </h2>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="mt-6 px-4">
//         <div className="space-y-1">
//           {navLinks.map(({ href, label, icon: Icon, children }) => {
//             // Determine if the item or any of its children is the current path
//             const isActive =
//               pathname === href ||
//               children?.some((c) => pathname.startsWith(c.href));
//             const isOpen = openParent === href;

//             return (
//               <div key={href}>
//                 {children ? (
//                   <div>
//                     {/* Parent Link */}
//                     <Link
//                       href={href}
//                       className={getLinkClasses(isActive)}
//                       onClick={() => setOpenParent(isOpen ? null : href)}
//                     >
//                       <Icon className={getIconClasses(isActive)} />
//                       <span className="flex-1 text-left">{label}</span>
//                       {/* Chevron should not trigger navigation */}
//                       <ChevronDown
//                         onClick={(e) => {
//                           e.preventDefault(); // stop link navigation
//                           e.stopPropagation(); // stop parent click
//                           setOpenParent(isOpen ? null : href);
//                         }}
//                         className={`w-4 h-4 ml-auto transition-transform cursor-pointer ${
//                           isOpen ? "rotate-180" : ""
//                         } ${
//                           isActive
//                             ? "text-[var(--color-brand-primary)]"
//                             : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]"
//                         }`}
//                       />
//                     </Link>

//                     {/* Sub-menu */}
//                     {isOpen && (
//                       <div className="ml-8 mt-1 space-y-1 border-l border-[var(--color-border-default)]">
//                         {children.map(
//                           ({
//                             href: subHref,
//                             label: subLabel,
//                             icon: SubIcon,
//                           }) => {
//                             const isSubActive = pathname === subHref;
//                             return (
//                               <Link
//                                 key={subHref}
//                                 href={subHref}
//                                 className={getLinkClasses(isSubActive).replace(
//                                   "mr-2",
//                                   ""
//                                 )}
//                               >
//                                 <SubIcon
//                                   className={`h-4 w-4 mr-2 ${
//                                     isSubActive
//                                       ? "text-[var(--color-brand-primary)]"
//                                       : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]"
//                                   }`}
//                                 />
//                                 {subLabel}
//                               </Link>
//                             );
//                           }
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   // Normal nav item
//                   <Link href={href} className={getLinkClasses(isActive)}>
//                     <Icon className={getIconClasses(isActive)} />
//                     <span className="flex-1 text-left">{label}</span>
//                   </Link>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </nav>

//       {/* Logout Button (Fixed at the bottom) */}
//       <div className="mt-8 mr-3 fixed bottom-0 w-[300px] my-4 px-4">
//         <div className="w-full">
//           <LogoutButton />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;










"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  CreditCard,
  Package,
  LayoutDashboard,
  Settings,
  Zap,
  ShoppingCart,
  Users,
  ChevronDown,
} from "lucide-react";
import LogoutButton from "./LogoutButton";

const navLinks = [
  {
    href: "/dashboard/get-started",
    label: "Get Started",
    icon: Zap,
  },
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/dashboard/order",
    label: "Orders",
    icon: Package,
    children: [
      {
        href: "/dashboard/order/cart",
        label: "Cart",
        icon: ShoppingCart,
      },
      {
        href: "/dashboard/order/customers",
        label: "Customers",
        icon: Users,
      },
    ],
  },
  {
    href: "/dashboard/payment",
    label: "Payment",
    icon: CreditCard,
  },
  {
    href: "/dashboard/profile-settings",
    label: "Profile",
    icon: User,
  },
  {
    href: "/dashboard/subscription",
    label: "Subscription",
    icon: CreditCard,
  },
  {
    href: "/dashboard/my-store",
    label: "Store settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [openParent, setOpenParent] = useState<string | null>(null);

  const getLinkClasses = (isActive: boolean) => {
    const baseClasses =
      "w-full group flex items-center px-3 mr-2 py-2.5 text-sm font-medium rounded-lg transition-colors";
    const activeClasses =
      "bg-[var(--color-bg-secondary)] text-[var(--color-brand-primary)]";
    const inactiveClasses =
      "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  const getIconClasses = (isActive: boolean) => {
    const baseIconClasses = "h-5 w-5 mr-3 transition-colors";
    const activeIconClasses = "text-[var(--color-brand-primary)]";
    const inactiveIconClasses =
      "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]";
    return `${baseIconClasses} ${
      isActive ? activeIconClasses : inactiveIconClasses
    }`;
  };

  const toggleParent = (href: string) => {
    setOpenParent((prev) => (prev === href ? null : href));
  };

  return (
    <div className="h-screen w-full">
      {/* Header (Store Name) */}
      <div className="p-4">
        <div className="flex items-center p-3 rounded-xl gap-4 bg-[var(--color-bg-secondary)]">
          <div className="h-10 w-10 bg-[var(--color-brand-primary)] rounded-full"></div>
          <h2 className="text-[var(--color-text-primary)] font-semibold">
            Store Name
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <div className="space-y-1">
          {navLinks.map(({ href, label, icon: Icon, children }) => {
            const isActive =
              pathname === href ||
              children?.some((c) => pathname.startsWith(c.href));
            const isOpen = openParent === href;

            return (
              <div key={href}>
                {children ? (
                  <div>
                    {/* Parent Button (not a Link when it has children) */}
                    <button
                      type="button"
                      className={getLinkClasses(isActive)}
                      onClick={() => toggleParent(href)}
                    >
                      <Icon className={getIconClasses(isActive)} />
                      <span className="flex-1 text-left">{label}</span>
                      <ChevronDown
                        className={`w-4 h-4 ml-auto transition-transform ${
                          isOpen ? "rotate-180" : ""
                        } ${
                          isActive
                            ? "text-[var(--color-brand-primary)]"
                            : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]"
                        }`}
                      />
                    </button>

                    {/* Sub-menu */}
                    {isOpen && (
                      <div className="ml-8 mt-1 space-y-1 border-l border-[var(--color-border-default)]">
                        {children.map(
                          ({
                            href: subHref,
                            label: subLabel,
                            icon: SubIcon,
                          }) => {
                            const isSubActive = pathname === subHref;
                            return (
                              <Link
                                key={subHref}
                                href={subHref}
                                className={getLinkClasses(isSubActive).replace(
                                  "mr-2",
                                  ""
                                )}
                              >
                                <SubIcon
                                  className={`h-4 w-4 mr-2 ${
                                    isSubActive
                                      ? "text-[var(--color-brand-primary)]"
                                      : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]"
                                  }`}
                                />
                                {subLabel}
                              </Link>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // Normal nav item
                  <Link href={href} className={getLinkClasses(isActive)}>
                    <Icon className={getIconClasses(isActive)} />
                    <span className="flex-1 text-left">{label}</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Logout Button (Fixed at the bottom) */}
      <div className="mt-8 mr-3 fixed bottom-0 w-[300px] my-4 px-4">
        <div className="w-full">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;