<script setup lang="ts">
import { ref, defineEmits } from "vue";
const emit = defineEmits(["submit", "close"]);
const formFields = ref([
  {
    name: "password",
    type: "password",
    placeholder: "Actual password",
    value: "",
    error: "",
    isEditing: false,
  },
]);

function submit() {
  emit("submit", formFields.value[0].value);
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Confirm your password</h2>

      <form @submit.prevent="submit">
        <div v-for="(field, index) in formFields" :key="index" class="mb-4">
          <label class="block mb-1">Actual password</label>
          <input
            :type="field.type"
            class="border rounded p-2 w-full"
            v-model="field.value"
          />
        </div>

        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="emit('close')"
            class="bg-gray-300 rounded px-4 py-2"
          >
            Close
          </button>
          <button
            type="submit"
            class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
