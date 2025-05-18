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
    <div class="w-full bg-gray-100 rounded p-2 text-right">
      <button
        type="button"
        class="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 mr-2"
        @click="modals.bankingCard.visible.value = true"
      >
        Cancel Card
      </button>
    </div>
    <BankingCard v-if="card" :card="card" />
  </div>
</template>
