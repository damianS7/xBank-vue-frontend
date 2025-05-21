<script setup lang="ts">
import ErrorAlert from "@/components/ErrorAlert.vue";
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

onMounted(() => {
  const cardId = parseInt(route.params.id as string, 10);
  // account.value = accountStore.getBankingAccount.find(
  //   (a) => a.id === accountId
  // );
  card.value = accountStore.getBankingCard(cardId);

  if (!card.value) {
    messageAlert.value.message = "No se encontró la tarjeta.";
  }
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
      <h1 class="text-2xl font-bold">User Card</h1>

      <div class="flex md:items-center md:justify-center">
        <div class="grid grid-cols-2 gap-1">
          <div class="col-span-2 md:col-span-1">
            <BankingCardFront class="md:w-72 shadow" v-if="card" :card="card" />
          </div>
          <div class="col-span-2 md:col-span-1">
            <BankingCardBack class="md:w-72 shadow" v-if="card" :card="card" />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center mt-4 text-white p-1 rounded">
        <button class="bg-stone-300 px-1 mx-1 rounded">SET PIN</button>
        <button class="bg-stone-300 px-1 mx-1 rounded">SHOW PIN</button>
        <button class="bg-stone-300 px-1 mx-1 rounded">SHOW CVV</button>
        <button class="bg-stone-300 px-1 mx-1 rounded">
          ENABLE / DISABLE CARD
        </button>
        <button class="bg-stone-300 px-1 mx-1 rounded">
          ENABLE / DISABLE NFC
        </button>
        <button class="bg-stone-300 px-1 mx-1 rounded">SET DAILY LIMIT</button>
      </div>

      <div class="flex items-center justify-center mt-4 text-white p-1 rounded">
        <h1>TRANSACCIONES</h1>
        <p>ssasdsa</p>
      </div>
    </div>
  </div>
</template>
