<template>
    <div>
        <div class="flex">
            <span class="flex-grow"></span>
            <NuxtLink to="/criterios/crearCriterios"
                class="py-2.5 px-10 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Agregar
            </NuxtLink>
        </div>

        <TableCustom :headers="tableHeaders" :rows="criterios" :edit="handleEdit" :remove="handleRemove"
            :show="handleShow" />

        <!-- Agregar el modal de confirmación -->
        <ConfirmModal :isVisible="isModalVisible" title="Confirmar Eliminación"
            message="¿Estás seguro de que deseas eliminar este criterio?" @confirm="confirmDelete"
            @cancel="cancelDelete" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig();

const criterios = ref([]);
const tableHeaders = ref([
    { label: "Nombre", key: "nombre" },
    //{ label: "Encuesta", key: "encuesta" },
]);

// Variable para controlar la visibilidad del modal
const isModalVisible = ref(false);
let selectedCriterioId = null;

const handleShow = (row) => {
    router.push(`criterios/${row.id}?show=true`)
};

const handleEdit = (row) => {
    console.log('Editar', row);
    router.push(`criterios/${row.id}`)
};

const handleRemove = (row) => {
    selectedCriterioId = row.id;
    isModalVisible.value = true; // Mostrar el modal
};

const fetchCriterios = async () => {
    try {
        const response = await $fetch(
            `${useRuntimeConfig().public.backend_url}/criterios`,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }
        );

        criterios.value = response;

    } catch (error) {
        console.error('Error al obtener los criterios:', error);
        const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
        const errorCode = error.response?.status || 500;
        toast.error(`Error ${errorCode}: ${errorMessage}`);
    }
};

fetchCriterios()

// Función para confirmar y eliminar un criterio
const confirmDelete = async () => {
    try {
        const response = await $fetch(
            `${config.public.backend_url}/criterios/delete/${selectedCriterioId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        toast.success("Criterio eliminado exitosamente.");
        await fetchCriterios();
    } catch (error) {
        console.error("Error al eliminar criterio:", error.message);
        toast.error("Hubo un error al eliminar el criterio.");
    } finally {
        isModalVisible.value = false; // Ocultar el modal
    }
};

// Función para cancelar la eliminación
const cancelDelete = () => {
    isModalVisible.value = false; // Ocultar el modal
};
</script>