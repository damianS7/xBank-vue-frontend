<template>
  <FullScreenLoader v-if="!authStore.initialized" />
  <router-view v-if="authStore.initialized" />
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useCustomerStore } from "@/stores/customer";
import FullScreenLoader from "@/components/FullScreenLoadingSpinner.vue";
const authStore = useAuthStore();
const customerStore = useCustomerStore();
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function wait() {
  await sleep(1000); // Espera 2 segundos
}

onMounted(async () => {
  await wait();
  authStore.initialize();
  customerStore.initialize();
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
