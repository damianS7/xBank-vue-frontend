<template>
  <div
    v-if="message"
    class="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <strong class="font-bold">Error:</strong>
    <span class="block sm:inline ml-2">{{ message }}</span>
    <button
      type="button"
      class="absolute top-0 bottom-0 right-0 px-4 py-3"
      @click="$emit('close')"
    >
      <svg class="fill-current h-6 w-6 text-red-500" viewBox="0 0 20 20">
        <title>Cerrar</title>
        <path
          d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.586 7.066 4.652a1 1 0 00-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 12.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934z"
        />
      </svg>
    </button>
  </div>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  message: string;
}>();
</script>
