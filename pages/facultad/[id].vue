<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {{ show ? 'Mostrar Facultad' : 'Editar Facultad' }}
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre" class="sr-only">{{ show ? 'Mostrando Nombre' : 'Nombre' }}</label>
                        <input id="nombre" name="nombre" type="text" required v-model="form.nombre" :disabled="show"
                            @input="soloLetras('nombre')"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre de la facultad">
                    </div>
                    <div>
                        <label for="responsable" class="sr-only">{{ show ? 'Mostrando Responsable' : 'Responsable'
                            }}</label>
                        <input id="responsable" name="responsable" type="text" required v-model="form.responsable"
                            :disabled="show" @input="soloLetras('responsable')"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Responsable">
                    </div>
                </div>

                <div class="flex justify-between space-x-6">
                    <button v-if="!show" type="submit" :disabled="isSubmitting"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {{ isSubmitting ? 'Procesando...' : 'Editar' }}
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



const { token } = useAuth()
const config = useRuntimeConfig();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const form = ref({
    id: '',
    nombre: '',
    responsable: ''
});

const show = ref(route.query.show === 'true');
//configuracion de seo
const seoTitle = computed(() => (show.value ? 'Mostrar Facultad' : 'Editar Facultad'));
const seoDescription = computed(() => (show.value ? 'Página para mostrar una facultad específica en el sistema.' : 'Página para editar una facultad específica en el sistema.'));
const seoKeywords = computed(() => (show.value ? 'facultad, mostrar, sistema' : 'facultad, editar, sistema'));

useSeoMeta({
    title: seoTitle,
    ogTitle: seoTitle,
    description: seoDescription,
    ogDescription: seoDescription,
    ogImage: '/images/logo.png',
    keywords: seoKeywords
});

const isSubmitting = ref(false);

// Función para cargar los datos de la facultad
const cargarFacultad = async () => {
    try {
        const { id } = route.params;
        const response = await $fetch(`${config.public.backend_url}/facultad/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': token.value
            }
        });
        form.value = response;
    } catch (error) {
        toast.error(`Error al cargar la facultad: ${error.message}`);
    }
};

onMounted(() => {
    cargarFacultad();
});

const handleSubmit = async () => {
    isSubmitting.value = true;
    try {
        const response = await $fetch(`${config.public.backend_url}/facultad/update/${form.value.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'Authorization': token.value
            },
            body: {
                nombre: form.value.nombre,
                responsable: form.value.responsable,
            },
        });

        toast.success("Facultad editada exitosamente.");
        router.push('/facultad');
    } catch (error) {
        toast.error(`Error al editar la facultad: ${error.response._data.message}`);
    } finally {
        isSubmitting.value = false;
    }
};

const cancelar = () => {
    localStorage.removeItem('editarFacultadForm');
    form.value = { id: '', nombre: '', responsable: '' };
    router.push('/facultad');
};

const soloLetras = (campo) => {
    form.value[campo] = form.value[campo].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
};
</script>