<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import ErrorAlert from "@/components/ErrorAlert.vue";
import OpenAccountModal from "@/views/account/components/OpenAccountModal.vue";
const accountStore = useAccountStore();
const authStore = useAuthStore();
const errorMessage = ref("");
const showModal = ref(false);

// function to handle the submission of the open account modal
function submitOpenAccount(data: { type: string; currency: string }) {
  showModal.value = false;
  accountStore.openBankingAccount(data.type, data.currency, authStore.token);
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
      class="bg-blue-50 p-4 rounded shadow space-y-2"
    >
      <!-- Primera línea: Alias + etiquetas -->
      <div class="flex justify-between items-center">
        <span class="text-sm font-bold text-gray-700">
          {{ account.alias || "Define an alias" }}
        </span>
        <div class="flex gap-2">
          <span
            class="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded"
          >
            {{ account.accountType }}
          </span>
          <span
            class="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded"
          >
            {{ account.accountStatus }}
          </span>
        </div>
      </div>

      <!-- Segunda línea: Número de cuenta + saldo -->
      <div class="flex justify-between items-center">
        <p class="text-lg font-semibold text-gray-800">
          IBAN {{ account.accountNumber }}
        </p>
        <div class="text-right">
          <p class="text-xl font-bold text-green-600">
            {{ account.balance.toLocaleString() }} {{ account.accountCurrency }}
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <OpenAccountModal
    v-if="showModal"
    :visible="showModal"
    @submit="submitOpenAccount"
    @close="showModal = false"
  />
</template>
