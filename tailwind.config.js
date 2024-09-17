/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'max-1010': {'max': '1010px'},
        'max-629': {'max': '629px'},
        'max-470': {'max': '470px'},
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  darkMode: 'class',
}
