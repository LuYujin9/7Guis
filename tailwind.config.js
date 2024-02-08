/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#D7DBDD",
        dark: "#616A6B ",
        emphasis: "#3498DB ",
        invalid: "#E74C3C",
      },
    },
  },
  plugins: [],
};
