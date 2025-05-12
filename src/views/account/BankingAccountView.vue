<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";

import {
  BankingAccountType,
  BankingAccountCurrency,
} from "@/types/BankingAccount";
const accountTypes: BankingAccountType[] = ["SAVINGS", "CHECKING"];
const accountCurrencies: BankingAccountCurrency[] = ["USD", "EUR"];
const accountStore = useAccountStore();
const authStore = useAuthStore();
const showModal = ref(false);
const newAccount = ref({
  type: "CHECKING",
  currency: "USD",
});

function submitOpenAccount() {
  showModal.value = false;
  accountStore.openBankingAccount(
    newAccount.value.type,
    newAccount.value.currency,
    authStore.token
  );
}

onMounted(() => {
  accountStore.initialize();
});
</script>
<template>
  <div class="home space-y-4 p-4">
    <!-- Botón para abrir una nueva cuenta -->
    <div class="w-full bg-gray-100 rounded p-2 text-right">
      <button
        type="button"
        @click="showModal = true"
        class="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
      >
        Open account
      </button>
    </div>
    <!-- Lista de cuentas -->
    <div
      v-for="account in accountStore.getBankingAccounts"
      :key="account.id"
      class="w-full bg-white rounded shadow p-4"
    >
      <div class="flex justify-between items-center bg-blue-50 p-4 rounded">
        <div>
          <span
            class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
          >
            {{ account.accountType }}
          </span>
          <span
            class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
          >
            {{ account.accountStatus }}
          </span>
          <span
            class="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full"
          >
            {{ account.accountCurrency }}
          </span>
          <p class="text-lg font-semibold">
            {{ account.accountNumber }}
          </p>
          <p class="text-sm text-gray-600">
            <!-- Alias: {{ account?.alias || "Sin alias" }} -->
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm text-gray-500">Saldo</p>
          <p class="text-xl font-bold text-green-600">
            {{ account.balance.toLocaleString() }}
            {{ account.accountCurrency }}
          </p>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 class="text-xl font-semibold mb-4">Abrir nueva cuenta</h2>

          <form @submit.prevent="submitOpenAccount">
            <div class="mb-4">
              <label class="block mb-1">Tipo de cuenta</label>
              <select
                v-model="newAccount.type"
                class="w-full border rounded p-2"
              >
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
                @click="showModal = false"
                class="bg-gray-300 rounded px-4 py-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
