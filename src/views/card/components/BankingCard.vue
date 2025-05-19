<script setup lang="ts">
import { defineProps } from "vue";
import { BankingCard } from "@/types/BankingCard";

const props = defineProps<{
  card: BankingCard;
}>();
</script>
<template>
  <div
    class="bg-gradient-to-br from-cyan-900 to-cyan-500 p-4 rounded-md shadow h-28 w-44 sm:h-36 sm:w-72 overflow-hidden truncate"
  >
    <!-- Segunda línea: Número de cuenta + saldo -->
    <div class="flex justify-between items-center">
      <span class="sm:text-lg font-semibold text-gray-800">
        {{ card.cardNumber }}
      </span>
    </div>
    <!-- Primera línea: Alias + etiquetas -->
    <div class="flex justify-between items-center">
      <div class="flex gap-2">
        <span
          class="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded"
        >
          {{ card.cardType }}
        </span>
        <span
          class="bg-blue-100 text-blue-800 text-sm font-bold px-2 py-1 rounded"
        >
          {{ card.cardPIN }}
        </span>
        <span class="bg-blue-100 text-blue-800 text-sm font-bold py-1 rounded">
          {{ card.cardStatus }}
        </span>
      </div>
    </div>
  </div>
</template>
