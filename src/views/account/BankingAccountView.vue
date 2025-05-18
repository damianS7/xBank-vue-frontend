<script setup lang="ts">
import ErrorAlert from "@/components/ErrorAlert.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import RequestBankingCardModal from "@/views/account/components/RequestBankingCardModal.vue";
const errorMessage = ref("");
const route = useRoute();
const accountStore = useAccountStore();
const authStore = useAuthStore();
const account = ref();

const modals = {
  bankingCard: {
    visible: ref(false),
  },
};

async function requestCard(cardType: string) {
  // hide modal
  modals.bankingCard.visible.value = false;

  // account id from url
  const accountId = parseInt(route.params.id[0]);

  // token
  const token = authStore.token;

  // petition
  const response = await accountStore.requestBankingCard(
    token,
    accountId.toString(),
    cardType
  );

  if (response.status !== 201 && response.data.error) {
    errorMessage.value = response.data.message;
    return;
  }

  accountStore.addCard(accountId, response.data);
}

onMounted(() => {
  const accountId = parseInt(route.params.id as string, 10);
  // account.value = accountStore.getBankingAccount.find(
  //   (a) => a.id === accountId
  // );
  account.value = accountStore.getBankingAccount(accountId);
  if (!account.value) {
    errorMessage.value = "No se encontró la cuenta bancaria.";
  }
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
        class="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 mr-2"
      >
        Transfer to
      </button>
      <button
        type="button"
        class="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 mr-2"
        @click="modals.bankingCard.visible.value = true"
      >
        Solicit Card
      </button>
      <button
        type="button"
        class="bg-red-600 text-white rounded p-2 hover:bg-blue-700"
      >
        Close account
      </button>
    </div>
    <div>
      <div v-if="account" class="bg-blue-50 p-6 rounded shadow-md space-y-4">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">
            {{ account.alias || "Define an alias" }}
          </h2>
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
            <span
              class="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded"
            >
              {{ account.accountCurrency }}
            </span>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <p class="text-lg font-semibold text-gray-700">
            Número de cuenta: {{ account.accountNumber }}
          </p>
          <p class="text-xl font-bold text-green-600">
            Saldo: {{ account.balance.toLocaleString() }}
            {{ account.accountCurrency }}
          </p>
        </div>

        <p class="text-sm text-gray-500">ID interno: {{ account.id }}</p>
        <p class="text-sm text-gray-500">
          Creado: {{ account.createdAt }} | Actualizado: {{ account.updatedAt }}
        </p>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <RequestBankingCardModal
    v-if="modals.bankingCard.visible.value"
    :visible="modals.bankingCard.visible.value"
    @submit="requestCard"
    @close="modals.bankingCard.visible.value = false"
  />
</template>
