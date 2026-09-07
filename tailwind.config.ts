import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#10231f",
        forest: "#1d5746",
        mint: "#dff5e9",
        cream: "#f8f8f3",
        signal: "#f4bd4f",
      },
      boxShadow: {
        soft: "0 24px 70px rgba(23, 70, 57, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
