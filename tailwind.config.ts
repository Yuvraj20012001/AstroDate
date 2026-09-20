import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#a855f7",
        accent2: "#ec4899",
        accentSoft: "#f3e6ff",
        highlight: "#ffe4f1",
        bgTop: "#f6e9ff",
        bgBottom: "#ffe4f1",
        card: "#ffffff",
        cardLine: "#f0dcf5",
        ink: "#2b1235",
        inkSoft: "#7a6485",
        good: "#16a34a",
        mid: "#d97706",
        bad: "#dc2626",
      },
      fontFamily: {
        display: ['"Fredoka"', "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
