<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {{ show ? 'Mostrar Profesor' : 'Editar Profesor' }}
                </h2>
            </div>
            <!-- Mostrar la imagen del profesor si existe -->
            <div v-if="form.imagen" class="flex justify-center mb-4">
                <img :src="`${config.public.backend_url}/${form.imagen}`" alt="Imagen del Profesor"
                    class="w-32 h-32 object-cover rounded-full">
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="show ? cancelar() : handleSubmit()">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre" class="sr-only">Nombre</label>
                        <input id="nombre" name="nombre" type="text" required v-model="form.nombre" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre del Profesor">
                    </div>
                    <div>
                        <label for="sexo" class="sr-only">Sexo</label>
                        <select id="sexo" name="sexo" required v-model="form.sexo" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                            <option value="" disabled>Seleccione el sexo</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>
                    <div>
                        <label for="edad" class="sr-only">Edad</label>
                        <input id="edad" name="edad" type="text" required v-model="form.edad" :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Edad">
                    </div>
                    <div>
                        <label for="asignatura" class="sr-only">Asignatura</label>
                        <input id="asignatura" name="asignatura" type="text" required v-model="form.asignatura"
                            :disabled="show"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Asignatura">
                    </div>
                    <div v-if="show">
                        <label for="facultad" class="sr-only">Facultad</label>
                        <input id="facultad" name="facultad" type="text" :value="form.facultadNombre || 'No asignada'"
                            disabled
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Facultad">
                    </div>
                    <div v-else>
                        <label for="facultad" class="sr-only">Facultad</label>
                        <select id="facultad" name="facultad" required v-model="form.facultad"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                            <option value="" disabled>Seleccione una facultad</option>
                            <option v-for="facultad in facultades" :key="facultad.id" :value="facultad.id">
                                {{ facultad.nombre }}
                            </option>
                        </select>
                    </div>
                    <div v-if="!show">
                        <label for="imagen" class="sr-only">Nueva Imagen</label>
                        <input id="imagen" name="imagen" type="file" @change="handleFileChange"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nueva Imagen del Profesor">
                    </div>
                </div>

                <div class="flex justify-between space-x-6">
                    <button type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        v-if="!show">
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

const facultades = ref([]); // Lista de facultades

const form = ref({
    id: '',
    nombre: '',
    sexo: '',
    edad: '',
    asignatura: '',
    facultad: '',
    facultadNombre: '',
    imagen: '' // Asegúrate de incluir la imagen en el formulario
});

const show = ref(route.query.show === 'true');

//configuracion de seo
const seoTitle = computed(() => (show.value ? 'Mostrar Profesor' : 'Editar Profesor'));
const seoDescription = computed(() => (show.value ? 'Página para mostrar un profesor específica en el sistema.' : 'Página para editar un profesor específica en el sistema.'));
const seoKeywords = computed(() => (show.value ? 'profesor, mostrar, sistema' : 'profesor, editar, sistema'));

useSeoMeta({
    title: seoTitle,
    ogTitle: seoTitle,
    description: seoDescription,
    ogDescription: seoDescription,
    ogImage: '/images/logo.png',
    keywords: seoKeywords
});

// Función para cargar los datos del profesor
const cargarProfesor = async () => {
    try {
        const { id } = route.params;
        const response = await $fetch(`${config.public.backend_url}/profesor/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': token.value
            }
        });
        form.value = response;
        // Asignar el nombre de la facultad directamente desde la respuesta
        form.value.facultadNombre = response.facultad ? response.facultad.nombre : null;
        form.value.facultad = response.facultad ? response.facultad.id : ''; // Asegúrate de que el ID de la facultad esté asignado
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
                'Content-Type': 'application/json',
                'Authorization': token.value
            },
            credentials: 'include'
        });

        facultades.value = response;
    } catch (error) {
        console.error('Error al obtener las facultades:', error);
        toast.error('Error al obtener las facultades.');
    }
};

onMounted(async () => {
    await fetchFacultades(); // Asegúrate de que las facultades se carguen primero
    await cargarProfesor(); // Luego carga el profesor
});

const handleFileChange = (event) => {
    form.value.imagen = event.target.files[0];
};

const handleSubmit = async () => {
    try {
        const formData = new FormData();
        formData.append('nombre', form.value.nombre);
        formData.append('sexo', form.value.sexo);
        formData.append('edad', form.value.edad);
        formData.append('asignatura', form.value.asignatura);
        formData.append('facultadId', form.value.facultad);
        if (form.value.imagen) {
            formData.append('imagen', form.value.imagen);
        }

        // Log para verificar los datos enviados
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        await $fetch(`${config.public.backend_url}/profesor/update/${form.value.id}`, {
            method: "PUT",
            body: formData,
            headers: {
                'Authorization': token.value
            }
        });

        toast.success("Profesor editado exitosamente.");
        router.back(); // Redirige a la página anterior
    } catch (error) {
        toast.error(`Error al editar el profesor: ${error.message}`);
    }
};

const cancelar = () => {
    router.push('/profesor');
};
</script>