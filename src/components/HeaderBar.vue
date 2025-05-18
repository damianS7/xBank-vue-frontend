<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();
</script>
<template>
  <div class="bg-gray-100 w-full p-2 text-right drop-shadow-sm">
    Welcome
    <b class="uppercase">{{ customerStore.customer.profile?.firstName }}</b>
  </div>
</template>
