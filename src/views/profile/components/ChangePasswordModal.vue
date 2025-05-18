<script setup lang="ts">
import { ref, defineEmits } from "vue";
import ErrorAlert from "@/components/ErrorAlert.vue";
const emit = defineEmits(["submit", "close"]);
const formFields = ref([
  {
    name: "current-password",
    type: "password",
    placeholder: "Current password",
    value: "",
    error: "",
    isEditing: false,
  },
  {
    name: "new-password",
    type: "password",
    placeholder: "New password",
    value: "",
    error: "",
    isEditing: false,
  },
  {
    name: "password-repeated",
    type: "password",
    placeholder: "Repeat password",
    value: "",
    error: "",
    isEditing: false,
  },
]);

// message to show
const messageToShow = ref("");

function submit() {
  const currentPassword = formFields.value[0].value;
  const newPassword = formFields.value[1].value;
  const repeatPassword = formFields.value[2].value;

  console.log(currentPassword.length);
  if (
    currentPassword.length == 0 ||
    newPassword.length == 0 ||
    repeatPassword.length == 0
  ) {
    messageToShow.value = "Fields cannot be empty.";
    return;
  }

  if (newPassword !== repeatPassword) {
    messageToShow.value = "Password must be the same.";
    formFields.value[2].error = "Password must be the same.";
    return;
  }

  emit("submit", currentPassword, newPassword);
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Change password</h2>

      <form @submit.prevent="submit">
        <div v-for="(field, index) in formFields" :key="index" class="mb-4">
          <label class="block mb-1">{{ field.placeholder }}</label>
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
            Confirm
          </button>
        </div>
      </form>
      <ErrorAlert
        v-if="messageToShow"
        class="mt-2"
        :message="messageToShow"
        @close="messageToShow = ''"
      />
    </div>
  </div>
</template>
