import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fuku: {
          black: "#111111",
          red: "#e52421",
          bg: "#f7f4ef",
          border: "#e5e0d8",
          gray: "#666666",
          light: "#f2eee8",
          white: "#ffffff",
        },
      },
      boxShadow: {
        phone: "0 28px 80px rgba(17, 17, 17, 0.16)",
        soft: "0 14px 34px rgba(17, 17, 17, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
