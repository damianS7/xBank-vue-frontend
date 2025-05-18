<script setup lang="ts">
import FullScreenLoadingSpinner from "@/components/FullScreenLoadingSpinner.vue";
import Sidebar from "@/layouts/SidebarLayout.vue";
import Header from "@/components/HeaderBar.vue";
import { onMounted, ref } from "vue";
import { useCustomerStore } from "@/stores/customer";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
const authStore = useAuthStore();
const accountStore = useAccountStore();

const customerStore = useCustomerStore();
const tokenValidationInterval = setInterval(checkIfTokenIsValid, 3 * 1000);
const router = useRouter();
let initialized = ref(false);

async function checkIfTokenIsValid() {
  const token = authStore.token;

  if (!authStore.validateToken(token)) {
    initialized.value = false;
    clearInterval(tokenValidationInterval);
    await authStore.logout();
    await wait();
    router.push("/auth/login");
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function wait() {
  await sleep(1000); // Espera 2 segundos
}

onMounted(async () => {
  await wait();
  await customerStore.initialize();
  await accountStore.initialize();
  initialized.value = true;
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
