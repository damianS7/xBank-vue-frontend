<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import FullScreenLoader from "@/components/FullScreenLoadingSpinner.vue";
const initialized = ref(false);
const authStore = useAuthStore();
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function wait() {
  await sleep(1000); // Espera 2 segundos
}

onMounted(() => {
  // wait();
  // console.log("mounted app");
  authStore.initialize();
  // initialized.value = true;
});
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
