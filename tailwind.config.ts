import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        brand: {
          DEFAULT: "#233D4D",
          light: "#31536A",
          dark: "#182A35"
        },
        accent: {
          DEFAULT: "#FE7F2D",
          light: "#FF9B57",
          dark: "#E06A1B"
        },
        surface: {
          DEFAULT: "#EAECF0",
          soft: "#F5F6F8"
        }
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fade-in 0.18s ease-out",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
