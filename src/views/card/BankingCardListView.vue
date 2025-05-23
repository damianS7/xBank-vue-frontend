<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useCardStore } from "@/stores/card";
import BankingCardFront from "@/views/card/components/BankingCardFront.vue";
import { ChevronRight, ChevronLeft } from "lucide-vue-next";
const cardStore = useCardStore();
const cards = cardStore.getBankingCards;
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
        <BankingCardFront class="shadow-md w-full" :card="currentCard" />
      </router-link>
    </div>

    <div class="flex items-center mt-4 p-0 text-white bg-blue-500 rounded-lg">
      <button class="btn-sm cursor-pointer" @click="previousCard">
        <ChevronLeft />
      </button>
      <span> {{ currentCardIndex + 1 }} / {{ cards.length }} </span>
      <button class="btn-sm cursor-pointer" @click="nextCard">
        <ChevronRight />
      </button>
    </div>
  </div>
</template>
