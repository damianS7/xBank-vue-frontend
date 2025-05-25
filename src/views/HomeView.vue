<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();
</script>
<template>
  <div class="main-container flex flex-col gap-4">
    <!-- Balance -->
    <div class="flex justify-between w-full bg-stone-200 rounded p-4">
      <span>Balance</span>
      <span>{{ accountStore.totalBalance }}</span>
    </div>

    <!-- Accounts and Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex justify-between bg-stone-200 rounded p-4">
        <span>Accounts</span>
        <span>{{ accountStore.countAccounts }}</span>
      </div>
      <div class="flex justify-between bg-stone-200 rounded p-4">
        <span>Cards</span>
        <span>{{ accountStore.countCards }}</span>
      </div>
      <p>Meter 2 o 3 graficos</p>
    </div>

    <!-- Products -->
    <div class="w-full bg-stone-200 rounded p-4">Products</div>
  </div>
</template>
