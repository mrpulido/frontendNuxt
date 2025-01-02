<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {{ show ? 'Mostrar Profesor' : 'Editar Profesor' }}
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre" class="sr-only">{{ show ? 'Mostrando Nombre' : 'Nombre' }}</label>
                        <input id="nombre" name="nombre" type="text" required v-model="form.nombre" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre del Profesor">
                    </div>
                    <div>
                        <label for="sexo" class="sr-only">{{ show ? 'Mostrando Sexo' : 'Sexo'
                            }}</label>
                        <input id="sexo" name="sexo" type="text" required v-model="form.sexo" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Sexo">
                    </div>
                    <div>
                        <label for="edad" class="sr-only">{{ show ? 'Mostrando Edad' : 'Edad'
                            }}</label>
                        <input id="edad" name="edad" type="text" required v-model="form.edad" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Edad">
                    </div>
                    <div>
                        <label for="asignatura" class="sr-only">{{ show ? 'Mostrando Asignatura' : 'Asignatura'
                            }}</label>
                        <input id="asignatura" name="asignatura" type="text" required v-model="form.asignatura"
                            :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Asignatura">
                    </div>
                    <div v-if="show">
                        <label class="block text-sm font-medium text-gray-700">Facultad</label>
                        <p class="mt-1 text-sm text-gray-900">{{ form.facultadNombre }}</p>
                    </div>
                    <div v-else>
                        <label for="facultad" class="sr-only">{{ show ? 'Mostrando Facultad' : 'Facultad' }}</label>
                        <select id="facultad" name="facultad" required v-model="form.facultad" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                            <option value="" disabled selected>Seleccione una facultad</option>
                            <option v-for="facultad in facultades" :key="facultad.id" :value="facultad.id">
                                {{ facultad.nombre }}
                            </option>
                        </select>
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

const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const facultades = ref([]); // Lista de facultades

const form = ref({
    id: '',
    nombre: '',
    sexo: '',
    edad: '',
    asignatura: '',
    facultad: '',
    facultadNombre: '' // Añadir para mostrar el nombre de la facultad
});

const show = ref(route.query.show === 'true');

// Función para cargar los datos del profesor
const cargarProfesor = async () => {
    try {
        const { id } = route.params;
        const response = await $fetch(`${config.public.backend_url}/profesor/${id}`);
        form.value = response;
        // Asignar el nombre de la facultad
        const facultad = facultades.value.find(f => f.id === form.value.facultad);
        form.value.facultadNombre = facultad ? facultad.nombre : 'No asignada';
    } catch (error) {
        toast.error(`Error al cargar el profesor: ${error.message}`);
    }
};

// Función para obtener las facultades desde el backend
const fetchFacultades = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/facultad`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        facultades.value = response;
    } catch (error) {
        console.error('Error al obtener las facultades:', error);
        toast.error('Error al obtener las facultades.');
    }
};

onMounted(() => {
    fetchFacultades().then(cargarProfesor); // Asegúrate de cargar las facultades antes de cargar el profesor
});

const handleSubmit = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/profesor/update/${form.value.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                nombre: form.value.nombre,
                sexo: form.value.sexo,
                edad: form.value.edad,
                asignatura: form.value.asignatura,
                facultad: form.value.facultad // Incluir facultad en la actualización
            },
        });

        toast.success("Profesor editado exitosamente.");
        router.push('/profesor');
    } catch (error) {
        toast.error(`Error al editar el profesor: ${error.message}`);
    }
};

const cancelar = () => {
    router.push('/profesor');
};
</script>