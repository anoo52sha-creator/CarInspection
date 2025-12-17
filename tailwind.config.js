/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0B132B",
        accent: "#3A86FF",
        highlight: "#4CC9F0",
        background: "#F8FAFC",
        textmain: "#1E293B",
      },
    },
  },
  plugins: [],
};
