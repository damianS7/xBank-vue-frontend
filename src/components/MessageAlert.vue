<script setup lang="ts">
import { defineProps, defineEmits, onMounted, onUnmounted, ref } from "vue";
import { MessageType } from "@/types/Message";
const emit = defineEmits(["close"]);
const visible = ref(true);

const props = defineProps<{
  message: string;
  type: MessageType;
  timeout: number;
}>();

onMounted(() => {
  setTimeout(() => {
    visible.value = false;

    setTimeout(() => {
      emit("close");
    }, 500);
  }, props.timeout * 1000);
});
</script>
<template>
  <div
    class="flex items-center border px-4 py-3 rounded relative transition-opacity duration-500"
    :class="[
      type === MessageType.INFO && 'bg-blue-100 border-blue-400 text-blue-700',
      type === MessageType.ERROR && 'bg-red-100 border-red-400 text-red-700',
      type === MessageType.SUCCESS &&
        'bg-green-100 border-green-400 text-green-700',
      visible ? 'opacity-100' : 'opacity-0',
    ]"
    role="alert"
  >
    <span class="block sm:inline ml-2">{{ message }}</span>
    <button
      type="button"
      class="absolute top-0 bottom-0 right-0 px-4 py-3"
      @click="emit('close')"
    >
      <svg class="fill-current h-6 w-6 text-red-500" viewBox="0 0 20 20">
        <title>Close</title>
        <path
          d="M14.348 5.652a1 1 0 10-1.414-1.414L10 7.586 7.066 4.652a1 1 0 00-1.414 1.414L8.586 10l-2.934 2.934a1 1 0 101.414 1.414L10 12.414l2.934 2.934a1 1 0 001.414-1.414L11.414 10l2.934-2.934z"
        />
      </svg>
    </button>
  </div>
</template>
