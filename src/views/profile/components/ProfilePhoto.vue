<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, watch } from "vue";
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();
const emit = defineEmits(["update", "close"]);
const fileInput = ref<HTMLInputElement | null>(null);
const photoUrl = ref("");

const props = defineProps<{
  photoPath: string;
}>();

function showFileDialog() {
  fileInput.value?.click();
}

// gets the customer photo
async function fetchPhoto() {
  const blob = await customerStore.getPhoto(props.photoPath);
  photoUrl.value = URL.createObjectURL(blob);
}

function updatePhoto(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  console.log(file);
  emit("update", file);
  target.value = "";
}

onMounted(async () => {
  // check if there is a photo path set
  if (props.photoPath.length == 0) {
    return;
  }

  // fetch the photo to show
  fetchPhoto();
});

watch(
  () => props.photoPath,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      fetchPhoto();
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
    <!-- Foto de perfil -->
    <div class="md:col-span-2">
      <input type="file" ref="fileInput" class="hidden" @change="updatePhoto" />
      <img
        v-if="photoPath"
        :src="photoUrl"
        alt="Foto de perfil"
        @click="showFileDialog"
        class="w-24 h-24 rounded-full object-cover border cursor-pointer"
      />
      <div
        v-else
        @click.prevent="showFileDialog"
        class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 cursor-pointer"
      >
        No Image
      </div>
    </div>
  </div>
</template>
