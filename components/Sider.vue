<template>
  <nav class="bg-[#f7f7f8] h-screen top-0 left-0 min-w-[250px] py-6 px-4 font-[sans-serif] flex-shrink-0">
    <div class="relative flex justify-center">
      <NuxtLink to="/">
        <NuxtImg src="/images/logo.png" class="h-24 sm:h-28" alt="Logo" />
      </NuxtLink>


    </div>

    <div class="overflow-auto py-6 mt-4">
      <ul class="space-y-1">
        <li>
          <NuxtLink to="/"
            class="text-black hover:text-blue-600 text-[15px] flex items-center hover:bg-white rounded px-4 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-7 h-7 mr-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v11a1 1 0 001 1h3m-10-11v11m-4-4h8" />
            </svg>
            <span>Home</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/facultad"
            class="text-black hover:text-blue-600 text-[15px] flex items-center hover:bg-white rounded px-4 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-7 h-7 mr-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
            <span>Facultad</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/profesor"
            class="text-black hover:text-blue-600 text-[15px] flex items-center hover:bg-white rounded px-4 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-7 h-7 mr-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span>Profesor</span>
          </NuxtLink>
        </li>
        <li v-if="isAdmin">
          <NuxtLink to="/usuarios"
            class="text-black hover:text-blue-600 text-[15px] flex items-center hover:bg-white rounded px-4 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-7 h-7 mr-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
            <span>Usuario</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/encuesta"
            class="text-black hover:text-blue-600 text-[15px] flex items-center hover:bg-white rounded px-4 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-7 h-7 mr-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            <span>Encuesta</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/criterios"
            class="text-black hover:text-blue-600 text-[15px] flex items-center hover:bg-white rounded px-4 py-3 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-7 h-7 mr-4">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <span>Criterio</span>
          </NuxtLink>
        </li>
        <li>
          <div
            class="text-black hover:text-blue-600 text-[15px] flex items-center hover:bg-white rounded px-4 py-3 transition-all">
            <button class="flex" @click="logout" :disabled="loading">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-7 h-7 mr-4">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span>{{ loading ? 'Procesando...' : 'Salir' }}</span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup>
import { useToast } from 'vue-toastification';
import { ref, computed } from 'vue';

const { status, signOut, data } = useAuth()

const isAdmin = computed(() => {
  return data.value.rol === 'administrador'
})

console.log(data.value.rol)
const toast = useToast();
const showSider = ref(true);
const loading = ref(false);

const handleNavigation = () => {
  if (window.innerWidth < 1024) {
    showSider.value = false;
  }
};

const logout = async () => {
  loading.value = true;
  try {
    await signOut({ callbackUrl: '/login', redirect: true });
    toast.success("Sesión cerrada exitosamente");
  } catch (error) {
    toast.error("Error al cerrar sesión");
  } finally {
    loading.value = false;
  }
};


</script>

<style scoped>
@media (max-width: 1024px) {
  nav {
    min-width: 96px;
    width: 50%;
    position: absolute;
    left: 0;
    height: 100vh;
  }
}

@media (min-width: 1024px) {
  nav {
    position: static;
  }
}
</style>