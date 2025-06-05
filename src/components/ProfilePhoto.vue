<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useCustomerStore } from "@/stores/customer";
const customerStore = useCustomerStore();

onMounted(() => {
  if (customerStore.customer.profile?.photoPath) {
    reloadProfileImg();
  }
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
  console.log("reloading photo");
  const profilePhotoURL = localStorage.getItem("profilePhotoURL");
  if (profilePhotoURL) {
    profileImgURL.value = profilePhotoURL;
  }
}
</script>
<template>
  <img v-if="customerStore.customer.profile?.photoPath" :src="profileImgURL" />
  <div v-else></div>
</template>
