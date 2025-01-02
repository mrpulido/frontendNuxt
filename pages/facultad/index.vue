<template>
    <div>
        <div class="flex">
            <span class="flex-grow"></span>
            <NuxtLink to="/facultad/crearFacultad"
                class="py-2.5 px-10 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Agregar
            </NuxtLink>
        </div>

        <TableCustom :headers="tableHeaders" :rows="facultades" :edit="handleEdit" :remove="handleRemove"
            :show="handleShow" />

        <!-- Agregar el modal de confirmación -->
        <ConfirmModal :isVisible="isModalVisible" title="Confirmar Eliminación"
            message="¿Estás seguro de que deseas eliminar esta facultad?" @confirm="confirmDelete"
            @cancel="cancelDelete" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig();

const facultades = ref([]);
const tableHeaders = ref([
    { label: "Nombre", key: "nombre" },
    { label: "Responsable", key: "responsable" },
]);

// Variable para controlar la visibilidad del modal
const isModalVisible = ref(false);
let selectedFacultadId = null;

const handleShow = (row) => {
    router.push(`facultad/${row.id}?show=true`)
};

const handleEdit = (row) => {
    console.log('Editar', row);
    router.push(`facultad/${row.id}`)
};

const handleRemove = (row) => {
    selectedFacultadId = row.id;
    isModalVisible.value = true; // Mostrar el modal
};

const fetchFacultades = async () => {
    try {
        const response = await $fetch(
            `${useRuntimeConfig().public.backend_url}/facultad`,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }
        );

        facultades.value = response;

    } catch (error) {
        console.error('Error al obtener las facultades:', error);
        const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
        const errorCode = error.response?.status || 500;
        toast.error(`Error ${errorCode}: ${errorMessage}`);
    }
};

fetchFacultades()

// Función para confirmar y eliminar un trabajador
const confirmDelete = async () => {
    try {
        const response = await $fetch(
            `${config.public.backend_url}/facultad/delete/${selectedFacultadId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        toast.success("Facultad eliminada exitosamente.");
        await fetchFacultades();
    } catch (error) {
        console.error("Error al eliminar facultad:", error.message);
        toast.error("Hubo un error al eliminar la facultad.");
    } finally {
        isModalVisible.value = false; // Ocultar el modal
    }
};

// Función para cancelar la eliminación
const cancelDelete = () => {
    isModalVisible.value = false; // Ocultar el modal
};
</script>