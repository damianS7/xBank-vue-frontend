<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { BankingCardType } from "@/types/BankingCard";
const cardTypes: BankingCardType[] = ["CREDIT", "DEBIT"];
const emit = defineEmits(["submit", "close"]);
const newCard = ref({
  type: "DEBIT",
});

function submit() {
  emit("submit", newCard.value.type);
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Card request</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1">Card type</label>
          <select v-model="newCard.type" class="w-full border rounded p-2">
            <option v-for="type in cardTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
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
