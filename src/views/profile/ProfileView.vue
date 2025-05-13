<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import ErrorAlert from "@/components/ErrorAlert.vue";
import { ref } from "vue";
import { SquarePen, Save, SaveOff } from "lucide-vue-next";
import ConfirmPasswordModal from "./components/ConfirmPasswordModal.vue";
import { useAuthStore } from "@/stores/auth";
const customerStore = useCustomerStore();
const authStore = useAuthStore();
const customer = customerStore.getLoggedCustomer;
const modals = {
  confirmPasswordModal: {
    // password to be input when user wants to modifiy profile
    confirmedPassword: ref(""),
    visible: ref(false),
  },
  changePasswordModal: {
    // new password
    newPassowrd: ref(""),
    // newPassword has to be repeated to establish a new password
    newPasswordConfirmation: ref(""),
  },
};

// message to show
const messageToShow = ref("");

// updatable fields to be displayed
const formFields = ref([
  {
    name: "firstName",
    type: "text",
    placeholder: "First name",
    value: customer.profile?.firstName,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "lastName",
    type: "text",
    placeholder: "Last name",
    value: customer.profile?.lastName,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "email",
    type: "email",
    placeholder: "Email",
    value: customer.email,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "phone",
    type: "text",
    placeholder: "Phone",
    value: customer.profile?.phone,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "gender",
    type: "select",
    placeholder: "Gender",
    value: customer.profile?.gender,
    options: [],
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "birthdate",
    type: "date",
    placeholder: "Birthdate",
    value: customer.profile?.birthdate,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "country",
    type: "text",
    placeholder: "Country",
    value: customer.profile?.country,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "address",
    type: "text",
    placeholder: "Address",
    value: customer.profile?.address,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "postalCode",
    type: "text",
    placeholder: "Postal Code",
    value: customer.profile?.postalCode,
    error: "",
    isEditing: false,
    edited: false,
  },
  {
    name: "nationalId",
    type: "text",
    placeholder: "National ID",
    value: customer.profile?.nationalId,
    error: "",
    isEditing: false,
    edited: false,
  },
]);

// updates a field
async function updateFields(currentPassword: string) {
  modals.confirmPasswordModal.visible.value = false;
  // fields to update
  const fieldsToUpdate = formFields.value
    .filter((field) => field.edited === true)
    .reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {} as Record<string, any>);

  // nothing to update
  if (fieldsToUpdate.length == 0) {
    return;
  }

  if (currentPassword.length == 0) {
    return;
  }

  // request for update
  const response = await customerStore.updateProfile(
    authStore.token,
    currentPassword,
    fieldsToUpdate
  );

  if (response.status === 200) {
    customerStore.setProfile(response.data);
  } else {
    messageToShow.value = response.data.message;
  }

  // we reset the actual password value
  modals.confirmPasswordModal.confirmedPassword.value = "";
}

function validateAndConfirmEditing({ field }) {
  // validate field on the fly???
  // zod
}
</script>
<template>
  <div class="space-y-4 p-4">
    <ErrorAlert
      v-if="messageToShow"
      :message="messageToShow"
      @close="messageToShow = ''"
    />
    <!-- Botón para abrir una nueva cuenta -->
    <div class="w-full bg-gray-100 rounded p-2 text-right">
      <button
        type="button"
        class="bg-blue-600 text-white rounded p-2 hover:bg-blue-700 mr-2"
      >
        Set new password
      </button>
      <button
        type="button"
        class="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        @click="modals.confirmPasswordModal.visible.value = true"
      >
        Save profile
      </button>
    </div>

    <div class="p-4 rounded shadow space-y-2">
      <h1 class="text-2xl font-bold">Perfil del Usuario</h1>

      <div
        v-if="customer.profile"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
      >
        <!-- Foto de perfil -->
        <div class="flex items-center gap-4">
          <img
            v-if="customer.profile?.photoPath"
            :src="customer.profile.photoPath"
            alt="Foto de perfil"
            class="w-24 h-24 rounded-full object-cover border"
          />
          <div
            v-else
            class="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-600"
          >
            No Image
          </div>
        </div>
        <div v-for="(field, index) in formFields" :key="index">
          <p class="text-gray-500 text-sm">{{ field.placeholder }}</p>

          <div
            v-if="!field.isEditing"
            class="flex items-center justify-between font-medium text-lg"
          >
            <span>{{ field.value }}</span>
            <SquarePen
              class="text-blue-500 cursor-pointer"
              @click="field.isEditing = true"
            />
          </div>

          <div v-else class="flex items-center gap-2">
            <input
              :type="field.type"
              class="border rounded p-2 w-full"
              v-model="field.value"
            />
            <Save
              class="text-green-500 cursor-pointer"
              @click="
                () => {
                  field.edited = true;
                  field.isEditing = false;
                }
              "
            />
            <SaveOff
              class="text-red-500 cursor-pointer"
              @click="field.isEditing = false"
            />
          </div>
        </div>
      </div>
      <ConfirmPasswordModal
        v-if="modals.confirmPasswordModal.visible.value"
        :visible="modals.confirmPasswordModal.visible.value"
        @submit="updateFields"
        @close="modals.confirmPasswordModal.visible.value = false"
      />
    </div>
  </div>
</template>
