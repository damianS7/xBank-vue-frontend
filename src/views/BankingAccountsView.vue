<script setup lang="ts">
import { onMounted } from "vue";
import { useAccountStore } from "@/stores/account";
const accountStore = useAccountStore();

onMounted(() => {
  accountStore.initialize();
});
</script>
<template>
  <div>
    <h1>You have {{ accountStore.countAccounts }} accounts.</h1>
  </div>
</template>
