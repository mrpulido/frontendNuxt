<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Agregar Nueva Encuesta
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre" class="sr-only">Nombre</label>
                        <input id="nombre" name="nombre" type="text" required v-model="form.nombre"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre de la encuesta">
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Profesores</label>
                    <div class="mt-2 space-y-2">
                        <div v-for="profesor in profesores" :key="profesor.id" class="flex items-center">
                            <input type="checkbox" :id="'profesor-' + profesor.id" :value="profesor.id"
                                v-model="form.profesores"
                                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                            <label :for="'profesor-' + profesor.id" class="ml-2 block text-sm text-gray-900">
                                {{ profesor.nombre }}
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between space-x-6">
                    <button type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Agregar
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

// Agregar el toast
const toast = useToast()
// Configuración en tiempo de ejecución
const config = useRuntimeConfig();
const router = useRouter()

const profesores = ref([]);

const form = ref({
    nombre: '',
    usuarioId: 4,
    profesores: []
});

// Cargar datos del localStorage al montar el componente
onMounted(() => {
    const savedForm = localStorage.getItem('crearEncuestaForm');
    if (savedForm) {
        form.value = JSON.parse(savedForm);
    }
});

// Guardar datos en localStorage al cambiar el formulario
watch(form, (newForm) => {
    localStorage.setItem('crearEncuestaForm', JSON.stringify(newForm));
}, { deep: true });

// Cargar la lista de profesores al montar el componente
onMounted(async () => {
    try {
        const response = await fetch(`${config.public.backend_url}/profesor`);
        if (!response.ok) {
            throw new Error('Error al obtener la lista de profesores');
        }
        profesores.value = await response.json();
    } catch (error) {
        toast.error(`Error al cargar profesores: ${error.message}`);
    }
});

const handleSubmit = async () => {
    const toast = useToast(); // Inicializa el uso de toast  
    try {
        const response = await $fetch(`${config.public.backend_url}/encuesta/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                nombre: form.value.nombre,
                usuarioId: form.value.usuarioId,
                profesores: form.value.profesores
            },
        });

        // Mensaje de éxito con vue-toastification  
        toast.success("Encuesta agregada exitosamente.");

        // Reiniciar el formulario después de enviar  
        form.value = {
            nombre: '',
            usuarioId: 4,
            profesores: []
        };

        // Redirigir a la página anterior  
        router.push('/encuesta'); // Cambia '/encuesta' por la ruta que desees  
    } catch (error) {
        // Mensaje de error con vue-toastification  
        toast.error(`Error al agregar la encuesta: ${error.message}`);
    }
};

const cancelar = () => {
    localStorage.removeItem('crearEncuestaForm'); // Elimina los datos guardados
    router.push('/encuesta'); // Cambia '/encuesta' por la ruta que desees

}
</script>
