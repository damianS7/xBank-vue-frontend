<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAccountStore } from "@/stores/account";
import BankingCardFront from "@/views/card/components/BankingCardFront.vue";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
const accountStore = useAccountStore();
const cards = accountStore.getBankingCards;
const currentCardIndex = ref(0);
const currentCard = computed(() => {
  return cards[currentCardIndex.value];
});

function previousCard() {
  if (currentCardIndex.value <= 0) {
    return;
  }
  currentCardIndex.value--;
}

function nextCard() {
  console.log("next", currentCardIndex);
  if (currentCardIndex.value >= cards.length - 1) {
    return;
  }
  currentCardIndex.value++;
}

onMounted(() => {
  // accountStore.initialize();
});
</script>
<template>
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-col items-center">
      <router-link :to="`/card/${currentCard.id}`">
        <BankingCardFront class="shadow-md" :card="currentCard" />
      </router-link>
    </div>

    <div class="flex items-center mt-4 text-white bg-stone-300 p-1 rounded">
      <span class="mx-2">
        <ChevronLeft class="cursor-pointer" @click="previousCard" />
      </span>
      <span> {{ currentCardIndex + 1 }} / {{ cards.length }} </span>
      <span class="mx-2">
        <ChevronRight class="cursor-pointer" @click="nextCard" />
      </span>
    </div>
  </div>
</template>
