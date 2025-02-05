<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {{ show ? 'Mostrar Criterio' : 'Editar Criterio' }}
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="show ? cancelar() : handleSubmit()">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre" class="sr-only">Nombre</label>
                        <input id="nombre" name="nombre" type="text" required v-model="form.nombre" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre del Criterio" @input="soloLetras">
                    </div>
                    <div v-if="show">
                        <label for="encuesta" class="sr-only">Encuesta</label>
                        <input id="encuesta" name="encuesta" type="text" :value="form.encuestaNombre || 'No asignada'"
                            disabled
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Encuesta">
                    </div>
                    <div v-else>
                        <label for="encuesta" class="sr-only">Encuesta</label>
                        <select id="encuesta" name="encuesta" required v-model="form.encuesta"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                            <option value="" disabled>Seleccione una encuesta</option>
                            <option v-for="encuesta in encuestas" :key="encuesta.id" :value="encuesta.id">
                                {{ encuesta.nombre }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-between space-x-6">
                    <button type="submit" :disabled="isLoading"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        v-if="!show">
                        {{ isLoading ? 'Procesando...' : 'Editar' }}
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
import { useToast } from 'vue-toastification'

const { token } = useAuth()
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const encuestas = ref([]); // Lista de encuestas

const form = ref({
    id: '',
    nombre: '',
    encuesta: '',
    encuestaNombre: ''
});

const show = ref(route.query.show === 'true');

// Configuración dinámica de SEO
const seoTitle = computed(() => (show.value ? 'Mostrar Criterio' : 'Editar Criterio'));
const seoDescription = computed(() => (show.value ? 'Página para mostrar un criterio específico en el sistema.' : 'Página para editar un criterio específico en el sistema.'));
const seoKeywords = computed(() => (show.value ? 'criterio, mostrar, sistema' : 'criterio, editar, sistema'));

useSeoMeta({
    title: seoTitle,
    ogTitle: seoTitle,
    description: seoDescription,
    ogDescription: seoDescription,
    ogImage: '/images/logo.png',
    keywords: seoKeywords
});

const isLoading = ref(false);

// Función para cargar los datos del criterio
const cargarCriterio = async () => {
    try {
        const { id } = route.params;
        const response = await $fetch(`${config.public.backend_url}/criterios/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': token.value
            }
        });
        form.value = response;

        console.log(response)
        // Asignar el nombre de la encuesta directamente desde la respuesta
        form.value.encuestaNombre = response?.encuestum?.nombre
        form.value.encuesta = response.encuestaId// Asegúrate de que el ID de la encuesta esté asignado
    } catch (error) {
        toast.error(`Error al cargar el criterio: ${error.response._data.message}`);
    }
};

// Función para obtener las encuestas desde el backend
const fetchEncuestas = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/encuesta`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token.value
            },
            credentials: 'include'
        });

        encuestas.value = response;
    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        toast.error('Error al obtener las encuestas.');
    }
};

onMounted(async () => {
    await fetchEncuestas(); // Asegúrate de que las encuestas se carguen primero
    await cargarCriterio(); // Luego carga el criterio
});

const handleSubmit = async () => {
    isLoading.value = true; // Activar el estado de carga
    try {
        await $fetch(`${config.public.backend_url}/criterios/update/${form.value.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': token.value
            },
            body: {
                nombre: form.value.nombre,
                encuestaId: form.value.encuesta // Asegúrate de enviar el ID de la encuesta
            },
        });

        toast.success("Criterio editado exitosamente.");
        router.back(); // Redirige a la página anterior
    } catch (error) {
        toast.error(`Error al editar el criterio: ${error.response._data.message}`);
    } finally {
        isLoading.value = false; // Desactivar el estado de carga
    }
};

const cancelar = () => {
    router.push('/criterios');
};

const soloLetras = (event) => {
    const regex = /[^a-zA-Z\s]/g;
    event.target.value = event.target.value.replace(regex, '');
    form.value.nombre = event.target.value;
};
</script>