<template>


    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Nombre
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Responsable
                    </th>

                    <th scope="col" class="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="facultad in facultades" :key="facultad.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                        {{ facultad.nombre }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">{{ facultad.responsable }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <button
                            class="text-blue-600 hover:text-blue-800 focus:outline-none transition duration-150 ease-in-out mr-4"
                            @click="goToModificarFacultad(facultad.id)">
                            Editar
                        </button>
                        <button
                            class="text-red-600 hover:text-red-800 focus:outline-none transition duration-150 ease-in-out"
                            @click="onDelete(facultad.id)">
                            Eliminar
                        </button>
                    </td>
                </tr>


            </tbody>
        </table>
    </div>

</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
defineProps({
    facultades: {
        type: Array,
        required: true,
    },
    onDelete: {
        type: Function,
        required: true,
    },
});
//console.log("facultades desde el component", facultades);
// Redirige el botón modificar a la página modificarUsuario con el idUsuario
const goToModificarFacultad = (id) => {
    router.push(`/facultad/${id}`);
};
</script>