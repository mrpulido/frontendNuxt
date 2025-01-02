<template>
    <div>
        <div class="flex">
            <span class="flex-grow"></span>
            <NuxtLink to="/profesor/crearProfesor"
                class="py-2.5 px-10 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Agregar
            </NuxtLink>
        </div>

        <TableCustom :headers="tableHeaders" :rows="profesores" :edit="handleEdit" :remove="handleRemove"
            :show="handleShow" />

        <!-- Agregar el modal de confirmación -->
        <ConfirmModal :isVisible="isModalVisible" title="Confirmar Eliminación"
            message="¿Estás seguro de que deseas eliminar este profesor?" @confirm="confirmDelete"
            @cancel="cancelDelete" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig();

const profesores = ref([]);
const tableHeaders = ref([
    { label: "Nombre", key: "nombre" },
    { label: "Sexo", key: "sexo" },
    { label: "Edad", key: "edad" },
    { label: "Asignatura", key: "asignatura" },
]);

// Variable para controlar la visibilidad del modal
const isModalVisible = ref(false);
let selectedProfesorId = null;

const handleShow = (row) => {
    router.push(`profesor/${row.id}?show=true`)
};

const handleEdit = (row) => {
    console.log('Editar', row);
    router.push(`profesor/${row.id}`)
};

const handleRemove = (row) => {
    selectedProfesorId = row.id;
    isModalVisible.value = true; // Mostrar el modal
};

const fetchProfesores = async () => {
    try {
        const response = await $fetch(
            `${useRuntimeConfig().public.backend_url}/profesor`,
            {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            }
        );

        profesores.value = response;

    } catch (error) {
        console.error('Error al obtener los profesores:', error);
        const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
        const errorCode = error.response?.status || 500;
        toast.error(`Error ${errorCode}: ${errorMessage}`);
    }
};

fetchProfesores()

// Función para confirmar y eliminar un profesor
const confirmDelete = async () => {
    try {
        const response = await $fetch(
            `${config.public.backend_url}/profesor/delete/${selectedProfesorId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        toast.success("Profesor eliminado exitosamente.");
        await fetchProfesores();
    } catch (error) {
        console.error("Error al eliminar profesor:", error.message);
        toast.error("Hubo un error al eliminar el profesor.");
    } finally {
        isModalVisible.value = false; // Ocultar el modal
    }
};

// Función para cancelar la eliminación
const cancelDelete = () => {
    isModalVisible.value = false; // Ocultar el modal
};
</script>