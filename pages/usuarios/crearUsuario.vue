<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Agregar Nuevo Usuario
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre_usuario" class="sr-only">Nombre de Usuario</label>
                        <input id="nombre_usuario" name="nombre_usuario" type="text" required
                            v-model="form.nombre_usuario"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre de Usuario">
                    </div>
                    <div>
                        <label for="contarsena" class="sr-only">Contraseña</label>
                        <input id="contrasena" name="contrasena" type="text" required v-model="form.contrasena"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Contraseña">
                    </div>
                    <div>
                        <label for="rol" class="sr-only">Rol</label>
                        <input id="rol" name="rol" type="text" required v-model="form.rol"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Rol">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useToast } from 'vue-toastification'

// Agregar el toast
const toast = useToast()
// Configuración en tiempo de ejecución
const config = useRuntimeConfig();
const router = useRouter()

const form = ref({
    nombre_usuario: '',
    contrasena: '',
    rol: ''
})

const handleSubmit = async () => {
    const toast = useToast(); // Inicializa el uso de toast  
    try {
        const response = await $fetch(`${config.public.backend_url}/usuarios/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                nombre_usuario: form.value.nombre_usuario,
                contrasena: form.value.nombre_usuario,
                rol: form.value.rol,
            },
        });

        // Mensaje de éxito con vue-toastification  
        toast.success("Usuario agregado exitosamente.");

        // Reiniciar el formulario después de enviar  
        form.value = {
            nombre_usuario: '',
            contrasena: '',
            rol: ''
        };

        // Redirigir a la página anterior  
        router.push('/usuarios'); // Cambia '/usuario' por la ruta que desees  
    } catch (error) {
        // Mensaje de error con vue-toastification  
        toast.error(`Error al agregar el usuario: ${error.message}`);
    }
};

const cancelar = () => {
    router.push('/usuarios'); // Cambia '/usuario' por la ruta que desees
}
</script>