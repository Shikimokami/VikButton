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
      colors: {
        'pushable-bg': 'hsl(340deg 100% 32%)',
        'front-bg': 'hsl(345deg 100% 47%)',
      },
      borderRadius: {
        '60px': '60px',
      },
      spacing: {
        '42': '42px',
      },
      translate: {
        '19': '-19px',
        '8': '-8px',
      },
      transitionProperty: {
        'transform': 'transform',
      },
      transitionDuration: {
        '300': '300ms',  // Duración de la transición, ajusta según sea necesario
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  darkMode: 'class',
}
