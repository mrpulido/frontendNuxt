<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="relative flex w-96 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
            <div
                class="relative mx-4 -mt-6 mb-4 grid h-28 place-items-center overflow-hidden rounded-xl bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 bg-clip-border text-white shadow-lg shadow-purple-500/40">
                <h3 class="block font-sans text-3xl font-semibold leading-snug tracking-normal text-white antialiased">
                    Iniciar Sesión
                </h3>
            </div>
            <div class="flex flex-col gap-4 p-6">
                <div class="relative h-11 w-full min-w-[200px]">
                    <input v-model="nombre_usuario" id="nombre_usuario" placeholder=""
                        class="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-cyan-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                    <label for="nombre_usuario"
                        class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-cyan-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-cyan-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-cyan-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Nombre de usuario
                    </label>
                </div>
                <div class="relative h-11 w-full min-w-[200px]">
                    <input v-model="contrasena" id="contrasena" type="password" placeholder=""
                        class="peer h-full w-full rounded-md border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-cyan-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50" />
                    <label for="contrasena"
                        class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-cyan-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-cyan-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-cyan-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Contraseña
                    </label>
                </div>

            </div>
            <div class="p-6 pt-0">
                <button @click="handleLogin" :disabled="isLoading" data-ripple-light="true" type="button"
                    class="block w-full select-none rounded-lg bg-gradient-to-tr from-purple-400 via-pink-500 to-red-500 bg-clip-border text-white shadow-lg shadow-purple-500/40 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase transition-all hover:shadow-lg hover:shadow-purple-800/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
                    {{ isLoading ? 'Procesando...' : 'Iniciar Sesión' }}
                </button>

            </div>
        </div>
    </div>

</template>

<script setup>
definePageMeta({
    layout: 'login',
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: "/",
    }
})
import { useToast } from 'vue-toastification';

useSeoMeta({
    title: 'Página de login',
    ogTitle: 'Página de login ',
    description: 'Login de la aplicación.',
    ogDescription: 'Login de la aplicación.',
    ogImage: '/images/logo.png',
    keywords: 'login, gestión',
    alternateLinks: {
        canonical: `${useRuntimeConfig().public.frontend_url}/login`
    }
});

const toast = useToast()
const nombre_usuario = ref('');
const contrasena = ref('');
const router = useRouter();
const { signIn, status } = useAuth()
const isLoading = ref(false);

const handleLogin = async () => {
    isLoading.value = true;
    try {
        await signIn({
            nombre_usuario: nombre_usuario.value,
            contrasena: contrasena.value
        }, { callbackUrl: '/conf2fa', redirect: true })

        toast.success('Inicio de sesión exitoso')
    } catch (error) {
        console.error('Error detallado:', error)
        const errorMessage = error.data?.message || 'Error al iniciar sesión'
        toast.error(errorMessage)
    } finally {
        isLoading.value = false;
    }
};




</script>

<style lang="scss" scoped></style>
