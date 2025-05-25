<script setup lang="ts">
import MessageAlert from "@/components/MessageAlert.vue";
import BankingAccount from "@/views/account/components/BankingAccount.vue";
import { onMounted, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import { MessageType } from "@/types/Message";
import OpenAccountModal from "@/views/account/components/OpenAccountModal.vue";

// message to show
const messageAlert = ref({
  message: "",
  type: MessageType.ERROR,
  timeout: 12,
  visible: false,
});

const accountStore = useAccountStore();
const authStore = useAuthStore();

const showModal = ref(false);

// function to handle the submission of the open account modal
function submitOpenAccount(data: { type: string; currency: string }) {
  showModal.value = false;
  accountStore.openBankingAccount(data.type, data.currency, authStore.token);
}

onMounted(() => {
  // accountStore.initialize();
});
</script>
<template>
  <div>
    <MessageAlert
      v-if="messageAlert.message"
      class="mb-6"
      :message="messageAlert.message"
      :timeout="messageAlert.timeout"
      :type="messageAlert.type"
      @close="messageAlert.message = ''"
    />

    <div class="flex justify-end rounded gap-1 mb-6">
      <button type="button" @click="showModal = true" class="btn btn-blue">
        Open account
      </button>
    </div>

    <div class="main-container">
      <section
        class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-1"
      >
        <h1>Accounts</h1>
        <div class="flex flex-wrap gap-1 text-sm"></div>
      </section>

      <div v-for="account in accountStore.getBankingAccounts" :key="account.id">
        <router-link :to="`/account/${account.id}`">
          <BankingAccount :account="account" />
        </router-link>
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
