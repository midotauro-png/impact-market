import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bahrain Marketplace — Navy + Orange professional palette
        navy: {
          50:  "#EEF1F8",
          100: "#CDD5E9",
          200: "#9BABD3",
          300: "#6981BC",
          400: "#3E5FA6",
          500: "#1B3A8C",
          600: "#1B2B4B", // primary dark
          700: "#152240",
          800: "#0E1930",
          900: "#070E1F",
        },
        orange: {
          50:  "#FFF4EC",
          100: "#FFE1C7",
          200: "#FFC390",
          300: "#FFA558",
          400: "#F47B20", // primary accent
          500: "#D96010",
          600: "#B34A0C",
          700: "#8C3709",
          800: "#662506",
          900: "#3F1403",
        },
        emerald: {
          50:  "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#059669", // success
          600: "#047857",
          700: "#065F46",
          800: "#064E3B",
          900: "#022C22",
        },
        amber: {
          50:  "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#D97706", // warning
          600: "#B45309",
          700: "#92400E",
        },
        slate: {
          50:  "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        ink: "#1B2B4B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgb(0 0 0 / 0.08), 0 1px 3px rgb(0 0 0 / 0.05)",
        card: "0 1px 3px rgb(0 0 0 / 0.07), 0 2px 12px -4px rgb(0 0 0 / 0.08)",
        glow: "0 8px 32px -8px rgb(244 123 32 / 0.45)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
