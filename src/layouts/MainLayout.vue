<script setup lang="ts">
import FullScreenLoadingSpinner from "@/components/FullScreenLoadingSpinner.vue";
import Sidebar from "@/layouts/SidebarLayout.vue";
import Header from "@/components/HeaderBar.vue";
import { onMounted, onUnmounted, ref } from "vue";
import { useCustomerStore } from "@/stores/customer";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
const authStore = useAuthStore();
const accountStore = useAccountStore();
const customerStore = useCustomerStore();
const router = useRouter();
let interval: number;
let initialized = ref(false);
let times = 0;
async function checkIfTokenIsValid() {
  const token = authStore.token;
  const isTokenValid = await authStore.isTokenValid(token);

  console.log("validating token");
  if (!isTokenValid) {
    console.log("logging out for token is invalid", times);
    initialized.value = false;
    await authStore.logout();
    await wait();
    router.push("/auth/login");
  }
  times++;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function wait() {
  await sleep(1000); // Espera 2 segundos
}

onMounted(async () => {
  interval = setInterval(async () => {
    await checkIfTokenIsValid();
  }, 30 * 1000);

  await wait();
  await customerStore.initialize();
  await accountStore.initialize();
  initialized.value = true;
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>
<template>
  <FullScreenLoadingSpinner v-if="!initialized" />
  <div v-if="initialized" class="flex h-screen overflow-hidden">
    <!-- Sidebar fijo -->
    <Sidebar />

    <!-- Contenedor principal -->
    <div class="flex-1 flex flex-col">
      <!-- Header fijo -->
      <Header />

      <!-- Contenido scrollable -->
      <div class="flex-1 overflow-auto bg-gray-50 p-6">
        <router-view />
      </div>
    </div>
  </div>
</template>
