<template>
    <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Agregar Nuevo Profesor
                </h2>
            </div>
            <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
                <div class="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label for="nombre" class="sr-only">Nombre</label>
                        <input id="nombre" name="nombre" type="text" required v-model="form.nombre"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Nombre del profesor">
                    </div>
                    <div>
                        <label for="sexo" class="sr-only">Sexo</label>
                        <select id="sexo" name="sexo" required v-model="form.sexo"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                            <option value="" disabled>Seleccione el sexo</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>
                    <div>
                        <label for="edad" class="sr-only">Edad</label>
                        <input id="edad" name="edad" type="text" required v-model="form.edad"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Edad">
                    </div>
                    <div>
                        <label for="asignatura" class="sr-only">Asignatura</label>
                        <input id="asignatura" name="asignatura" type="text" required v-model="form.asignatura"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Asignatura">
                    </div>
                    <div>
                        <label for="facultad" class="sr-only">Facultad</label>
                        <select id="facultad" name="facultad" required v-model="form.facultad"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
                            <option value="" disabled>Seleccione una facultad</option>
                            <option v-for="facultad in facultades" :key="facultad.id" :value="facultad.id">
                                {{ facultad.nombre }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label for="imagen" class="sr-only">Imagen</label>
                        <input id="imagen" name="imagen" type="file" @change="handleFileChange"
                            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Imagen del profesor">
                    </div>
                </div>

                <div class="flex justify-between space-x-6">
                    <button type="submit"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Agregar
                    </button>
                    <button type="button"
                        class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700"
                        @click="cancelar">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
const { token } = useAuth()

const toast = useToast()
const config = useRuntimeConfig();
const router = useRouter()

const facultades = ref([]);

const form = ref({
    id: '',
    nombre: '',
    sexo: '',
    edad: '',
    asignatura: '',
    facultad: '',
    imagen: null
});

// Cargar datos del localStorage al montar el componente
onMounted(() => {
    const savedForm = localStorage.getItem('crearProfesorForm');
    if (savedForm) {
        const parsedForm = JSON.parse(savedForm);
        form.value = parsedForm;

        // Convertir la imagen de base64 a un objeto File si existe
        if (parsedForm.imagen) {
            const byteString = atob(parsedForm.imagen.split(',')[1]);
            const mimeString = parsedForm.imagen.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            form.value.imagen = new Blob([ab], { type: mimeString });
        }
    }
    fetchFacultades();
});

// Guardar datos en localStorage al cambiar el formulario
watch(form, (newForm) => {
    const formCopy = { ...newForm };

    // Convertir la imagen a base64 antes de guardar
    if (formCopy.imagen instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
            formCopy.imagen = reader.result;
            localStorage.setItem('crearProfesorForm', JSON.stringify(formCopy));
        };
        reader.readAsDataURL(formCopy.imagen);
    } else {
        localStorage.setItem('crearProfesorForm', JSON.stringify(formCopy));
    }
}, { deep: true });

const fetchFacultades = async () => {
    try {
        const response = await $fetch(`${config.public.backend_url}/facultad`, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token.value
            },
            credentials: 'include'
        });

        facultades.value = response;
    } catch (error) {
        console.error('Error al obtener las facultades:', error);
        toast.error('Error al obtener las facultades.');
    }
};

const handleFileChange = (event) => {
    form.value.imagen = event.target.files[0];
};

const handleSubmit = async () => {
    const toast = useToast(); // Inicializa el uso de toast  
    try {
        const formData = new FormData();
        formData.append('nombre', form.value.nombre);
        formData.append('sexo', form.value.sexo);
        formData.append('edad', form.value.edad);
        formData.append('asignatura', form.value.asignatura);
        formData.append('facultadId', form.value.facultad);
        if (form.value.imagen) {
            formData.append('imagen', form.value.imagen);
        }

        const response = await $fetch(`${config.public.backend_url}/profesor/create`, {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': token.value
            }
        });

        // Mensaje de éxito con vue-toastification  
        toast.success("Profesor agregado exitosamente.");

        // Reiniciar el formulario después de enviar  
        form.value = {
            nombre: '',
            sexo: '',
            edad: '',
            asignatura: '',
            facultad: '',
            imagen: null
        };

        // Eliminar los datos guardados en localStorage
        localStorage.removeItem('crearProfesorForm');

        // Redirigir a la página anterior  
        router.push('/profesor'); // Cambia '/profesor' por la ruta que desees  
    } catch (error) {
        // Mensaje de error con vue-toastification  
        toast.error(`Error al agregar el profesor: ${error.message}`);
    }
};

const cancelar = () => {
    localStorage.removeItem('crearProfesorForm'); // Elimina los datos guardados
    router.push('/profesor'); // Cambia '/facultad' por la ruta que desees
}
</script>