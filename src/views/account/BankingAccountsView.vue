<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import ErrorAlert from "@/components/ErrorAlert.vue";
import OpenAccountModal from "@/views/account/components/OpenAccountModal.vue";

const errorMessage = ref("");
const accountStore = useAccountStore();
const authStore = useAuthStore();
const showModal = ref(false);

function submitOpenAccount(type: string, currency: string) {
  showModal.value = false;
  console.log("RECIBIDO", type);
  console.log("RECIBIDO", currency);
  // accountStore.openBankingAccount(type, currency, authStore.token);
}

onMounted(() => {
  accountStore.initialize();
});
</script>
<template>
  <div class="home space-y-4 p-4">
    <ErrorAlert
      v-if="errorMessage"
      :message="errorMessage"
      @close="errorMessage = ''"
    />
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
      <OpenAccountModal
        v-if="showModal"
        :visible="showModal"
        @submit="submitOpenAccount"
        @close="showModal = false"
      />
    </div>
  </div>
</template>
