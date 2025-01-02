/**@type {import('tailwind.css').Config} */
module.export = {
  content: [
    "./app/**/*.vue", //para escanear componentes de Veu en la carpeta app
    "./pages/**/*.{vue,js}", //para escanear paginas
    "./layouts/**/*.vue", //para escanear layouts
    "./components/**/*.{vue,js}", //para escanear componentes
  ],
  theme: {
    extend: {
      colors: {
        customPurple: "#8B63F3", // Define el color personalizado
      },
    },
  },
  plugins: [],
};
