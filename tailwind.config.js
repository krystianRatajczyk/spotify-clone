/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        hide: "hide 0.4s ease-in-out",
        slide_bottom: "slide_bottom .3s ease-out",
      },
      keyframes: {
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        slide_bottom: {
          from: { opacity: 0, transform: "translateY(40%)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      },
      height: {
        calc: "calc(100% - 80px)"
      },
      colors: {
        black: "#191624",
        primary: "#1ed860",
        darkPrimary: "#17b34e",
        blue: "#3495eb",
        darkBlue: "#08082c",
        darkGray: "#121212",
        lightGray: "#B3B3B3",
        mediumGray: "#333333",
        opacityGray: "rgba(0, 0, 0, 0.64)",
      },
    },
  },
  plugins: [],
};
