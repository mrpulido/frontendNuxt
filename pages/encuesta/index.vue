<template>
    <div class="min-h-screen flex flex-col">
        <div class="flex">
            <span class="flex-grow"></span>
            <NuxtLink to="/encuesta/crearEncuesta"
                class="py-2.5 px-10 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Agregar
            </NuxtLink>
        </div>

        <TableCustom :headers="tableHeaders" :rows="encuestas" :edit="handleEdit" :remove="handleRemove"
            :show="handleShow" />

        <!-- Agregar el modal de confirmación -->
        <ConfirmModal :isVisible="isModalVisible" title="Confirmar Eliminación"
            message="¿Estás seguro de que deseas eliminar esta encuesta?" @confirm="confirmDelete"
            @cancel="cancelDelete" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from 'vue-toastification'

useSeoMeta({
    title: 'Página de Encuestas',
    ogTitle: 'Página de Encuestas',
    description: 'Explora y gestiona las encuestas.',
    ogDescription: 'Explora y gestiona las encuestas.',
    ogImage: '/images/logo.png',
    keywords: 'encuestas, evaluación, gestión'
});

const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig();
const { token } = useAuth()

const encuestas = ref([]);
const tableHeaders = ref([
    { label: "Nombre", key: "nombre" },
]);

// Variable para controlar la visibilidad del modal
const isModalVisible = ref(false);
let selectedEncuestaId = null;

const handleShow = (row) => {
    router.push(`encuesta/${row.id}?show=true`)
};

const handleEdit = (row) => {
    console.log('Editar', row);
    router.push(`encuesta/${row.id}`)
};

const handleRemove = (row) => {
    selectedEncuestaId = row.id;
    isModalVisible.value = true; // Mostrar el modal
};

const fetchEncuestas = async () => {
    try {
        const response = await $fetch(
            `${useRuntimeConfig().public.backend_url}/encuesta`,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token.value
                },
                credentials: 'include'
            }
        );

        encuestas.value = response;

    } catch (error) {
        console.error('Error al obtener las encuestas:', error);
        const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
        const errorCode = error.response?.status || 500;
        toast.error(`Error ${errorCode}: ${errorMessage}`);
    }
};

fetchEncuestas()

// Función para confirmar y eliminar una encuesta
const confirmDelete = async () => {
    try {
        const response = await $fetch(
            `${config.public.backend_url}/encuesta/delete/${selectedEncuestaId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': token.value
                },
            }
        );

        toast.success("Encuesta eliminada exitosamente.");
        await fetchEncuestas();
    } catch (error) {
        console.error("Error al eliminar encuesta:", error.message);
        toast.error("Hubo un error al eliminar la encuesta.");
    } finally {
        isModalVisible.value = false; // Ocultar el modal
    }
};

// Función para cancelar la eliminación
const cancelDelete = () => {
    isModalVisible.value = false; // Ocultar el modal
};
</script>