<script setup lang="ts">
import { defineProps } from "vue";
import { useCardStore } from "@/stores/card";
import { BankingAccount } from "@/types/BankingAccount";
import { CreditCard } from "lucide-vue-next";
const cardStore = useCardStore();

const props = defineProps<{
  account: BankingAccount;
}>();
</script>
<template>
  <div class="bg-blue-100 p-4 rounded shadow mt-6">
    <!-- Primera línea: Alias + etiquetas -->
    <div class="flex justify-between items-center">
      <span class="text-sm font-bold text-gray-700">
        {{ account.alias || "No alias" }}
      </span>
      <div class="flex gap-2">
        <span class="flex pill pill-blue">
          {{ cardStore.countCardsByAccount(account.id) }} <CreditCard />
          tooltip
        </span>
        <span class="pill pill-blue">
          {{ account.accountType }}
        </span>
        <span class="pill pill-blue">
          {{ account.accountStatus }}
        </span>
      </div>
    </div>

    <!-- Segunda línea: Número de cuenta + saldo -->
    <div class="flex justify-between items-center">
      <span class="sm:text-lg font-semibold text-gray-800">
        IBAN {{ account.accountNumber }}
      </span>
      <div class="text-right">
        <p class="sm:text-xl font-bold text-green-600">
          {{ account.balance.toLocaleString() }}
          {{ account.accountCurrency }}
        </p>
      </div>
    </div>

    <div class="flex justify-end items-center">
      <span class="text-sm text-gray-800">
        Created on:
        {{
          account.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
          })
        }}
      </span>
    </div>
  </div>
</template>
