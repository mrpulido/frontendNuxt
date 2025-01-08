<template>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mb-4">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th v-for="(header, index) in headers" :key="index" scope="col" class="px-6 py-3 text-center">
                        {{ header.label }}
                    </th>
                    <th scope="col" class="px-6 py-3 text-center">
                        Acciones
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in rows" :key="rowIndex"
                    class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                    <td v-for="(header, colIndex) in headers" :key="colIndex" class="px-6 py-4 text-center">
                        {{ getNestedValue(row, header.key) }}
                    </td>
                    <td class="px-6 py-4 text-center">
                        <NuxtLink to="" class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            @click.prevent="show(row)">
                            <Icon name="heroicons-outline:eye" />
                        </NuxtLink>
                        <NuxtLink to="" class="font-medium text-green-600 dark:text-blue-500 hover:underline ml-2"
                            @click.prevent="edit(row)">
                            <Icon name="heroicons-outline:pencil-alt" />
                        </NuxtLink>
                        <NuxtLink to="#" class="font-medium text-red-600 dark:text-red-500 hover:underline ml-2"
                            @click.prevent="remove(row)">
                            <Icon name="heroicons-outline:trash" />
                        </NuxtLink>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>


</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    headers: {
        type: Array,
        required: true
    },
    rows: {
        type: Array,
        required: true
    },
    show: {
        type: Function,
        required: true,
        default: (row) => {
            console.log('Mostrar por defecto', row);
        }
    },
    edit: {
        type: Function,
        required: true,
        default: (row) => {
            console.log('Editar por defecto', row);
        }
    },
    remove: {
        type: Function,
        required: true,
        default: (row) => {
            console.log('Eliminar por defecto', row);
        }
    }
});

// Función auxiliar para obtener valores anidados
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}
</script>