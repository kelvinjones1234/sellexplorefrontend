/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // enables dark mode via a .dark class
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { 
    extend: {
      screens: {
        xx: "343px",       // Extra-extra small
        iphone7: "375px",  // iPhone 7 specific
        xs: "375px",       // Extra small
        sm: "480px",       // Small
        md: "768px",       // Medium
        lg: "1024px",      // Large
        xl: "1280px",      // Extra large
        "2xl": "1440px",   // 2X large
        "3xl": "1920px",   // 3X large
      },
      fontFamily: { 
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
