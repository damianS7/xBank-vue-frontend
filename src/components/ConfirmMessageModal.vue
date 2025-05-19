<script setup lang="ts">
import { ref, defineEmits, defineProps } from "vue";
const emit = defineEmits(["cancel"]);
const props = defineProps<{
  message: string;
}>();
</script>
<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Info</h2>
      <div class="mb-4">
        <p>{{ message }}</p>
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="emit('cancel')"
          class="bg-gray-300 rounded px-4 py-2"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
