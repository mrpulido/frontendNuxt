<template>
    <div class="flex">
        <div v-if="showSider" class="overlay" @click="toggleSider"></div>
        <button class="toggle-sider" @click="toggleSider">☰</button>
        <Sider v-if="showSider" :class="{ 'absolute': isMobileOrTablet }" />
        <div class="m-4 flex-1">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showSider: false,
            isMobileOrTablet: false
        };
    },
    mounted() {
        this.checkDevice();
        window.addEventListener('resize', this.checkDevice);
    },
    methods: {
        toggleSider() {
            this.showSider = !this.showSider;
        },
        checkDevice() {
            const width = window.innerWidth;
            this.isMobileOrTablet = width < 1024; // Cambia el valor según tus necesidades
            if (!this.isMobileOrTablet) {
                this.showSider = true;
            }
        }
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.checkDevice);
    }
};
</script>

<style scoped>
.toggle-sider {
    display: none;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1002;
}

@media (max-width: 1024px) {
    .toggle-sider {
        display: block;
    }

    .flex {
        position: relative;
    }

    .absolute {
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        background-color: white;
        z-index: 1001;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }
}
</style>