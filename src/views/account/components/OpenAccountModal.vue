<script setup lang="ts">
import { ref, defineEmits } from "vue";
import {
  BankingAccountType,
  BankingAccountCurrency,
} from "@/types/BankingAccount";
const accountTypes: BankingAccountType[] = ["SAVINGS", "CHECKING"];
const accountCurrencies: BankingAccountCurrency[] = ["USD", "EUR"];
const emit = defineEmits(["submit", "close"]);
// const emit = defineEmits<{
//   (e: "submitOpenAccount", { type, currency }): void;
//   (e: "close"): void;
// }>();
const newAccount = ref({
  type: "CHECKING",
  currency: "USD",
});

function submit() {
  emit("submit", {
    type: newAccount.value.type,
    currency: newAccount.value.currency,
  });
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-xl font-semibold mb-4">Abrir nueva cuenta</h2>

      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block mb-1">Tipo de cuenta</label>
          <select v-model="newAccount.type" class="w-full border rounded p-2">
            <option v-for="type in accountTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block mb-1">Moneda</label>
          <select
            v-model="newAccount.currency"
            class="w-full border rounded p-2"
          >
            <option
              v-for="currency in accountCurrencies"
              :key="currency"
              :value="currency"
            >
              {{ currency }}
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
