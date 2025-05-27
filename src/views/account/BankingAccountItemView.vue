<script setup lang="ts">
import { MessageType } from "@/types/Message";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAccountStore } from "@/stores/account";
import { useAuthStore } from "@/stores/auth";
import MessageAlert from "@/components/MessageAlert.vue";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
import BankingAccount from "@/views/account/components/BankingAccount.vue";
import RequestCardModal from "@/views/account/components/BankingAccountRequestCardModal.vue";
import { set } from "zod";
// message to show
const messageAlert = ref({
  message: "",
  type: MessageType.ERROR,
  timeout: 12,
  visible: false,
});

const route = useRoute();
const accountStore = useAccountStore();
const authStore = useAuthStore();
const account = ref();

// modals to show
const modals = {
  aliasModal: {
    visible: ref(false),
    onConfirm: (value: string) => {
      // nothing
    },
    onCancel: () => {
      // nothing
    },
  },
  pinModal: {
    visible: ref(false),
    onConfirm: (value: string) => {
      // nothing
    },
    onCancel: () => {
      // nothing
    },
  },
  transferToModal: {
    visible: ref(false),
    onConfirm: (value: string) => {
      // nothing
    },
    onCancel: () => {
      // nothing
    },
  },
};

async function openAliasModal(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Abres el modal (puedes usar un ref o store para controlarlo)
    modals.aliasModal.visible.value = true;
    // Registras callbacks
    modals.aliasModal.onConfirm = (alias: string) => {
      modals.aliasModal.visible.value = false;
      resolve(alias);
    };

    modals.aliasModal.onCancel = () => {
      modals.aliasModal.visible.value = false;
      resolve("");
    };
  });
}

function transferTo() {
  // ...
}

async function setAlias(alias: string) {
  // const alias = await openAliasModal();
  console.log(alias);
}

function previousPage() {
  // ...
}
function nextPage() {
  // ...
}

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
    messageAlert.value.message = response.data.message;
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
    messageAlert.value.message = "No se encontró la cuenta bancaria.";
  }
});
</script>
<template>
  <div v-if="account">
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
        <h1
          class="flex flex-col sm:flex-row items-center text-2xl font-bold gap-1"
        >
          <span class="flex items-center">Banking account </span>

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

          <div class="flex flex-wrap gap-1 w-full">
            <button
              @click="transferTo"
              class="btn-small btn-blue sm:w-auto w-full"
            >
              TRANSFER TO
            </button>
            <button
              @click="transferTo"
              class="btn-small btn-blue sm:w-auto w-full"
            >
              REQUEST CARD
            </button>
            <button
              @click="transferTo"
              class="btn-small btn-blue sm:w-auto w-full"
            >
              {{ account?.accountStatus === "OPEN" ? "CLOSE" : "OPEN" }} ACCOUNT
            </button>
          </div>
        </h1>
      </div>

      <div class="">
        <BankingAccount
          v-if="account"
          :account="account"
          @edit="setAlias"
          :editable="true"
        />
      </div>

      <div class="mt-6 p-4 bg-white rounded-xl shadow-md w-full mx-auto">
        <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          TRANSACTIONS
        </h3>
        <ul class="space-y-2">
          <li
            v-for="(transaction, index) in account?.bankingAccountTransactions"
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
          class="flex justify-end items-center mt-4 p-0 text-white bg-blue-500 rounded-lg"
        >
          <button class="btn cursor-pointer" @click="previousPage">
            <ChevronLeft />
          </button>
          <span> 1/2 </span>
          <button class="btn cursor-pointer" @click="nextPage">
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else>Loading account</div>

  <!-- <RequestBankingCardModal
    v-if="modals.bankingCard.visible.value"
    :visible="modals.bankingCard.visible.value"
    @submit="requestCard"
    @close="modals.bankingCard.visible.value = false"
  /> -->
</template>
