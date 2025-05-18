<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();
</script>
<template>
  <div class="home space-y-4">
    <div class="w-full bg-gray-100 rounded p-4">Balance</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-100 rounded p-4">
        Accounts {{ accountStore.countAccounts }}
      </div>
      <div class="bg-gray-100 rounded p-4">Cards</div>
    </div>
    <div class="w-full bg-gray-100 rounded p-4">Products</div>
  </div>
</template>
