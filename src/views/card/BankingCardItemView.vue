<script setup lang="ts">
import ErrorAlert from "@/components/ErrorAlert.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import BankingCard from "@/views/card/components/BankingCard.vue";
import { MessageType } from "@/types/Message";
const route = useRoute();
const accountStore = useAccountStore();
const authStore = useAuthStore();
const card = ref();
const messageAlert = ref({
  message: "",
  type: "ERROR" as MessageType,
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
      v-if="messageAlert.message"
      :message="messageAlert.message"
      :type="messageAlert.type"
      @close="messageAlert.message = ''"
    />
    <!-- Botón para abrir una nueva cuenta -->
    <div class="flex justify-end rounded gap-1 p-1">
      <button
        type="button"
        class="bg-blue-600 text-white rounded px-1 hover:bg-blue-700"
        @click="modals.bankingCard.visible.value = true"
      >
        Cancel Card
      </button>
      <button
        type="button"
        class="bg-blue-600 text-white rounded px-1 hover:bg-blue-700"
        @click="modals.bankingCard.visible.value = true"
      >
        Cancel Card
      </button>
    </div>
    <BankingCard v-if="card" :card="card" />
  </div>
</template>
