<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {{ show ? 'Mostrar Encuesta' : 'Editar Encuesta' }}
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre" class="sr-only">{{ show ? 'Mostrando Nombre' : 'Nombre' }}</label>
                        <input id="nombre" name="nombre" type="text" required v-model="form.nombre" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre de la encuesta">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Profesores</label>
                        <div class="mt-2 space-y-2">
                            <div v-for="profesor in profesores" :key="profesor.id" class="flex items-center">
                                <input type="checkbox" :id="'profesor-' + profesor.id" :value="profesor.id"
                                    v-model="form.profesores" :disabled="show"
                                    class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                                <label :for="'profesor-' + profesor.id" class="ml-2 block text-sm text-gray-900">
                                    {{ profesor.nombre }}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between space-x-6">
                    <button v-if="!show" type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Editar
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
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter, useRoute } from 'vue-router'



const { token } = useAuth();
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const form = ref({
    id: '',
    nombre: ''
});

const show = ref(route.query.show === 'true');
const profesor = ref('');
const profesores = ref([]);

//configuracion de seo
const seoTitle = computed(() => (show.value ? 'Mostrar Encuesta' : 'Editar Encuesta'));
const seoDescription = computed(() => (show.value ? 'Página para mostrar una encuesta específica en el sistema.' : 'Página para editar una encuesta específica en el sistema.'));
const seoKeywords = computed(() => (show.value ? 'encuesta, mostrar, sistema' : 'encuesta, editar, sistema'));

useSeoMeta({
    title: seoTitle,
    ogTitle: seoTitle,
    description: seoDescription,
    ogDescription: seoDescription,
    ogImage: '/images/logo.png',
    keywords: seoKeywords
});

// Función para cargar los datos de la encuesta
const cargarEncuesta = async () => {
    try {
        const { id } = route.params;
        const response = await $fetch(`${config.public.backend_url}/encuesta/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': token.value

            },
        });

        form.value = response;
        form.value.profesores = response.profesors.map(p => p.id);
        profesor.value = response.profesors && response.profesors.length > 0
            ? response.profesors.map(p => p.nombre).join(', ')
            : 'No hay profesores asignados';
    } catch (error) {
        toast.error(`Error al cargar la encuesta: ${error.message}`);
    }
};

onMounted(() => {
    cargarEncuesta();
});

// Cargar la lista de profesores al montar el componente
onMounted(async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/profesor`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': token.value
            }
        });
        profesores.value = response;
    } catch (error) {
        toast.error(`Error al cargar profesores: ${error.message}`);
    }
});

const handleSubmit = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/encuesta/update/${form.value.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': token.value
            },
            body: {
                nombre: form.value.nombre,
                profesores: form.value.profesores
            },
        });

        toast.success("Encuesta editada exitosamente.");
        router.push('/encuesta');
    } catch (error) {
        toast.error(`Error al editar la encuesta: ${error.message}`);
    }
};

const cancelar = () => {
    router.push('/encuesta');
};
</script>