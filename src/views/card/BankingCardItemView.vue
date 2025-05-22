<script setup lang="ts">
import MessageAlert from "@/components/MessageAlert.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import BankingCardFront from "@/views/card/components/BankingCardFront.vue";
import BankingCardBack from "@/views/card/components/BankingCardBack.vue";
import { MessageType } from "@/types/Message";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
const route = useRoute();
const accountStore = useAccountStore();
const authStore = useAuthStore();
const card = ref();

// message to show
const messageAlert = ref({
  message: "",
  type: MessageType.ERROR,
  timeout: 12,
  visible: false,
});

const modals = {
  bankingCard: {
    visible: ref(false),
  },
};

function enableDisableCard() {
  if (card.value) {
    const newStatus =
      card.value.cardStatus === "ENABLED" ? "DISABLED" : "ENABLED";
    // accountStore.updateBankingCardStatus(card.value.id, newStatus);
  }
}

function setPin() {
  //
}
onMounted(() => {
  const cardId = parseInt(route.params.id as string, 10);
  // account.value = accountStore.getBankingAccount.find(
  //   (a) => a.id === accountId
  // );
  card.value = accountStore.getBankingCard(cardId);

  if (!card.value) {
    messageAlert.value.message = "No se encontró la tarjeta.";
  }
  card.value.transactions = [
    {
      description: "Compra en Amazon",
      amount: -50,
    },
    {
      description: "Ingreso de nómina",
      amount: 1500,
    },
    {
      description: "Compra en supermercado",
      amount: -100,
    },
  ];
});
</script>
<template>
  <div>
    <MessageAlert
      v-if="messageAlert.visible"
      class="mb-4"
      :message="messageAlert.message"
      :timeout="messageAlert.timeout"
      :type="messageAlert.type"
      @close="messageAlert.visible = false"
    />

    <div class="p-4 rounded bg-blue-50 shadow">
      <div>
        <h1 class="flex items-center text-2xl font-bold">
          <span class="mr-2">User Card</span>
          <span
            class="text-xs rounded-full px-1"
            :class="{
              'text-red-100 bg-red-500': card?.cardStatus === 'DISABLED',
              'text-green-100 bg-green-500': card?.cardStatus === 'ENABLED',
            }"
            >{{ card?.cardStatus }}
          </span>
        </h1>
      </div>

      <div class="flex justify-center">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div class="flex jusfity-center">
            <BankingCardFront v-if="card" :card="card" />
          </div>
          <div class="flex jusfity-center">
            <BankingCardBack v-if="card" :card="card" />
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-1 mt-2">
        <button @click="setPin" class="btn btn-blue w-full sm:w-auto">
          SET PIN
        </button>
        <button
          @click="enableDisableCard"
          class="btn btn-blue w-full sm:w-auto"
        >
          {{ card?.cardStatus === "ENABLED" ? "DISABLE" : "ENABLE" }} CARD
        </button>
        <button class="btn btn-blue w-full sm:w-auto">
          ENABLE / DISABLE NFC
        </button>
        <button class="btn btn-blue w-full sm:w-auto">SET DAILY LIMIT</button>
      </div>

      <div
        class="mt-6 p-4 bg-white rounded-xl shadow-md w-full max-w-xl mx-auto"
      >
        <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          TRANSACCIONES
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(transaction, index) in card?.transactions"
            :key="index"
            class="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-md"
          >
            <span class="text-sm text-gray-700">{{
              transaction.description
            }}</span>
            <span
              class="text-sm font-medium"
              :class="
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
              "
            >
              {{ transaction.amount > 0 ? "+" : "" }}{{ transaction.amount }}€
            </span>
          </li>
        </ul>
        <div
          class="flex items-center justify-end mt-4 text-white bg-stone-300 p-1 rounded"
        >
          <span class="mx-2">
            <ChevronLeft class="cursor-pointer" />
          </span>
          <span> 1 / 2 </span>
          <span class="mx-2">
            <ChevronRight class="cursor-pointer" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
