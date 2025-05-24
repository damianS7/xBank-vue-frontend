<script setup lang="ts">
import MessageAlert from "@/components/MessageAlert.vue";
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCardStore } from "@/stores/card";
import BankingCardFront from "@/views/card/components/BankingCardFront.vue";
import BankingCardBack from "@/views/card/components/BankingCardBack.vue";
import { MessageType } from "@/types/Message";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
import BankingCardSetPinModal from "./components/BankingCardSetPinModal.vue";
import BankingCardLockModal from "./components/BankingCardLockModal.vue";
import BankingCardDailyLimitModal from "./components/BankingCardDailyLimitModal.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const isViewReady = ref(false);
const route = useRoute();
const cardStore = useCardStore();

// pagination
const currentPage = ref(0); // Spring usa 0-indexed
const pageSize = 5;
const paginator = ref<any>(null);
// prefetch next transactions so it will be faster
const nextPage = () => {
  if (paginator.value && currentPage.value < paginator.value.totalPages - 1) {
    currentPage.value++;
    fetchTransactions();
  }
};

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
    fetchTransactions();
  }
};

// modals
const setPinModal = ref();
const lockModal = ref();
const dailyLimitModal = ref();

const cardId = parseInt(route.params.id as string, 10);
const card = computed(() => cardStore.getBankingCard(cardId));
// const cardTransactions = computed(() => cardStore.getCardTransactions(cardId));

// message to show
const messageAlert = ref({
  message: "",
  type: MessageType.ERROR,
  timeout: 12,
  visible: false,
});

async function setLock() {
  const cardLocked = card.value?.lockStatus === "LOCKED";

  const userConfirmed = await lockModal.value.open();

  // if user confirmed, enable/disable the card
  if (userConfirmed) {
    // if card is enabled, disable it
    if (cardLocked) {
      // Enable card
      cardStore.setLockStatus(cardId, "UNLOCKED").then((response) => {
        if (response.status === 200 && response.card) {
          messageAlert.value.message = "Card enabled successfully.";
          messageAlert.value.type = MessageType.SUCCESS;
          cardStore.setCard(response.card);
          return;
        }

        messageAlert.value.message =
          "Problem enabling card. " + response.errors?.lockStatus;
        messageAlert.value.type = MessageType.ERROR;
      });
    }

    // if card is disabled, enable it
    if (!cardLocked) {
      // Disable card
      cardStore.setLockStatus(cardId, "LOCKED").then((response) => {
        if (response.status === 200 && response.card) {
          messageAlert.value.message = "Card disabled successfully.";
          messageAlert.value.type = MessageType.SUCCESS;
          cardStore.setCard(response.card);
          return;
        }

        messageAlert.value.message =
          "Problem disabling card. " + response.errors?.lockStatus;
        messageAlert.value.type = MessageType.ERROR;
      });
    }
  }
}

async function setPin() {
  const pin = await setPinModal.value.open();
  if (!pin) {
    return;
  }

  cardStore.setCardPin(cardId, pin).then((response) => {
    if (response.status === 200 && response.card) {
      messageAlert.value.message = "PIN actualizado correctamente.";
      messageAlert.value.type = MessageType.SUCCESS;
      cardStore.setCard(response.card);
      return;
    }

    messageAlert.value.message = "Problem setting pin. " + response.errors?.pin;
    messageAlert.value.type = MessageType.ERROR;
  });
}

async function setDailyLimit() {
  const dailyLimit = await dailyLimitModal.value.open();
  if (!dailyLimit) {
    return;
  }

  cardStore.setDailyLimit(cardId, dailyLimit).then((response) => {
    if (response.status === 200 && response.card) {
      messageAlert.value.message = "Daily limit updated successfully.";
      messageAlert.value.type = MessageType.SUCCESS;
      cardStore.setCard(response.card);
      return;
    }

    messageAlert.value.message =
      "Problem setting daily limit. " + response.errors?.dailyLimit;
    messageAlert.value.type = MessageType.ERROR;
  });
}

async function fetchTransactions() {
  return await cardStore
    .fetchPageableTransactions(cardId, currentPage.value, pageSize)
    .then((response) => {
      if (response.status === 200) {
        // cardStore.setCardTransactions(cardId, response.transactions);
        // messageAlert.value.message = "Transacciones cargadas correctamente.";
        // messageAlert.value.type = MessageType.SUCCESS;
        paginator.value = response.paginator;
      } else {
        messageAlert.value.message = "Error al cargar las transacciones.";
      }
    });
}

