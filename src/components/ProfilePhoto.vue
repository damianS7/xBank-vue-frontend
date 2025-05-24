<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();

onMounted(() => {
  reloadProfileImg();
});

const profileImgURL = ref("");

watch(
  () => customerStore.customer.profile?.photoPath,
  () => {
    reloadProfileImg();
  },
  { immediate: true }
);

// updates the photoUrl
function reloadProfileImg() {
  const profilePhotoURL = localStorage.getItem("profilePhotoURL");
  if (profilePhotoURL) {
    profileImgURL.value = profilePhotoURL;
  }
}
</script>
<template>
  <img v-if="profileImgURL" :src="profileImgURL" />
</template>
