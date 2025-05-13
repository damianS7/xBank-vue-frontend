<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar fijo -->
    <Sidebar />

    <!-- Contenedor principal -->
    <div class="flex-1 flex flex-col">
      <!-- Header fijo -->
      <Header />

      <!-- Contenido scrollable -->
      <div class="flex-1 overflow-auto p-2 bg-white">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Sidebar from "@/layouts/SidebarLayout.vue";
import Header from "@/components/HeaderBar.vue";
import { onMounted } from "vue";
import { useCustomerStore } from "@/stores/customer";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
const accountStore = useAccountStore();
const customerStore = useCustomerStore();

onMounted(() => {
  customerStore.initialize();
  accountStore.initialize();
});
</script>
