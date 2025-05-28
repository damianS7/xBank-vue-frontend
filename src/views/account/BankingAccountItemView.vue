<script setup lang="ts">
import { MessageType } from "@/types/Message";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useCardStore } from "@/stores/card";
import { useAuthStore } from "@/stores/auth";
import MessageAlert from "@/components/MessageAlert.vue";
import BankingAccountTransactions from "@/views/account/components/BankingAccountTransactions.vue";
import BankingAccount from "@/views/account/components/BankingAccount.vue";
import RequestBankingCardModal from "@/views/account/components/BankingAccountRequestCardModal.vue";
import ConfirmPasswordModal from "@/components/ConfirmPasswordModal.vue";
import BankingAccountCards from "@/views/account/components/BankingAccountCards.vue";
import { set } from "zod";
const route = useRoute();
const accountId = parseInt(route.params.id as string, 10);

// message to show
const messageAlert = ref({
  message: "",
  type: MessageType.ERROR,
  timeout: 12,
  visible: false,
});

const accountStore = useAccountStore();
const cardStore = useCardStore(); // Assuming cardStore is also part of accountStore
const authStore = useAuthStore();
const account = ref();

// modals to show
const modals = {
  requestCard: ref(),
  transfer: ref(),
  confirmPassword: ref(),
};

function transferTo() {
  // ...
}

// Set alias for the banking account
async function setAlias(alias: string) {
  if (alias.length < 5) {
    messageAlert.value.message = "Alias must be at least 5 characters long.";
    messageAlert.value.type = MessageType.ERROR;
    return;
  }

  await accountStore
    .setAlias(accountId.toString(), alias)
    .then((account) => {
      accountStore.setAccount(account);
    })
    .catch((error) => {
      messageAlert.value.message = error.message || "Error modifying alias.";
      messageAlert.value.type = MessageType.ERROR;
    });
}

// Request a new banking card
async function requestCard() {
  const cardType = await modals.requestCard.value.open();
  if (!cardType) {
    return;
  }

  await accountStore
    .requestBankingCard(accountId.toString(), cardType)
    .then((card) => {
      cardStore.addCard(card);
    })
    .catch((error) => {
      messageAlert.value.message = error.message || "Error requesting card.";
      messageAlert.value.type = MessageType.ERROR;
    });
}

async function closeAccount(): Promise<void> {
  const password = await modals.confirmPassword.value.open();

  if (!password) {
    return;
  }
  await accountStore
    .closeBankingAccount(accountId.toString(), password)
    .then((account) => {
      messageAlert.value.message = "Account closed successfully.";
      messageAlert.value.type = MessageType.SUCCESS;
      // TODO no reactive
      accountStore.setAccount(account);
    })
    .catch((error) => {
      messageAlert.value.message = error.message || "Error closing account.";
      messageAlert.value.type = MessageType.ERROR;
    });
}

onMounted(() => {
  account.value = accountStore.getBankingAccount(accountId);
  // isViewReady.value = true;
});
</script>
<template>
  <div v-if="account">
    <RequestBankingCardModal :ref="modals.requestCard" />
    <ConfirmPasswordModal :ref="modals.confirmPassword" />
    <MessageAlert
      v-if="messageAlert.message"
      class="mb-6"
      :message="messageAlert.message"
      :timeout="messageAlert.timeout"
      :type="messageAlert.type"
      @close="messageAlert.message = ''"
    />

    <div class="flex flex-col sm:flex-row sm:justify-end gap-1 mb-6">
      <button @click="transferTo" class="btn-sm btn-blue">TRANSFER TO</button>
      <button @click="requestCard" class="btn-sm btn-blue">REQUEST CARD</button>
      <button @click="closeAccount" class="btn-sm btn-blue">
        {{ account?.accountStatus === "OPEN" ? "CLOSE" : "OPEN" }} ACCOUNT
      </button>
    </div>

    <div class="main-container">
      <div>
        <h1
          class="flex flex-col sm:flex-row items-center text-2xl font-bold gap-1"
        >
          <span class="flex items-center">Banking account</span>

          <span
            class="text-xs rounded-full px-1"
            :class="{
              'text-orange-100 bg-orange-500':
                account?.accountStatus === 'CLOSED',
              'text-red-100 bg-red-500': account?.accountStatus === 'SUSPENDED',
              'text-green-100 bg-green-500': account?.accountStatus === 'OPEN',
            }"
            >{{ account?.accountStatus }}
          </span>
        </h1>
      </div>

      <div>
        <BankingAccount
          v-if="account"
          :account="account"
          @edit="setAlias"
          :editable="true"
        />
      </div>

      <div class="my-6">
        <BankingAccountCards :accountId="account.id" />
      </div>

      <div>
        <BankingAccountTransactions :accountId="account.id" />
      </div>
    </div>
  </div>
  <div v-else>Loading account</div>
</template>