onMounted(async () => {
  // if transactions are empty fetch them
  if (card.value?.transactions?.length === 0) {
    // fetch transactions
    fetchTransactions();
  }

  isViewReady.value = true;
});
</script>
<template>
  <div>
    <BankingCardSetPinModal ref="setPinModal" />
    <BankingCardLockModal
      ref="lockModal"
      :cardEnabled="card?.cardStatus === 'ENABLED'"
    />
    <BankingCardDailyLimitModal ref="dailyLimitModal" />
    <MessageAlert
      v-if="messageAlert.message"
      class="mb-6"
      :message="messageAlert.message"
      :timeout="messageAlert.timeout"
      :type="messageAlert.type"
      @close="messageAlert.message = ''"
    />

    <div class="flex flex-wrap justify-end gap-1 mb-6">
      <button @click="setPin" class="btn-sm btn-blue w-full sm:w-auto">
        SET PIN
      </button>
      <button @click="setLock" class="btn-sm btn-blue w-full sm:w-auto">
        {{ card?.lockStatus === "LOCKED" ? "UNLOCK" : "LOCK" }} CARD
      </button>
      <button @click="setDailyLimit" class="btn-sm btn-blue w-full sm:w-auto">
        SET DAILY LIMIT
      </button>
    </div>

    <div v-if="card && isViewReady" class="p-4 rounded bg-blue-100 shadow">
      <div
        class="sm:flex gap-1 items-center text-2xl font-bold border-b border-gray-300 p-1 mb-1"
      >
        <h1>User Card</h1>
        <div class="flex flex-wrap gap-1 text-sm">
          <span
            class="pill-xs"
            :class="{
              'text-red-100 bg-red-500': card?.cardStatus === 'DISABLED',
              'text-green-100 bg-green-500': card?.cardStatus === 'ENABLED',
            }"
            >{{ card?.cardStatus }}
          </span>
          <span
            class="pill-xs"
            :class="{
              'text-gray-100 bg-gray-500': card?.lockStatus === 'LOCKED',
              'text-green-100 bg-green-500': card?.lockStatus === 'UNLOCKED',
            }"
            >{{ card?.lockStatus }}
          </span>
          <span class="pill-xs bg-blue-500 text-blue-100"
            >{{ card?.dailyLimit ? card?.dailyLimit + " LIMIT" : "NO LIMIT" }}
          </span>
        </div>
      </div>

      <div class="flex justify-center my-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-1">
          <div class="flex jusfity-center">
            <BankingCardFront v-if="card" :card="card" />
          </div>
          <div class="flex jusfity-center">
            <BankingCardBack v-if="card" :card="card" />
          </div>
        </div>
      </div>

      <div class="p-4 bg-white rounded-xl shadow-md w-full">
        <h3 class="sm:text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
          TRANSACTIONS
        </h3>
        <ul v-if="paginator?.content?.length > 0" class="space-y-2">
          <li
            v-for="(transaction, index) in paginator?.content"
            :key="index"
            class="flex flex-col sm:flex-row sm:justify-between sm:items-start bg-gray-50 hover:bg-gray-100 p-3 rounded-md"
          >
            <div class="text-sm text-gray-700 sm:w-1/2">
              {{ transaction.description }}
            </div>

            <div class="flex flex-col text-sm font-medium text-right sm:w-1/2">
              <span
                :class="
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                "
              >
                {{ transaction.amount > 0 ? "+" : "" }}{{ transaction.amount }}€
              </span>
              <span class="text-xs text-gray-500">
                {{
                  new Date(transaction.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }}
              </span>
            </div>
          </li>
        </ul>
        <div v-else class="text-center text-gray-500">
          No transactions found.
        </div>
        <div
          class="flex items-center justify-end text-sm mt-4 text-white bg-stone-300 p-1 rounded"
        >
          <span class="mx-2">
            <ChevronLeft @click="previousPage" class="cursor-pointer" />
          </span>
          <span v-if="paginator?.pageable.pageNumber">
            {{ paginator.pageable?.pageNumber + 1 }} /
            {{ paginator.totalPages }}
          </span>
          <span class="mx-2">
            <ChevronRight @click="nextPage" class="cursor-pointer" />
          </span>
        </div>
      </div>
    </div>
    <div v-else>
      <LoadingSpinner v-if="!isViewReady" />
    </div>

    <div
      v-if="!card && isViewReady"
      class="flex justify-center items-center p-4 rounded shadow bg-red-50"
    >
      <div class="text-center">
        <h1 class="text-2xl font-bold mb-4">Card not found</h1>
        <p class="text-red-600">Please check the card ID and try again.</p>
        <p class="text-red-600">
          If you think this is a mistake, please contact support.
        </p>
      </div>
    </div>
  </div>
</template>
<style></style>
