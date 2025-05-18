<script setup lang="ts">
import { useCustomerStore } from "@/stores/customer";
import ErrorAlert from "@/components/ErrorAlert.vue";
import { ref } from "vue";
import ProfileEditableField from "./components/ProfileEditableField.vue";
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
// message to show
const messageToShow = ref("");
const modals = {
  confirmPasswordModal: {
    visible: ref(false),
    onConfirm: (value: string) => {
      // nothing
    },
    onCancel: () => {
      // nothing
    },
  },
  changePasswordModal: {
    // new password
    newPassowrd: ref(""),
    // newPassword has to be repeated to establish a new password
    newPasswordConfirmation: ref(""),
    visible: ref(false),
  },
};

// updatable fields to be displayed
const formFields = ref([
  {
    name: "firstName",
    type: "text",
    placeholder: "First name",
    value: customerStore.customer.profile?.firstName,
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
  {
    name: "password",
    type: "password",
    placeholder: "New password",
    value: "*********",
    error: "",
    isEditing: false,
    edited: false,
  },
]);

async function openConfirmPasswordModal(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Abres el modal (puedes usar un ref o store para controlarlo)
    modals.confirmPasswordModal.visible.value = true;

    // Registras callbacks
    modals.confirmPasswordModal.onConfirm = (password: string) => {
      modals.confirmPasswordModal.visible.value = false;
      resolve(password);
    };

    modals.confirmPasswordModal.onCancel = () => {
      modals.confirmPasswordModal.visible.value = false;
    };
  });
}

// updateds a single field
async function updateField(
  index: number,
  field: { name: string; value: string }
) {
  // wait for the user to input his password
  const currentPassword = await openConfirmPasswordModal();

  // nothing to update
  if (field.value.length == 0 || currentPassword.length == 0) {
    return;
  }

  // request for update
  const response = await customerStore.patchProfile(
    authStore.token,
    currentPassword,
    { [field.name]: field.value }
  );

  if (response.status === 200) {
    customerStore.setProfile(response.data);
  } else {
    messageToShow.value = response.data.message;
  }

  formFields.value[index].value = field.value;
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
    <div class="flex justify-end rounded gap-1 p-1">
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
    </div>

    <div class="p-4 mt-6 rounded bg-blue-50 shadow">
      <h1 class="text-2xl font-bold">User profile</h1>

      <div
        v-if="customerStore.customer.profile"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
      >
        <!-- Foto de perfil -->
        <div class="md:col-span-2 cursor-pointer">
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
          <ProfileEditableField
            :index="index"
            :field="field"
            @update="updateField"
          />
        </div>
      </div>
      <ConfirmPasswordModal
        v-if="modals.confirmPasswordModal.visible.value"
        @confirm="modals.confirmPasswordModal.onConfirm"
        @cancel="modals.confirmPasswordModal.onCancel"
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
