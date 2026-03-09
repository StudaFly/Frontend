/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#33518A",
          DEFAULT: "#213458",
          dark: "#213458", // as requested
        },
        secondary: {
          DEFAULT: "#FFCB5C",
        },
        background: {
          light: "#F9FAFB",
          DEFAULT: "#F9FAFB",
        },
        success: "#22C55E",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [],
};
