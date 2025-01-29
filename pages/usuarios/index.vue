<template>
    <div class="min-h-screen flex flex-col">
        <div class="flex">
            <span class="flex-grow"></span>
            <NuxtLink to="/usuarios/crearUsuario"
                class="py-2.5 px-10 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Agregar
            </NuxtLink>
        </div>

        <TableCustom :headers="tableHeaders" :rows="usuarios" :edit="handleEdit" :remove="handleRemove"
            :show="handleShow" />

        <!-- Agregar el modal de confirmación -->
        <ConfirmModal :isVisible="isModalVisible" title="Confirmar Eliminación"
            message="¿Estás seguro de que deseas eliminar este usuario?" @confirm="confirmDelete"
            @cancel="cancelDelete" />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from 'vue-toastification'

useSeoMeta({
    title: 'Página de Usuarios',
    ogTitle: 'Página de Usuarios',
    description: 'Explora y gestiona los Usuarios.',
    ogDescription: 'Explora y gestiona los usuarios.',
    ogImage: '/images/logo.png',
    keywords: 'usuarios, evaluación, gestión'
});

const { token } = useAuth()
const router = useRouter()
const toast = useToast()
const config = useRuntimeConfig();

const usuarios = ref([]);
const tableHeaders = ref([
    { label: "Nombre", key: "nombre_usuario" },
    { label: "Rol", key: "rol" },
]);

// Variable para controlar la visibilidad del modal
const isModalVisible = ref(false);
let selectedUsuarioId = null;

const handleShow = (row) => {
    router.push(`usuarios/${row.id}?show=true`)
};

const handleEdit = (row) => {
    console.log('Editar', row);
    router.push(`usuarios/${row.id}`)
};

const handleRemove = (row) => {
    selectedUsuarioId = row.id;
    isModalVisible.value = true; // Mostrar el modal
};

const fetchUsuarios = async () => {
    try {
        const response = await $fetch(
            `${useRuntimeConfig().public.backend_url}/usuarios`,
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

        usuarios.value = response;

    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        const errorMessage = error.response?._data?.message || 'Ha ocurrido un error inesperado';
        const errorCode = error.response?.status || 500;
        toast.error(`Error ${errorCode}: ${errorMessage}`);
    }
};

fetchUsuarios()

// Función para confirmar y eliminar un usuario
const confirmDelete = async () => {
    try {
        const response = await $fetch(
            `${config.public.backend_url}/usuarios/delete/${selectedUsuarioId}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': token.value
                },
            }
        );

        toast.success("Usuario eliminado exitosamente.");
        await fetchUsuarios();
    } catch (error) {
        console.error("Error al eliminar usuario:", error.message);
        toast.error("Hubo un error al eliminar el usuario.");
    } finally {
        isModalVisible.value = false; // Ocultar el modal
    }
};

// Función para cancelar la eliminación
const cancelDelete = () => {
    isModalVisible.value = false; // Ocultar el modal
};
</script>