<template>
  <div class="flex min-h-screen">
    <Sidebar class="w-64 bg-gray-100 p-4 shadow-md" />
    <main class="flex-1 p-6 bg-white">
      <router-view />
    </main>
  </div>
</template>
<script setup lang="ts">
import Sidebar from "@/layouts/SidebarLayout.vue";
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.default-layout {
}
</style>
