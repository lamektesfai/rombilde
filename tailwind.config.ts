import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F6F4EF",
        "paper-2": "#EFEBE1",
        ink: "#1F2420",
        "ink-soft": "#4B5148",
        pine: "#2E4034",
        "pine-light": "#3F5A4B",
        sand: "#C9A876",
        "sand-light": "#E8DCC3",
        sky: "#A9C2C9",
        dusty: "#7C93A3",
        line: "#D8D2C4",
      },
      fontFamily: {
        heading: ["var(--font-bricolage)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
