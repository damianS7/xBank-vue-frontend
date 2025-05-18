<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import MessageAlert from "@/components/MessageAlert.vue";
import BankingCard from "@/views/card/components/BankingCard.vue";
import { MessageType } from "@/types/Message";
const accountStore = useAccountStore();
const messageAlert = ref({
  message: "",
  type: "ERROR" as MessageType,
});

onMounted(() => {
  // accountStore.initialize();
});
</script>
<template>
  <div class="grid md:grid-cols-2 gap-2 justify-items-center">
    <MessageAlert
      v-if="messageAlert.message"
      :message="messageAlert.message"
      :type="messageAlert.type"
      @close="messageAlert.message = ''"
    />

    <!-- Lista de cards -->
    <router-link
      v-for="card in accountStore.getBankingCards"
      :key="card.id"
      :to="`/card/${card.id}`"
    >
      <BankingCard :card="card" />
    </router-link>
  </div>
</template>
