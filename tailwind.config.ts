import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        water: {
          50: "#f0f8fa",
          100: "#dcedf1",
          200: "#b9dbe3",
          300: "#8cc2d1",
          400: "#5ba3ba",
          500: "#3d859f",
          600: "#316b82",
          700: "#2a566a",
          800: "#264858",
          900: "#233d4a",
        },
        leaf: {
          50: "#f2f9ed",
          100: "#e2f2d6",
          200: "#c6e5b0",
          300: "#a2d181",
          400: "#7fb85a",
          500: "#619d3d",
          600: "#4a7c2f",
          700: "#3c6127",
          800: "#334e23",
          900: "#2b4120",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "'Hiragino Sans'", "'Noto Sans JP'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
