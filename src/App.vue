<template>
  <router-view />
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
onMounted(() => {
  authStore.initialize();
});
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav a:hover {
  @apply text-blue-500;
}

nav a.router-link-exact-active {
  @apply font-bold;
  @apply text-blue-500;
}

.btn {
  @apply font-bold py-2 px-4 rounded text-sm;
}

.btn-small {
  @apply font-bold p-1 px-2 rounded text-xs;
}

.btn-blue {
  @apply bg-blue-600 text-white;
}
.btn-blue:hover {
  @apply bg-blue-700;
}
</style>
