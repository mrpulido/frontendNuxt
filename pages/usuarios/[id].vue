<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {{ show ? 'Mostrar Usuario' : 'Editar Usuario' }}
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre_usuario" class="sr-only">
                            {{ show ? 'Mostrando Nombre de Usuario' : 'Nombre de Usuario' }}
                        </label>
                        <input id="nombre_usuario" name="nombre_usuario" type="text" required
                            v-model="form.nombre_usuario" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre de Usuario">
                    </div>
                    <div>
                        <label for="rol" class="sr-only">
                            {{ show ? 'Mostrando Rol' : 'Rol' }}
                        </label>
                        <select id="rol" name="rol" v-model="form.rol" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                            <option value="administrador">administrador</option>
                            <option value="gestor">gestor</option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-between space-x-6">
                    <button v-if="!show" type="submit" :disabled="isProcessing"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {{ isProcessing ? 'Procesando...' : 'Editar' }}
                    </button>
                    <button type="button"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                        @click="cancelar">
                        {{ show ? 'Aceptar' : 'Cancelar' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter, useRoute } from 'vue-router'

const { token } = useAuth()
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const form = ref({
    id: '',
    nombre_usuario: '',
    contrasena: '',
    rol: ''
});

const show = ref(route.query.show === 'true');
//configuracion de seo
const seoTitle = computed(() => (show.value ? 'Mostrar Usuario' : 'Editar Usuario'));
const seoDescription = computed(() => (show.value ? 'Página para mostrar un usuario específico en el sistema.' : 'Página para mostrar un usuario específico en el sistema.'));
const seoKeywords = computed(() => (show.value ? 'usuario, mostrar, sistema' : 'usuario, editar, sistema'));

useSeoMeta({
    title: seoTitle,
    ogTitle: seoTitle,
    description: seoDescription,
    ogDescription: seoDescription,
    ogImage: '/images/logo.png',
    keywords: seoKeywords
});

const isProcessing = ref(false);

// Función para cargar los datos de la facultad
const cargarUsuario = async () => {
    try {
        const { id } = route.params;
        const response = await $fetch(`${config.public.backend_url}/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': token.value
            }
        });
        form.value = response;
    } catch (error) {
        toast.error(`Error al cargar el usuario: ${error.message}`);
    }
};

onMounted(() => {
    cargarUsuario();
});

const handleSubmit = async () => {
    isProcessing.value = true;
    try {
        const response = await $fetch(`${config.public.backend_url}/usuarios/update/${form.value.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': token.value
            },
            body: {
                nombre_usuario: form.value.nombre_usuario,
                contrasena: form.value.contrasena,
                rol: form.value.rol,
            },
        });

        toast.success("Usuario editado exitosamente.");
        router.push('/usuarios');
    } catch (error) {
        toast.error(`Error al agregar el usuario: ${error.response._data.message}`);
    } finally {
        isProcessing.value = false;
    }
};

const cancelar = () => {
    router.push('/usuarios');
};
</script>