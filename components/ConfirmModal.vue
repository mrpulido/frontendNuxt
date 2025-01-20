<template>
    <div v-if="isVisible" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
            <p class="mb-6">{{ message }}</p>
            <div class="flex justify-end space-x-4">
                <button @click="cancel" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                    Cancelar
                </button>
                <button @click="confirm" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Confirmar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    title: {
        type: String,
        default: 'Confirmación'
    },
    message: {
        type: String,
        default: '¿Estás seguro de que deseas continuar?'
    },
    isVisible: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['confirm', 'cancel', 'update:isVisible']);

function confirm() {
    emit('confirm');
    close();
}

function cancel() {
    emit('cancel');
    close();
}

function close() {
    emit('update:isVisible', false);
}
</script>

<style scoped>
/* No se necesita CSS adicional ya que Tailwind CSS maneja el estilo */
</style>
