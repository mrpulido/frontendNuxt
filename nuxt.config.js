// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  build: {
    transpile: ["vue-toastification"],
  },
  css: ["~/assets/css/tailwind.css", "vue-toastification/dist/index.css"], // Importa el archivo de Tailwind
  modules: ["@sidebase/nuxt-auth", "@nuxtjs/tailwindcss", "@nuxt/image", "@nuxt/icon"],
  runtimeConfig: {
    public: {
      backend_url: process.env.BACKEND_URL,
    },
  },
  auth: {
    baseURL: process.env.BACKEND_URL,
    provider: {
      type: "local",
      endpoints: {
        signIn: {
          path: "/auth/login",
          method: "post",
        },
        signUp: false,
        signOut: {
          path: "/auth/logout",
          method: "post",
        },
        getSession: {
          path: "/session",
          method: "get",
        },
      },
      pages: {
        login: "/login",
      },
      session: {
        dataType: {
          id: "number",
          username: "string",
          rol: "'administrador' | 'gestor'",
          twoFactorEnabled: "boolean",
        },
        dataResponsePointer: "/",
      },
      token: {
        signInResponseTokenPointer: "/accessToken",
        maxAgeInSeconds: 3600,
        type: "Bearer",
        headerName: "Authorization",
      },
      refresh: {
        isEnabled: true,
        endpoint: {
          path: "/auth/refreshToken",
          method: "post",
        },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: "/refreshToken",
          refreshRequestTokenPointer: "/refreshToken",
          maxAgeInSeconds: 86400,
          cookieName: "refresh_token",
        },
      },
    },
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true,
    },
  },
});