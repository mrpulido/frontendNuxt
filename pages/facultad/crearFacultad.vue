<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Agregar Nueva Facultad
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre" class="sr-only">Nombre</label>
                        <input id="nombre" name="nombre" type="text" required v-model="form.nombre"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre de la facultad">
                    </div>
                    <div>
                        <label for="responsable" class="sr-only">Responsable</label>
                        <input id="responsable" name="responsable" type="text" required v-model="form.responsable"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Responsable">
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

const form = ref({
    nombre: '',
    responsable: ''
})

// Cargar datos del localStorage al montar el componente
onMounted(() => {
    const savedForm = localStorage.getItem('crearFacultadForm');
    if (savedForm) {
        form.value = JSON.parse(savedForm);
    }
});

// Guardar datos en localStorage al cambiar el formulario
watch(form, (newForm) => {
    localStorage.setItem('crearFacultadForm', JSON.stringify(newForm));
}, { deep: true });

const handleSubmit = async () => {
    const toast = useToast(); // Inicializa el uso de toast  
    try {
        const response = await $fetch(`${config.public.backend_url}/facultad/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                nombre: form.value.nombre,
                responsable: form.value.responsable,
            },
        });

        // Mensaje de éxito con vue-toastification  
        toast.success("Facultad agregada exitosamente.");

        // Reiniciar el formulario después de enviar  
        form.value = {
            nombre: '',
            responsable: ''
        };

        // Redirigir a la página anterior  
        router.push('/facultad'); // Cambia '/facultad' por la ruta que desees  
    } catch (error) {
        // Mensaje de error con vue-toastification  
        toast.error(`Error al agregar la facultad: ${error.message}`);
    }
};

const cancelar = () => {
    localStorage.removeItem('crearFacultadForm'); // Elimina los datos guardados
    router.push('/facultad'); // Cambia '/facultad' por la ruta que desees
}
</script>