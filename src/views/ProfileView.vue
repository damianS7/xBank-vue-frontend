<script setup lang="ts">
import { onMounted } from "vue";
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();
const customer = customerStore.$state.customer;
const profile = customerStore.$state.customer.profile;

// onMounted(() => {
//   accountStore.initialize();
// });
</script>
<template>
  <div class="max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-6">Perfil del Usuario</h1>

    <div
      v-if="profile"
      class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded shadow p-4"
    >
      <div>
        <p class="text-gray-500 text-sm">Nombre</p>
        <p class="font-medium text-lg">{{ profile?.name }}</p>
      </div>

      <div>
        <p class="text-gray-500 text-sm">Apellido</p>
        <p class="font-medium text-lg">{{ profile?.surname }}</p>
      </div>

      <div>
        <p class="text-gray-500 text-sm">Correo electrónico</p>
        <p class="font-medium text-lg">{{ customer.email }}</p>
      </div>

      <div>
        <p class="text-gray-500 text-sm">Teléfono</p>
        <p class="font-medium text-lg">{{ profile.phone }}</p>
      </div>

      <div class="md:col-span-2">
        <p class="text-gray-500 text-sm">Dirección</p>
        <p class="font-medium text-lg">
          {{ profile.address }}
        </p>
      </div>
    </div>

    <p v-else class="text-gray-500">Cargando perfil...</p>
  </div>
</template>
