// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  build: {
    transpile: ["vue-toastification"],
  },
  css: ["~/assets/css/tailwind.css", "vue-toastification/dist/index.css"], // Importa el archivo de Tailwind
  modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@nuxt/icon"],
  runtimeConfig: {
    public: {
      backend_url: process.env.BACKEND_URL,
    },
  },
});