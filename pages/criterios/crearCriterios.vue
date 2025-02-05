<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Agregar Nuevo Criterio
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre" class="sr-only">Nombre</label>
                        <input id="nombre" name="nombre" type="text" required v-model="form.nombre"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre del criterio">
                    </div>
                    <div>
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
                    <button type="submit" :disabled="isSubmitting"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {{ isSubmitting ? 'Procesando...' : 'Agregar' }}
                    </button>
                    <button type="button"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                        @click="cancelar">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const { token } = useAuth()
const toast = useToast()
const config = useRuntimeConfig();
const router = useRouter()

const encuestas = ref([]);

const form = ref({
    id: '',
    nombre: '',
    encuesta: ''
});

const isLoading = ref(false);

useSeoMeta({
    title: 'Agregar Nuevo Criterio',
    ogTitle: 'Agregar Nuevo Criterio',
    description: 'Página para agregar un nuevo criterio al sistema.',
    ogDescription: 'Página para agregar un nuevo criterio al sistema.',
    ogImage: '/images/logo.png',
    keywords: 'criterio, agregar, sistema'
});

// Cargar datos del localStorage al montar el componente
onMounted(() => {
    const savedForm = localStorage.getItem('crearCriteriosForm');
    if (savedForm) {
        form.value = JSON.parse(savedForm);
    }
    fetchEncuestas();
});

// Guardar datos en localStorage al cambiar el formulario
watch(form, (newForm) => {
    localStorage.setItem('crearCriteriosForm', JSON.stringify(newForm));
}, { deep: true });

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

const handleSubmit = async () => {
    const toast = useToast(); // Inicializa el uso de toast  
    isLoading.value = true; // Inicia el estado de carga
    try {
        const response = await $fetch(`${config.public.backend_url}/criterios/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': token.value
            },
            body: {
                nombre: form.value.nombre,
                encuestaId: form.value.encuesta
            },
        });

        // Mensaje de éxito con vue-toastification  
        toast.success("Criterio agregado exitosamente.");

        // Reiniciar el formulario después de enviar  
        form.value = {
            nombre: '',
            encuesta: ''
        };

        // Eliminar datos guardados en localStorage
        localStorage.removeItem('crearCriteriosForm');

        // Redirigir a la página anterior  
        router.push('/criterios'); // Cambia '/criterio' por la ruta que desees  
    } catch (error) {
        // Mensaje de error con vue-toastification  
        toast.error(`Error al agregar el criterio: ${error.message}`);
    } finally {
        isLoading.value = false; // Finaliza el estado de carga
    }
};

const cancelar = () => {
    localStorage.removeItem('crearCriteriosForm'); // Elimina los datos guardados
    router.push('/criterios'); // Cambia '/criterio' por la ruta que desees
}
</script>