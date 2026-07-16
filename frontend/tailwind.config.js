// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,jsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ["Poppins", "sans-serif"],
//       },
//       colors: {
//         vdeploy: {
//           dark: "#0b1120",
//           panel: "#111a2e",
//           purple: "#7c5cff",
//           blue: "#4f8cff",
//         },
//       },
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        deployr: {
          bg: "#0a0a0a",
          card: "#141414",
          border: "#252525",
        },
      },
    },
  },
  plugins: [],
};