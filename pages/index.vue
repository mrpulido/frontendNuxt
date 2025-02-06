<template>
  <div class="flex flex-col justify-center items-center min-h-screen ">
    <NuxtImg src="/images/logo.png" class="h-32 sm:h-36 mb-6 rounded-lg" alt="Logo" />
    <h1 class="text-4xl font-bold mb-4">¡Bienvenido! </h1>

  </div>
</template>

<script setup>

useSeoMeta({
  title: 'Página de inicio',
  ogTitle: 'Página de inicio ',
  description: 'Inicio de la aplicación.',
  ogDescription: 'Inicio de la aplicación.',
  ogImage: '/images/logo.png',
  keywords: 'home, inicio, gestión'
});

</script>
