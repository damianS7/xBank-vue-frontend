<script setup lang="ts">
import MessageAlert from "@/components/MessageAlert.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import BankingCardFront from "@/views/card/components/BankingCardFront.vue";
import BankingCardBack from "@/views/card/components/BankingCardBack.vue";
import { MessageType } from "@/types/Message";
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
  console.log("STATUS", card.value.cardStatus);
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
        <button
          @click="setPin"
          class="w-full text-sm sm:w-auto bg-stone-300 px-1 mx-1 rounded"
        >
          SET PIN
        </button>
        <button
          @click="enableDisableCard"
          class="w-full sm:w-auto bg-stone-300 px-1 mx-1 rounded"
        >
          {{ card?.cardStatus === "ENABLED" ? "DISABLE" : "ENABLE" }} CARD
        </button>
        <button class="w-full sm:w-auto bg-stone-300 px-1 mx-1 rounded">
          ENABLE / DISABLE NFC
        </button>
        <button class="w-full sm:w-auto bg-stone-300 px-1 mx-1 rounded">
          SET DAILY LIMIT
        </button>
      </div>

      <div class="flex mt-4 p-1 rounded">
        <h1>TRANSACCIONES</h1>
        <!-- <p v-for="(transaction, index) in card.transactions" :key="index">
          {{ transaction }}
        </p> -->
      </div>
    </div>
  </div>
</template>
