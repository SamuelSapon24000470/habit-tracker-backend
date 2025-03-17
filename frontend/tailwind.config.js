/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx}', // Asegúrate de que Tailwind vea los archivos de las páginas
      './components/**/*.{js,ts,jsx,tsx}', // Y los de los componentes
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  