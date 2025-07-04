<script setup lang="ts">
import { useAccountStore } from "@/stores/account";
import { computed } from "vue";
import { BankingAccountCurrencies as currencies } from "@/types/BankingAccount";
import BankingAccountCurrencyChart from "@/components/BankingAccountCurrencyChart.vue";

const accountStore = useAccountStore();
const accounts = computed(() => accountStore.getBankingAccounts);

function totalBalance(currency: string) {
  return accounts.value.reduce((total, account) => {
    return account.accountCurrency === currency
      ? total + account.balance
      : total;
  }, 0);
}
</script>
<template>
  <div v-if="accounts" class="main-container flex flex-col gap-4">
    <!-- Balance -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 bg-gray-50 gap-4 p-4 shadow rounded"
    >
      <h3 class="font-semibold md:col-span-2">Account balances</h3>
      <div
        v-for="(currency, index) in currencies"
        :key="index"
        class="flex flex-col my-1 p-1 rounded"
      >
        <div>
          <BankingAccountCurrencyChart :currency="currency" />
        </div>
        <div class="flex justify-between mt-4 py-1 px-4 text-sm">
          <span>Total</span>
          <span class="text-green-600 justify-end">
            {{ totalBalance(currency) }} {{ currency }}
          </span>
        </div>
      </div>
    </div>

    <!-- Accounts and Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex justify-between bg-gray-50 rounded p-4 shadow">
        <span>Accounts</span>
        <span>{{ accountStore.countAccounts }}</span>
      </div>
      <div class="flex justify-between bg-gray-50 rounded p-4 shadow">
        <span>Cards</span>
        <span>{{ accountStore.countCards }}</span>
      </div>
    </div>
  </div>
</template>
