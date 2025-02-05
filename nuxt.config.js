// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  build: {
    transpile: ["vue-toastification"],
  },
  css: ["~/assets/css/tailwind.css", "vue-toastification/dist/index.css"], // Importa el archivo de Tailwind
  modules: [
    "@sidebase/nuxt-auth",
    "@nuxtjs/tailwindcss",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxtjs/seo",
    // "@zadigetvoltaire/nuxt-gtm",
  ],
  runtimeConfig: {
    public: {
      backend_url: process.env.BACKEND_URL,
      frontend_url: process.env.FRONTEND_URL,
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
  site: {
    url: process.env.FRONTEND_URL,
    name: "GestorEncuesta",
    description:
      "La mejor herramienta para gestionar encuestas de manera eficiente y efectiva.",
    defaultLocale: "es",
  },
  schemaOrg: {
    identity: {
      type: "Organization",
      name: "GestorEncuesta",
    },
  },
  robots: {
    enabled: true,
    robotsEnabledValue:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  },
  sitemap: {
    enabled: true,
    autoLastmod: true,
    xsl: false,
  },
  app: {
    head: {
      meta: [
        { name: "robots", content: "index, follow" },
        { name: "googlebot", content: "index, follow" },
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/images/logo.png" }],
    },
  },
});
