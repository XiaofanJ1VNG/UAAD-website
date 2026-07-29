import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121212",
        accent: "#CBFD50",
      },
      fontFamily: {
        display: ['"Wix Madefor Display"', "sans-serif"],
        offbit: ["var(--font-offbit)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
