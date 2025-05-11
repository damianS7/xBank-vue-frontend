<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <main class="flex-1 bg-white">
      <Header></Header>
      <router-view class="p-6" />
    </main>
  </div>
</template>
<script setup lang="ts">
import Sidebar from "@/layouts/SidebarLayout.vue";
import Header from "@/components/HeaderBar.vue";
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.default-layout {
}
</style>
