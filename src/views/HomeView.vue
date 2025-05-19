<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();
</script>
<template>
  <div class="home space-y-4">
    <!-- Balance -->
    <div class="flex justify-between w-full bg-gray-100 rounded p-4">
      <span>Balance</span>
      <span>{{ accountStore.totalBalance }}</span>
    </div>

    <!-- Accounts and Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex justify-between bg-gray-100 rounded p-4">
        <span>Accounts</span>
        <span>{{ accountStore.countAccounts }}</span>
      </div>
      <div class="flex justify-between bg-gray-100 rounded p-4">
        <span>Cards</span>
        <span>{{ accountStore.countCards }}</span>
      </div>
    </div>

    <!-- Products -->
    <div class="w-full bg-gray-100 rounded p-4">Products</div>
  </div>
</template>
