<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import ErrorAlert from "@/components/ErrorAlert.vue";
import { ref } from "vue";
import { SquarePen, Save, SaveOff } from "lucide-vue-next";
import ConfirmPasswordModal from "./components/ConfirmPasswordModal.vue";
import ChangePasswordModal from "./components/ChangePasswordModal.vue";
import { useAuthStore } from "@/stores/auth";
import { GenderType } from "@/types/Profile";
const customerStore = useCustomerStore();
const authStore = useAuthStore();
const customer = customerStore.getLoggedCustomer;
const genderTypes: GenderType[] = ["MALE", "FEMALE"];
const genderOptions = genderTypes.map((value) => ({
  value,
  label: value.charAt(0) + value.slice(1).toLowerCase(),
}));
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
    visible: ref(false),
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
    value: ref(customerStore.customer.profile?.firstName),
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
    options: genderOptions,
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

function updateProfile(currentPassword: string) {
  // const currentPassword = ConfirmPasswordModal
  updateFields(currentPassword);
  updatePhoto(currentPassword);
}

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

// change the password
async function changePassword(currentPassword: string, newPassword: string) {
  modals.changePasswordModal.visible.value = false;

  // nothing to update
  if (currentPassword.length == 0 || newPassword.length == 0) {
    return;
  }

  // request for update
  const response = await customerStore.changePassword(
    authStore.token,
    currentPassword,
    newPassword
  );

  if (response.status !== 200) {
    if (response.data.errors) {
      messageToShow.value = response.data.errors?.newPassword;
    } else {
      messageToShow.value = response.data.message;
    }
  }

  if (response.status == 200) {
    messageToShow.value = "Password updated.";
  }

  // we reset the actual password value
  modals.changePasswordModal.newPassowrd.value = "";
  modals.changePasswordModal.newPasswordConfirmation.value = "";
}

async function updatePhoto(currentPassword: string) {
  modals.confirmPasswordModal.visible.value = false;

  if (currentPassword.length == 0) {
    return;
  }

  // request for update
  const response = await customerStore.changeAvatar(
    authStore.token,
    currentPassword,
    selectedFile.value
  );

  if (response.status === 200) {
    customerStore.setProfile(response.data);
  } else {
    messageToShow.value = response.data.message;
  }

  // we reset the actual password value
  modals.confirmPasswordModal.confirmedPassword.value = "";
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  selectedFile.value = file;
}

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);

function showFileDialog() {
  fileInput.value?.click();
}
function validateAndConfirmEditing({ field }) {
  // validate field on the fly???
  // zod
}

const photoUrl = ref("");
async function fetchPhoto() {
  const token = authStore.token;
  const path = "http://localhost:8080/api/v1/profiles/photo/";

  const photo = customer.profile.photoPath;

  const blob = await customerStore.getPhoto(token, photo);

  photoUrl.value = URL.createObjectURL(blob);
}
</script>
<template>
  <div>
    <ErrorAlert
      v-if="messageToShow"
      :message="messageToShow"
      @close="messageToShow = ''"
    />
    <!-- Botón para abrir una nueva cuenta -->
    <div class="flex justify-end rounded gap-2">
      <button
        type="button"
        class="bg-blue-600 text-white rounded px-1 hover:bg-blue-700"
        @click="modals.changePasswordModal.visible.value = true"
      >
        Change password
      </button>
      <button
        type="button"
        class="bg-blue-600 text-white rounded px-1 hover:bg-blue-700"
        @click="modals.confirmPasswordModal.visible.value = true"
      >
        Save profile
      </button>
      <button
        type="button"
        class="bg-blue-600 text-white rounded px-1 hover:bg-blue-700"
        @click="fetchPhoto"
      >
        LOAD PHOTO
      </button>
    </div>

    <div class="p-4 mt-6 rounded bg-blue-50 shadow">
      <h1 class="text-2xl font-bold">User profile</h1>

      <div
        v-if="customerStore.customer.profile"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
      >
        <!-- Foto de perfil -->
        <div class="flex items-center gap-4 cursor-pointer">
          <input
            type="file"
            ref="fileInput"
            class="hidden"
            @change="handleFileChange"
          />
          <img
            v-if="customer.profile?.photoPath"
            :src="photoUrl"
            alt="Foto de perfil"
            @click="showFileDialog"
            class="w-24 h-24 rounded-full object-cover border"
          />
          <div
            v-else
            @click.prevent="showFileDialog"
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
              v-if="field.type !== 'select'"
              :type="field.type"
              class="border rounded p-2 w-full"
              v-model="field.value"
            />
            <select
              v-if="field.type === 'select'"
              v-model="field.value"
              :name="field.name"
              class="border rounded p-2 w-full"
            >
              <option
                v-for="option in field.options"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
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
        @submit="updateProfile"
        @close="modals.confirmPasswordModal.visible.value = false"
      />
      <ChangePasswordModal
        v-if="modals.changePasswordModal.visible.value"
        :visible="modals.changePasswordModal.visible.value"
        @submit="changePassword"
        @close="modals.changePasswordModal.visible.value = false"
      />
    </div>
  </div>
</template>
