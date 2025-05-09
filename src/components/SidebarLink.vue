<template>
  <RouterLink
    :to="to"
    class="flex items-center gap-3 p-2 rounded hover:bg-gray-200 transition-colors"
  >
    <span class="text-lg">
      <component :is="icon" class="w-5 h-5" />
    </span>
    <span class="sidebar-label hidden group-hover:inline">{{ label }}</span>
  </RouterLink>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  to: string;
  icon?: any;
  label: string;
}>();
</script>
