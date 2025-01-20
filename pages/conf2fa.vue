<template>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {{ has2FAConfigured ? 'Verificar 2FA' : 'Configurar 2FA' }}
                </h2>
            </div>

            <div v-if="!has2FAConfigured" class="mt-8 space-y-6">
                <div class="flex flex-col items-center">
                    <img :src="qrCodeUrl" alt="QR Code" class="w-64 h-64 mb-4" />
                    <p class="text-sm text-gray-600 mb-2">Escanea el código QR con tu aplicación de autenticación</p>
                    <p class="text-sm font-medium text-gray-800">O usa este código secreto:</p>
                    <p class="text-lg font-bold text-indigo-600 mt-1">{{ secretCode }}</p>
                </div>
            </div>

            <form class="mt-8 space-y-6" @submit.prevent="validateCode">
                <div>
                    <label for="code" class="sr-only">Código 2FA</label>
                    <input id="code" name="code" type="text" required v-model="code"
                        class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Ingresa el código de 6 dígitos" />
                </div>

                <div>
                    <button type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {{ has2FAConfigured ? 'Verificar' : 'Configurar 2FA' }}
                    </button>
                </div>
            </form>


        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'login',
})
import { useToast } from 'vue-toastification';
import { ref, computed } from 'vue'
const router = useRouter()
const { token, data } = useAuth()
const config = useRuntimeConfig()
const toast = useToast()




const has2FAConfigured = computed(() => data?.value?.twoFactorEnabled)
const qrCodeUrl = ref('')
const secretCode = ref('')
const code = ref('')




const generateTwoFactor = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/auth/2fa/generate`, {
            method: 'POST',
            headers: {
                'Authorization': token.value
            }
        })
        qrCodeUrl.value = response.qrCode
        secretCode.value = response.secret
    } catch (error) {
        console.error('Error detallado:', error)
        const errorMessage = error.data?.message || 'Error al iniciar sesión'
        toast.error(errorMessage)
    }
}
const setup2FA = async () => {
    try {

        const response = await $fetch(`${config.public.backend_url}/auth/2fa/verify`, {
            method: 'POST',
            headers: {
                'Authorization': token.value
            },
            body: {
                code: code.value
            }
        })
        router.push("/")

    } catch (error) {
        console.error('Error detallado:', error)
        const errorMessage = error.data?.message || 'Error inesperado'
        toast.error(errorMessage)
    }
}
const validate2FA = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/auth/2fa/validate`, {
            method: 'POST',
            headers: {
                'Authorization': token.value
            },
            body: {
                code: code.value
            }
        })
        router.push("/")
    } catch (error) {
        console.error('Error detallado:', error)
        const errorMessage = error.data?.message || 'Error inesperado'
        toast.error(errorMessage)
    }
}

const validateCode = async () => {

    if (has2FAConfigured.value) {
        validate2FA()
    } else {
        setup2FA()
    }

}

onMounted(async () => {
    if (!has2FAConfigured.value) {
        generateTwoFactor()
    }
})



</script>