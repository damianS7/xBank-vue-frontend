<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();
</script>
<template>
  <div class="bg-gray-100 w-full p-2 text-right">
    Welcome
    <b class="uppercase">{{ customerStore.customer.profile?.firstName }}</b>
  </div>
</template>
