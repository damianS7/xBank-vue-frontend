<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <form
      :resolver="resolver"
      @submit.prevent="onFormSubmit"
      class="flex flex-col gap-4"
    >
      <div class="flex flex-col gap-1">
        <input
          v-model="form.email"
          name="email"
          type="email"
          placeholder="Email"
          class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span v-if="errors?.email" class="text-sm text-red-500">{{
          errors.email[0]
        }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <input
          v-model="form.password"
          name="password"
          type="password"
          placeholder="Password"
          class="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span v-if="errors?.password" class="text-sm text-red-500">{{
          errors.password[0]
        }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <span v-if="errors?.form" class="text-sm text-red-500">{{
          errors.form
        }}</span>
      </div>

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Iniciar sesión
      </button>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
// import { useToast } from "primevue/usetoast";
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

function redirectBackToLastPage() {
  const redirectPath = route.query.redirect?.toString() || "/home";
  router.push(redirectPath);
}

// Check if the user is already authenticated
if (authStore.isAuthenticated) {
  redirectBackToLastPage();
}

// const toast = useToast();
const form = ref({
  email: "",
  password: "",
});

const errors = ref<{ form?: string; email?: string[]; password?: string[] }>(
  {}
);

const resolver = ref(
  z.object({
    // email: z.string().min(1, { message: "Email is required." }),
    email: z.string().nonempty({
      message: "Email cannot be empty.",
    }),
    password: z.string().nonempty({
      message: "Password cannot be empty.",
    }),
  })
);

const onFormSubmit = async () => {
  let email = form.value.email;
  let password = form.value.password;
  const result = resolver.value.safeParse(form.value);

  if (!result.success) {
    // Extraer errores
    errors.value = result.error.flatten().fieldErrors;
    return;
  }

  // Limpiar errores y hacer login
  errors.value = {};
  try {
    await authStore.login(email, password);
    redirectBackToLastPage();
  } catch (error: unknown) {
    // toast
    errors.value.form = error.message || "An error occurred.";
  }
  // get customer /me
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
}
</style>
